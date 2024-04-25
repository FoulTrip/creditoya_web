import TokenService from "@/classes/TokenServices";
import { EmailTemplate } from "@/components/mail/Template";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

export async function POST(req: Request) {
  const {
    name,
    addressee,
    code,
  }: { name: string; addressee: string; code: number } = await req.json();
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
    ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }
    const data = await resend.emails.send({
      from: "Credito Ya <onboarding@resend.dev>",
      to: [addressee],
      subject: "🔒 Tu codigo de confirmacion de prestamo",
      text: "it Works",
      react: EmailTemplate({ firstName: name, code: code }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
