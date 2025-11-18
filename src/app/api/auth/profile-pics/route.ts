// src/app/api/auth/profile-pics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('profilePic') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Datei oder Benutzer-ID fehlt' },
        { status: 400 }
      );
    }

    // Validiere Dateityp
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Nur JPEG, PNG und WebP Dateien sind erlaubt' },
        { status: 400 }
      );
    }

    // Validiere Dateigröße (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Datei ist zu groß (max 5MB)' },
        { status: 400 }
      );
    }

    // Erstelle Upload-Verzeichnis falls es nicht existiert
    const uploadDir = join(process.cwd(), 'public', 'imgs', 'user');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Erstelle Dateiname mit userId und Timestamp
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Konvertiere File zu Buffer und speichere
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Rückgabe des relativen Pfads für die Datenbank
    const relativePath = `/imgs/user/${fileName}`;

    return NextResponse.json({
      success: true,
      imagePath: relativePath,
      message: 'Profilbild erfolgreich hochgeladen',
      status: 200,
    });

  } catch (error) {
    console.error('Fehler beim Upload des Profilbildes:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler beim Upload' },
      { status: 500 }
    );
  }
}