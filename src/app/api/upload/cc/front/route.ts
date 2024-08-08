import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary-conf";
import TokenService from "@/classes/TokenServices";

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

    const { img, type, userId } = await req.json();

    // Verificar que la imagen esté en formato base64
    if (!img || !img.startsWith("data:image/png;base64,")) {
      throw new Error("Imagen en formato incorrecto");
    }

    // Eliminar el prefijo 'data:image/png;base64,' del base64
    const base64Data = img.replace(/^data:image\/png;base64,/, "");

    // Subir la imagen a Cloudinary
    const response = await cloudinary.v2.uploader.upload(
      `data:image/png;base64,${base64Data}`, // Asegúrate de que la cadena base64 esté correctamente formateada
      {
        folder: "credito_ya_docs",
        public_id: `${type}-${userId}`,
        // Puedes agregar más opciones aquí si es necesario
      }
    );

    return NextResponse.json({
      success: true,
      data: response.secure_url, // URL pública de la imagen subida
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
