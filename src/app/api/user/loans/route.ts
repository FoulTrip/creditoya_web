import LoanApplicationService from "@/classes/LoanApplicationServices";
import TokenService from "@/classes/TokenServices";
import UserService from "@/classes/UserServices";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const authToken = req.headers.get("authorization");
    const token = authToken?.split(" ")[1];

    if (!userId) {
      throw new Error("userId is required");
    }

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

    const response = await LoanApplicationService.getAllByUserId(userId);

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
