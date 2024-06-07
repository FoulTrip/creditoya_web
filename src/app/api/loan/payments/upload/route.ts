import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary-conf";
import fs from "fs/promises";
import path from "path";

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
    console.log(token);

    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const loanId = formData.get("loanId") as string;

    console.log("file", file);
    console.log("loanId", loanId);

    // Archivo temporal en el servidor
    const temPath = path.join(process.cwd(), "public", `${loanId}.pdf`);
    await fs.writeFile(temPath, Buffer.from(await file.arrayBuffer()));

    const randomPublicId = `${loanId}-${Math.random()
      .toString(36)
      .substring(7)}`;

    const uploadStream = await cloudinary.v2.uploader.upload(temPath, {
      resource_type: "raw",
      format: "pdf",
      folder: "payments_loans",
      public_id: randomPublicId,
    });

    // Elimino archivo temporal
    await fs.unlink(temPath);

    return NextResponse.json({ success: true, data: uploadStream.secure_url });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
