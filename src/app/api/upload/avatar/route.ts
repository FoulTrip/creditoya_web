import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary-conf";
import TokenService from "@/classes/TokenServices";
import fs from "fs";
import path from "path";

const uploadDir = path.join("/tmp", "temp");

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

    // Manejo del formulario y carga del archivo
    const formData = await req.formData();
    const file = formData.get("img") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json({
        success: false,
        error: "Archivo o ID de usuario no proporcionados.",
      });
    }

    // Guardar el archivo temporalmente
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filePath = path.join(uploadDir, `avatar_${userId}.pdf`);
    fs.writeFileSync(filePath, buffer);

    // Subir el archivo a Cloudinary
    const responseUpload = await cloudinary.v2.uploader.upload(filePath, {
      folder: "avatars_users",
      public_id: `avatar.${userId}`,
    });

    // Eliminar el archivo temporal
    fs.unlinkSync(filePath);

    return NextResponse.json({
      success: true,
      data: responseUpload.secure_url,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
