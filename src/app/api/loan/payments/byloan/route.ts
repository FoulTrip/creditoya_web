import PaymentServices from "@/classes/PaymentServices";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";

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

    const { loanId } = await req.json();

    if (!loanId) throw new Error("!loanId is required");

    const response = await PaymentServices.getAllbyLoanId(loanId);

    if (response) return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
