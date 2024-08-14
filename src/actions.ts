"use server";

import UserService from "./classes/UserServices";
import { ScalarUser } from "./types/User";

type ErrorDetails = {
  emailError?: string;
  passwordError?: string;
  generalError?: string;
};

export async function createUser(
  data: ScalarUser
): Promise<{ success: boolean; errors?: ErrorDetails }> {
  const errorDetails: ErrorDetails = {};

  try {
    // Intentar crear el usuario
    await UserService.create(data);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      // Clasificar los errores basados en los mensajes
      if (error.message.includes("El correo electrónico no es válido.")) {
        errorDetails.emailError = "El correo electrónico no es válido.";
      } else if (
        error.message.includes("La contraseña debe tener al menos 6 caracteres")
      ) {
        errorDetails.passwordError =
          "La contraseña debe cumplir con los requisitos.";
      } else if (
        error.message.includes("El correo electrónico ya está en uso.")
      ) {
        errorDetails.emailError = "El correo electrónico ya está en uso.";
      } else {
        errorDetails.generalError =
          "Se produjo un error inesperado. Por favor, intente nuevamente.";
      }
    } else {
      errorDetails.generalError =
        "Se produjo un error inesperado. Por favor, intente nuevamente.";
    }
    return { success: false, errors: errorDetails };
  }
}
