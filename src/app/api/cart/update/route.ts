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

    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Ungültige Daten" },
        { status: 400 }
      );
    }

    // Prüfe ob das CartItem dem Benutzer gehört
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "CartItem nicht gefunden oder keine Berechtigung" },
        { status: 404 }
      );
    }

    if (cartItem.cart.userId !== session.user.id) {
      return NextResponse.json(
        { error: "keine Berechtigung" },
        { status: 403 }
      );
    }

    // Aktualisiere die Menge
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: quantity,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menge aktualisiert",
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Menge:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
