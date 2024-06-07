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

    const { img, payId }: { img: string; payId: string } = await req.json();

    console.log("img in server", img);
    console.log("payId in server", payId);

    if (!img) throw new Error("img is reqired");
    if (!payId) throw new Error("payId is reqired");

    const response = await cloudinary.v2.uploader.upload(img, {
      folder: "signatures_payments",
      public_id: `signature.${payId}`,
    });

    console.log("response cloudi: ", response);

    return NextResponse.json({
      success: true,
      data: response.secure_url,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
