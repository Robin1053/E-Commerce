import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/DB/Prisma';

export async function PATCH(request: NextRequest) {
  try {
    const { userId, imagePath } = await request.json();

    if (!userId || !imagePath) {
      return NextResponse.json(
        { error: 'Benutzer-ID und Bildpfad sind erforderlich' },
        { status: 400 }
      );
    }

    // Aktualisiere das Profilbild in der Datenbank
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imagePath },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
      message: 'Profilbild erfolgreich aktualisiert',
      status: 200,
    });

  } catch (error) {
    console.error('Fehler beim Aktualisieren des Profilbildes:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler beim Aktualisieren des Profilbildes' },
      { status: 500 }
    );
  }
}