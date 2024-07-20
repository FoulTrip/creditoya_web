import { ScalarUser } from "@/types/User";

const keyToStringMap: { [key in keyof ScalarUser | string]: string } = {
  avatar: "Avatar",
  birth_day: "Fecha de nacimiento",
  city: "Ciudad",
  email: "Correo electronico",
  firstLastName: "Primer apellido",
  genre: "Genero",
  names: "Nombre",
  phone: "Numero de telefono",
  secondLastName: "Segundo apellido",
  password: "Contraseña",
  residence_address: "Direccion de residencia",
  residence_phone_number: "Numero de residencia",
  place_of_birth: "Lugar de nacimiento"
};

export const handleKeyToString = (
  key: string
): string => {
  return keyToStringMap[key as keyof ScalarUser] || key;
};
