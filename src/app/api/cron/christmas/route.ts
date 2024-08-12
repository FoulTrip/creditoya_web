import UserService from "@/classes/UserServices";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const birthDayToday = await UserService.getUsersWithBirthdayToday();
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ ok: false });
    }
  }
}
