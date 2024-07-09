import UserService from "@/classes/UserServices";
import { ScalarUser } from "@/types/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Desestructuramos los campos necesarios del cuerpo de la solicitud
    const {
      names,
      firstLastName,
      secondLastName,
      email,
      password,
    }: ScalarUser = await req.json();

    // console.log(names, firstLastName, secondLastName, email, password);

    // Creamos un nuevo usuario utilizando el servicio de usuario
    const newUser = await UserService.create({
      names,
      firstLastName,
      secondLastName,
      email,
      password,
    });

    // console.log(newUser);

    if (newUser) return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
