

import { transporter } from "@/lib/NodeMailer";
import { generateMailSignup } from "./generates/GenerateCreateMail";

export const SendMailSignup = async ({
  completeName,
  email,
}: {
  completeName: string;
  email: string;
}) => {
  try {
    if (!completeName) throw new Error("!completeName is required");

    const content = generateMailSignup(completeName);

    const data = await transporter.sendMail({
      from: `"Credito Ya" <${process.env.GOOGLE_EMAIL}>`,
      to: email,
      subject: "Bienvenido a Credito Ya",
      text: "Thanks you for creating your account",
      html: content,
    });

    console.log(data);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
