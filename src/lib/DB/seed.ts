import Stripe from "stripe";
import { PrismaClient } from "../../generated/prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

async function sync() {
  // Hole alle Produkte aus Stripe
  const products = await stripe.products.list({ limit: 100 });

  for (const prod of products.data) {
    // Hole dazugehörige Preise
    const prices = await stripe.prices.list({
      product: prod.id,
      limit: 100,
    });

    const stripePrice = prices.data[0];

    await prisma.product.upsert({
      where: { stripeId: prod.id },
      create: {
        name: prod.name,
        description: prod.description ?? "",
        price: stripePrice?.unit_amount ?? 0,
        stripeId: prod.id,
        stripePrice: stripePrice?.id,
        image: prod.images[0] ?? "",
        categoryId: null, // jetzt erlaubt
      },
      update: {
        name: prod.name,
        description: prod.description ?? "",
        price: stripePrice?.unit_amount ?? 0,
        image: prod.images[0] ?? "",
      },
    });
  }

  console.log("Stripe → DB Sync abgeschlossen");
}

sync();
