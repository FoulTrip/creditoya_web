import LoanApplicationService from "@/classes/LoanApplicationServices";
import TokenService from "@/classes/TokenServices";
import { uploadRandomKey } from "@/handlers/randomUploadKey";
import { UploadToGcs } from "@/lib/storage";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Verificar la autenticación JWT
    const authorizationHeader = req.headers.get("Authorization");

    if (!authorizationHeader) {
      throw new Error("Token de autorización no proporcionado");
    }

    const token = authorizationHeader.split(" ")[1];

    const decodedToken = TokenService.verifyToken(
      token,
      process.env.JWT_SECRET as string
    );

    if (!decodedToken) {
      throw new Error("Token no válido");
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const loanId = formData.get("loanId") as string;

    const upId = uploadRandomKey()

    const addFile = await UploadToGcs({ file, userId, name, upId });

    if (addFile?.success == true) {
      const bucketName = process.env.NAME_BUCKET_GOOGLE_STORAGE as string;
      const uri = `https://storage.googleapis.com/${bucketName}/${addFile.public_name}`;

      if (name == "labor_card") {
        const updateDates = await LoanApplicationService.update(loanId, {
          labor_card: uri,
          upid_labor_card: upId,
        });

        if (updateDates) {
          return NextResponse.json({ success: true, data: updateDates });
        }
      } else if (name == "paid_flyer_01") {
        const updateDates = await LoanApplicationService.update(loanId, {
          fisrt_flyer: uri,
          upid_first_flayer: upId,
        });

        if (updateDates) {
          return NextResponse.json({ success: true, data: updateDates });
        }
      } else if (name == "paid_flyer_02") {
        const updateDates = await LoanApplicationService.update(loanId, {
          second_flyer: uri,
          upid_second_flyer: upId,
        });
        if (updateDates) {
          return NextResponse.json({ success: true, data: updateDates });
        }
      } else if (name == "paid_flyer_03") {
        const updateDates = await LoanApplicationService.update(loanId, {
          third_flyer: uri,
          upid_third_flayer: upId,
        });

        if (updateDates) {
          return NextResponse.json({ success: true, data: updateDates });
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
