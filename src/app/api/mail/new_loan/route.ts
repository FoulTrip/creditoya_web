import { transporter } from "@/lib/NodeMailer";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import { generateMailSignup } from "@/handlers/sendEmails/generates/GenerateCreateMail";
import { generateMailCreateLoan } from "@/handlers/sendEmails/generates/GenerateCreateLoan";

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
    ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    }

    const {
      name,
      addressee,
      loanId,
    }: { name: string; addressee: string; loanId: string } = await req.json();

    const content = generateMailCreateLoan({ completeName: name, loanId });

    const data = await transporter.sendMail({
      from: `"Credito Ya" <${process.env.GOOGLE_EMAIL}>`,
      to: addressee,
      subject: "Nueva solicitud de prestamo",
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
