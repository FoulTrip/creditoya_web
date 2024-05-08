import LoanApplicationService from "@/classes/LoanApplicationServices";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import UserService from "@/classes/UserServices"; // Importamos la clase UserService

export async function PUT(req: Request) {
  try {
    const authToken = req.headers.get("authorization");
    const token = authToken?.split(" ")[1];

    if (!token) {
      throw new Error("Token is required");
    }

    const payload = TokenService.verifyToken(
      token as string,
      process.env.JWT_SECRET as string
    );

    if (!payload) {
      throw new Error("Token inválido");
    }

    const { userId, data } = await req.json();

    console.log(data);

    if (!userId) throw new Error("LoanId is required!");
    if (!data) throw new Error("LoanId is required!");

    // Obtenemos el usuario
    const user = await UserService.get(userId);

    console.log(user);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Actualizamos los datos del usuario
    const updatedUser = { ...user, ...data };

    console.log(updatedUser);

    // Actualizamos los datos del usuario utilizando el UserService
    const response = await UserService.update({
      id: userId,
      data: updatedUser,
    });

    console.log(response);

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
