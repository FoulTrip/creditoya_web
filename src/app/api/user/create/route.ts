import UserService from "@/classes/UserServices";
import { ScalarUser } from "@/types/User";
import { NextResponse } from "next/server";

/**
 * Función para manejar las solicitudes POST para crear un nuevo usuario.
 *
 * @param req - Se espera que sea un objeto JSON que contenga los campos { email, password, firstName y lastName }
 *
 * @returns - Si la creación del usuario es exitosa, la respuesta será un objeto JSON que representa al nuevo usuario. Si ocurre un error, la respuesta será un objeto JSON que contiene un mensaje de error.
 */
export async function POST(req: Request) {
  try {
    // Desestructuramos los campos necesarios del cuerpo de la solicitud
    const { name, email, password, avatar }: ScalarUser = await req.json();

    // Creamos un nuevo usuario utilizando el servicio de usuario
    const newUser = await UserService.create({
        name,
        email,
        password,
        avatar,
    });

    // Si todo va bien, devolvemos una respuesta con el nuevo usuario en formato JSON
    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    // Si algo sale mal, devolvemos una respuesta con un mensaje de error en formato JSON
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
