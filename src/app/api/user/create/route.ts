import UserService from "@/classes/UserServices";
import { ScalarUser } from "@/types/User";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/user:
 *   post:
 *     description: Crea un nuevo usuario
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *               firstLastName:
 *                 type: string
 *               secondLastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - names
 *               - firstLastName
 *               - secondLastName
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error al crear el usuario
 */
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

    console.log(names, firstLastName, secondLastName, email, password);

    // Creamos un nuevo usuario utilizando el servicio de usuario
    const newUser = await UserService.create({
      names,
      firstLastName,
      secondLastName,
      email,
      password,
    });

    console.log(newUser);

    // Si todo va bien, devolvemos una respuesta con el nuevo usuario en formato JSON
    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    // Si algo sale mal, devolvemos una respuesta con un mensaje de error en formato JSON
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
