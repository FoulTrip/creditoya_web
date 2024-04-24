import TokenService from "@/classes/TokenServices";
import UserService from "@/classes/UserServices";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email && !password) {
      throw new Error("email or password are required");
    }

    const user = await UserService.signin(email, password);

    const payload = { userId: user.id, userEmail: user.email };
    const secret = process.env.JWT_SECRET as string;
    const token = TokenService.createToken(payload, secret);

    return NextResponse.json({ success: true, data: { ...user, token } });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
