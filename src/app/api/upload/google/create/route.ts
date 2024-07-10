import TokenService from "@/classes/TokenServices";
import { UploadToGcs } from "@/lib/storage";
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

    console.log(token);

    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }

    const form = await req.formData();
    // console.log(form);
    const file = form.get("file") as File;
    const userId = form.get("userid") as string;
    const name = form.get("name") as string;

    const uploadRes = await UploadToGcs({ file, userId, name }).catch(
      (error) => {
        console.log(error);
        throw new Error(error.message);
      }
    );

    if (uploadRes && uploadRes.success == true) {
      const bucketName = process.env.NAME_BUCKET_GOOGLE_STORAGE as string;
      return NextResponse.json(
        {
          success: uploadRes,
          data: `https://storage.googleapis.com/${bucketName}/${uploadRes.public_name}`,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }

  return NextResponse.json({ message: "Unknown error" }, { status: 500 });
}
