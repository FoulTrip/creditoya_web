import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

export async function POST(req: Request) {
  try {
    const authToken = req.headers.get("authorization");
    const token = authToken?.split(" ")[1];

    if (!token) {
      throw new Error("Token is required");
    }

    const payload = TokenService.verifyToken(
      token as string,
      process.env.JWT_SECRET as string
    );

    if (!payload) {
      throw new Error("Token inválido");
    }

    const formData = await req.formData();
    const image = formData.get("file") as File;
    const loanId = formData.get("loanId") as string

    const randomPublicId = `${loanId}-${Math.random()
      .toString(36)
      .substring(7)}`;

    // Crear un objeto Blob del archivo
    const blob = new Blob([image]);

    // Crear una URL del objeto Blob
    const fileUrl = URL.createObjectURL(blob);

    const result = await cloudinary.v2.uploader.upload(fileUrl, {
      resource_type: "image",
      format: "png",
      folder: "payments",
      public_id: randomPublicId,
    });

    return NextResponse.json({ success: true, data: result.url });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
