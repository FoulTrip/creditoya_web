import LoanApplicationService from "@/classes/LoanApplicationServices";
import TokenService from "@/classes/TokenServices";
import { NextResponse } from "next/server";
import UserService from "@/classes/UserServices"; // Importamos la clase UserService

export async function PUT(req: Request) {
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
    );

    if (!decodedToken) {
      return NextResponse.json({ message: "Token no válido" }, { status: 401 });
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
