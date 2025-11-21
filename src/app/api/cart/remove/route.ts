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

    const { cartItemId } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { error: "CartItem ID fehlt" },
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

    if (!cartItem ) {
      return NextResponse.json(
        { error: "CartItem nicht gefunden" },
        { status: 404 }
      );
    }
    if (cartItem.cart.userId !== session.user.id) {
        return NextResponse.json(
            {error: "Keine Berechtigung"},
            {status: 403}
        )
    }

    // Lösche das CartItem
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Artikel entfernt",
    });
  } catch (error) {
    console.error("Fehler beim Entfernen des Artikels:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}
