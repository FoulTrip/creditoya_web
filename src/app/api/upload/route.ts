import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";
import TokenService from "@/classes/TokenServices";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

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
    ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }
    const data = await req.formData();
    const file = data.get("file");

    console.log(file);

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json("No se ha subido ninguna imagen", {
        status: 400,
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filePath = path.join(process.cwd(), "public", file.name);

    await fs.promises.writeFile(filePath, buffer);

    const response = await cloudinary.uploader.upload(filePath);

    const url = response.secure_url;

    return NextResponse.json(url);
  } catch (error) {
    console.error(`Error al escribir el archivo: ${error}`);
    return NextResponse.json("Error al escribir el archivo", { status: 500 });
  }
}