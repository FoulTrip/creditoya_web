// app/api/temp/[filename]/route.ts
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Obtén el nombre del archivo de la URL
    const url = new URL(req.url);
    const filename = url.pathname.split("/").pop() as string;

    // Define la ruta del archivo en /tmp
    const filePath = path.join("/tmp", "temp", filename);

    // Verifica si el archivo existe
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=" + filename, // Cambia a "inline" para visualizar en el navegador
        },
      });
    } else {
      return new NextResponse("Archivo no encontrado", { status: 404 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
  }
}
