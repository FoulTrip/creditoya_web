import TokenService from "@/classes/TokenServices";
import UserService from "@/classes/UserServices";
import { ScalarDocument } from "@/types/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, number, documentFront, documentBack }: ScalarDocument =
      await req.json();

    console.log(userId, number, documentBack, documentFront);

    const authToken = req.headers.get("Authorization");
    const token = authToken?.split(" ")[1];

    console.log(token);

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

    console.log(number, documentBack, documentFront)

    const response: ScalarDocument[] = await UserService.updateDocument(
      userId,
      documentFront as string,
      documentBack as string,
      number as string
    );

    console.log(response);

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
