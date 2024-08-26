import { transporter } from "@/lib/NodeMailer";
import TokenService from "@/classes/TokenServices";
// import { EmailTemplate } from "@/components/mail/Template";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // // Verificar la autenticación JWT
    // const authorizationHeader = req.headers.get("Authorization");

    // if (!authorizationHeader) {
    //   return NextResponse.json(
    //     { message: "Token de autorización no proporcionado" },
    //     { status: 401 }
    //   );
    // }

    // const token = authorizationHeader.split(" ")[1];

    // const decodedToken = TokenService.verifyToken(
    //   token,
    //   process.env.JWT_SECRET as string
    // ); // Reemplaza "tu-clave-secreta" con tu clave secreta

    // if (!decodedToken) {
    //   return NextResponse.json({ message: "Token no válido" }, { status: 401 });
    // }

    const {
      name,
      addressee,
      code,
    }: { name: string; addressee: string; code: number } = await req.json();

    const data = await transporter.sendMail({
      from: `"Credito ya" ${process.env.GOOGLE_EMAIL} `,
      to: addressee,
      subject: "🔒 Tu código de cambio de contraseña",
      text: "¡Funciona!",
      html: `
        <div>
          <p>Hola ${name}</p>
          <p>tu codigo es: ${code}</p>
        </div>
      `,
    });

    transporter.close();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
