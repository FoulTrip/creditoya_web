import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary-conf";
import TokenService from "@/classes/TokenServices";
import { Readable } from "stream"; // Asegúrate de que `stream` esté importado desde el módulo adecuado
import { Buffer } from "buffer"; // Buffer es necesario para convertir ArrayBuffer a Buffer

export async function POST(req: Request) {
  try {
    // Verificar la autenticación JWT
    const authorizationHeader = req.headers.get("Authorization");

    if (!authorizationHeader) {
      return NextResponse.json(
        { message: "Token de autorización no proporcionado" },
        { status: 401 }
      );
    }

    const token = authorizationHeader.split(" ")[1];
    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }

    // Leer los datos del formulario
    const formData = await req.formData();
    const imgFile = formData.get("img");

    if (!(imgFile instanceof Blob)) {
      throw new Error(
        "Archivo de imagen no proporcionado o en formato incorrecto"
      );
    }

    // Convertir Blob a Buffer
    const arrayBuffer = await imgFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir el archivo a Cloudinary
    const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
      const stream = Readable.from(buffer);
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "credito_ya_docs",
          public_id: `${formData.get("type")}-${formData.get("userId")}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.pipe(uploadStream);
    });

    return NextResponse.json({
      success: true,
      data: cloudinaryResponse.secure_url, // URL pública de la imagen subida
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
    return NextResponse.json({
      success: false,
      error: "Unknown error occurred",
    });
  }
}
