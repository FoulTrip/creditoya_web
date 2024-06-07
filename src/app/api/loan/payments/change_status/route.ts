import PaymentServices from "@/classes/PaymentServices";
import TokenService from "@/classes/TokenServices";
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
    );

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }

    const { payId, status } = await req.json();

    console.log(payId, status);

    const response = await PaymentServices.statusChange(payId, status);

    if (!payId) throw new Error("loanId is required");
    if (!status) throw new Error("img is required");

    if (response) return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
