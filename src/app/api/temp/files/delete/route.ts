import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Configura el directorio de subida
const uploadDir = path.join(process.cwd(), "public/temp");

export async function POST(req: Request) {
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const { nameFile } = await req.json();

    if (!nameFile) {
      return NextResponse.json({
        success: false,
        error: "Falta el nombre del archivo.",
      });
    }

    const filePath = path.join(uploadDir, `${nameFile}.pdf`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({
        success: true,
        message: `Archivo ${nameFile}.pdf eliminado exitosamente`,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: `El archivo ${nameFile}.pdf no existe.`,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
