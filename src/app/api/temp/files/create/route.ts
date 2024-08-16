import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import mime from "mime-types";

// Configura el directorio de subida en /public/temp
const uploadDir = path.join(process.cwd(), "public", "temp");

export async function POST(req: Request) {
  try {
    // Asegúrate de que el directorio existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Obtén los datos del formulario
    const formData = await req.formData();
    const nameFile = formData.get("name") as string;
    const file = formData.get("file") as File;

    if (!nameFile || !file) {
      return NextResponse.json({
        success: false,
        error: "Falta el archivo o nombre del archivo.",
      });
    }

    // Determinar la extensión del archivo según el tipo MIME
    const fileType = file.type;
    const fileExtension = mime.extension(fileType) || "pdf";

    // Lee el archivo como un buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Guarda el archivo en el directorio público con la extensión correcta
    const filePath = path.join(uploadDir, `${nameFile}.${fileExtension}`);
    fs.writeFileSync(filePath, buffer);

    // Genera la URL accesible desde el frontend
    const fileUrl = `/temp/${nameFile}.${fileExtension}`;

    return NextResponse.json({
      success: true,
      data: fileUrl,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
