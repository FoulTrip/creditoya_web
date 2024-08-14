import TokenService from "@/classes/TokenServices";
import UserService from "@/classes/UserServices";
import cloudinary from "@/lib/cloudinary-conf";
import { DeleteFileGcs } from "@/lib/storage";
import { NextResponse } from "next/server";

interface changeImgProps {
  userId: string;
  type: string;
  upId: string;
}

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

    const { userId, type, upId }: changeImgProps = await req.json();

    const deleteFile = await DeleteFileGcs({ type, userId, upId }).catch(
      (error) => {
        console.log(error);
        throw new Error(error.message);
      }
    );

    if (deleteFile.success == true) {
      await UserService.setDocumentToUndefined(userId);

      return NextResponse.json({ success: true });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
