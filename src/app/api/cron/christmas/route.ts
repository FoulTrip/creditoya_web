import UserService from "@/classes/UserServices";
import { generateMailNewYear } from "@/handlers/sendEmails/generates/generateNewYear";
import { transporter } from "@/lib/NodeMailer";
import { NextResponse } from "next/server";

interface ScalarUser {
  names: string;
  firstLastName: string;
  secondLastName: string;
  email: string;
}

export async function GET() {
  try {
    const allUsers: ScalarUser[] | null =
      await UserService.getUserDetailsMail();

    if (allUsers !== null) {
      for (const user of allUsers) {
        const addressee: string = user.email;
        const completeName: string = `${user.names} ${user.firstLastName} ${user.secondLastName}`;

        const content = generateMailNewYear({ completeName });

        await transporter.sendMail({
          from: `Credito Ya <${process.env.GOOGLE_EMAIL}>`,
          to: addressee,
          subject: "Credito ya, te desea Feliz Navidad y prospero año nuevo",
          text: `Hola ${user.names}, ¡Feliz navidad y prospero año nuevo! Gracias por ser parte de nuestra comunidad.`,
          html: content,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ ok: false });
    }
  }
}
