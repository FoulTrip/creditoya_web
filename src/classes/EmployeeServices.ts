import { prisma } from "@/prisma/db";
import { UsersIntranet } from "@prisma/client";

class EmployeeServices {
  static async get(employeeId: string): Promise<UsersIntranet> {
    const user = await prisma.usersIntranet.findUnique({
      where: { id: employeeId },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }
}

export default EmployeeServices;
