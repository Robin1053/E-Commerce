import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/DB/Prisma";

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

    const { productId, quantity } = await request.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Ungültige Daten" },
        { status: 400 }
      );
    }

    // Prüfe ob das Produkt existiert
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produkt nicht gefunden" },
        { status: 404 }
      );
    }

    // Hole oder erstelle den Warenkorb des Benutzers
    let cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      });
    }

    // Prüfe ob das Produkt bereits im Warenkorb ist
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (existingItem) {
      // Erhöhe die Menge
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Füge neues Item hinzu
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Produkt zum Warenkorb hinzugefügt",
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
