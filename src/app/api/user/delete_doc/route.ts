import TokenService from "@/classes/TokenServices";
import UserService from "@/classes/UserServices";
import cloudinary from "@/lib/cloudinary-conf";
import { DeleteFileGcs } from "@/lib/storage";
import { NextResponse } from "next/server";

interface ChangeImgProps {
  userId: string;
  type: string;
  upId: string;
}

export async function POST(req: Request) {
  try {
    // Verificar si el token de autorización está presente
    const authToken = req.headers.get("authorization");
    if (!authToken) {
      return NextResponse.json({ success: false, error: "Token is required" });
    }

    const token = authToken.split(" ")[1];
    const payload = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!payload) {
      return NextResponse.json({ success: false, error: "Invalid token" });
    }

    const { userId, type, upId }: ChangeImgProps = await req.json();

    // Intentar eliminar el archivo y manejar el resultado
    const deleteResult = await DeleteFileGcs({ type, userId, upId });

    if (!deleteResult.success) {
      throw new Error(deleteResult.message);
    }

    // Actualizar el documento del usuario
    await UserService.setDocumentToUndefined(userId);

    return NextResponse.json({ success: true, message: deleteResult.message });
  } catch (error) {
    console.error("Error in POST /change-image:", error);
    return NextResponse.json({
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
