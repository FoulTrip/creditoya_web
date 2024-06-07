import PaymentServices from "@/classes/PaymentServices";
import TokenService from "@/classes/TokenServices";
import { StatusPaymentSignature } from "@/types/User";
import { NextResponse } from "next/server";

interface reqCreate {
  loanId: string;
  signature: string;
  status: StatusPaymentSignature;
  nameClient: string;
  documentClient: string;
  quantity: string;
  quota: string;
}

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

    const {
      loanId,
      signature,
      status,
      nameClient,
      documentClient,
      quantity,
      quota,
    }: reqCreate = await req.json();

    console.log(
      loanId,
      signature,
      status,
      nameClient,
      documentClient,
      quantity,
      quota
    );

    const response = await PaymentServices.create({
      loanApplicationId: loanId,
      nameClient,
      documentClient,
      signature,
      quantity,
      status,
      quota,
    });

    if (response) {
      return NextResponse.json({ success: true, data: response });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
