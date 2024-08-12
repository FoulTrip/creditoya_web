import UserService from "@/classes/UserServices";
import { generateMailBirthDay } from "@/handlers/sendEmails/generates/generateBirthDay";
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
    const birthDayToday: ScalarUser[] | string =
      await UserService.getUsersWithBirthdayToday();

    if (typeof birthDayToday === "string") {
      // Si birthDayToday es un mensaje de texto, retorna directamente
      return NextResponse.json({ ok: true, message: birthDayToday });
    }

    if (birthDayToday.length > 0) {
      // Itera sobre el array de usuarios y envía correos a cada uno
      for (const user of birthDayToday) {
        const addressee: string = user.email;
        const completeName: string = `${user.names} ${user.firstLastName} ${user.secondLastName}`;

        const content = generateMailBirthDay({ completeName });

        await transporter.sendMail({
          from: `"Credito Ya" <${process.env.GOOGLE_EMAIL}>`,
          to: addressee,
          subject: "Credito ya, te desea Feliz Cumpleaños",
          text: `Hola ${user.names}, ¡Feliz cumpleaños! Gracias por ser parte de nuestra comunidad.`,
          html: content,
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ ok: false, error: error.message });
    }
  }
}
