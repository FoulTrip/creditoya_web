import TokenService from "@/classes/TokenServices";
import UserService from "@/classes/UserServices";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { toast } from "sonner";

interface changeImgProps {
  userId: string;
  type: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

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

    const { userId, type }: changeImgProps = await req.json();

    console.log(type);

    const nameFile = `credito_ya_docs/${type}-${userId}`;

    const response = await UserService.setDocumentToUndefined(userId, type);

    console.log(response);

    cloudinary.uploader.destroy(nameFile, (result) => {
      console.log(result);
      toast.success("Eliminado de cloudinary");
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
