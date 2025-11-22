import * as Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/DB/Prisma';

const stripeClient = new Stripe.Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }
    // Hole den Warenkorb des Benutzers
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "Warenkorb ist leer" },
        { status: 400 }
      );
    }
    // Erstelle die Stripe Checkout Session
    const lineItems: Stripe.Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map(item => ({
      price_data: { 
        currency: 'eur',
        product_data: {
          name: item.product.name,
        },
        unit_amount: Math.round(item.product.price), // Preis in Cent
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await stripeClient.checkout.sessions.create({   
        payment_method_types: ['card', 'amazon_pay'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
        client_reference_id: session.user.id
    });
    return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
    console.error("Fehler beim Erstellen der Checkout-Session:", error);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Checkout-Session" },
      { status: 500 }
    );
  }
}