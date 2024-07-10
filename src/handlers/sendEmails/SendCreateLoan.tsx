import { transporter } from "@/lib/NodeMailer";
import { generateMailCreateLoan } from "./generates/GenerateCreateLoan";

export const sendCreateLoan = async ({
  completeName,
  email,
  loanId,
}: {
  completeName: string;
  email: string;
  loanId: string;
}) => {
  try {
    const content = generateMailCreateLoan({
      completeName,
      loanId,
    });

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
    console.error("Error Sending email: ", error);
    return false;
  }
};
