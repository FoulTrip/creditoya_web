import { transporter } from "@/lib/NodeMailer";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import { generateMailSignup } from "@/handlers/sendEmails/generates/GenerateCreateMail";

export async function POST(req: Request) {
  try {
    const { name, addressee }: { name: string; addressee: string } =
      await req.json();

    const content = generateMailSignup(name);

    const data = await transporter.sendMail({
      from: `"Credito Ya" <${process.env.GOOGLE_EMAIL}>`,
      to: addressee,
      subject: "Bienvenido a Credito Ya",
      text: "Thanks you for creating your account",
      html: content,
    });

    console.log(data);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
