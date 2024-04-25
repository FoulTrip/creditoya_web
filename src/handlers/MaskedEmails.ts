export function MaskedMail(email: string) {
  // Obtiene los primeros 4 caracteres del correo electrónico
  const firstFourChars = email.slice(0, 4);
  // Obtiene el resto del correo electrónico desde el cuarto carácter hasta el arroba
  const hiddenPart = email.slice(4, email.indexOf("@")).replace(/./g, "*");
  // Concatena los primeros 4 caracteres con los asteriscos
  const maskedEmail =
    firstFourChars + hiddenPart + email.slice(email.indexOf("@"));

  return maskedEmail;
}
