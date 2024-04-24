import TokenService from "@/classes/TokenServices";
import UserService from "@/classes/UserServices";
import { ScalarDocument } from "@/types/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, number, documentFront, documentBack }: ScalarDocument =
      await req.json();

    const authToken = req.headers.get("Authorization");
    const token = authToken?.split(" ")[1];

    if (!token) {
      throw new Error("Token is required");
    }

    const payload = TokenService.verifyToken(
      token as string,
      process.env.JWT_SECRET as string
    );

    console.log(token);
    console.log(payload);

    if (!payload) {
      throw new Error("Token inválido");
    }

    const response = await UserService.updateDocument(
      userId,
      documentFront as string,
      documentBack as string,
      number
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }
  }
}
