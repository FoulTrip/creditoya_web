import TokenService from "@/classes/TokenServices";
import UserService from "@/classes/UserServices";
import cloudinary from "@/lib/cloudinary-conf";
import { NextResponse } from "next/server";

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

    const { docId } = await req.json();

    if (!docId) throw new Error("document Id is required");

    const nameFile = `images_with_cc/selfie-${docId}`;

    const response = await UserService.imageWithCCToUndefined(docId);

    await cloudinary.v2.uploader.destroy(nameFile);

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
