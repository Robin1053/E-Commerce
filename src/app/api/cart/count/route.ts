import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/DB/Prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    // Hole den Warenkorb des Benutzers
    const cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        items: true,
      },
    });

    // Berechne die Gesamtanzahl aller Artikel
    const totalCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return NextResponse.json({ count: totalCount });
  } catch (error) {
    console.error("Fehler beim Abrufen der Warenkorb-Anzahl:", error);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
