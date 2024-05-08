// Import statements
import { prisma } from "@/prisma/db";
import { ScalarUser } from "@/types/User";
import { Document, User } from "@prisma/client";
import bcrypt from "bcryptjs";

// Class definition
class UserService {
  // Create user method
  static async create(data: ScalarUser): Promise<User> {
    const existEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existEmail) {
      throw new Error("El correo electrónico ya está en uso");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        Document: {
          create: {},
        },
      },
    });
  }

  // Get user by ID method
  static async get(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  // Update user method
  static async update({
    id,
    data,
  }: {
    id: string;
    data: Omit<ScalarUser, "password">;
  }) {
    const { id: userId, ...userData } = data;
    return await prisma.user.update({ where: { id }, data: userData });
  }

  // Update user password method
  static async updatePassword(id: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  // Delete user method
  static async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  // Sign in user method
  static async signin(email: string, password: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Credenciales inválidas");
    }

    return user;
  }

  // Check if user has document data method
  static async hasDocumentData(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Document: true },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Comprueba si el usuario tiene documentos y si los campos son diferentes de "void"
    return user.Document.some(
      (document) =>
        document.documentFront !== "No definido" &&
        document.documentBack !== "No definido" &&
        document.number !== "No definido"
    );
  }

  // Update user document method
  static async updateDocument(
    userId: string,
    documentFront: string,
    documentBack: string,
    number: string
  ): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Document: true },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Actualiza los documentos del usuario
    const updatedDocuments = user.Document.map((document) =>
      prisma.document.update({
        where: { id: document.id },
        data: {
          documentFront: documentFront,
          documentBack: documentBack,
          number: number,
        },
      })
    );

    await Promise.all(updatedDocuments);

    return prisma.user.findUnique({
      where: { id: userId },
      include: { Document: true },
    });
  }

  // List user documents method
  static async listDocuments(userId: string): Promise<Document[]> {
    const documents = await prisma.document.findMany({
      where: { userId: userId },
    });

    if (!documents) {
      throw new Error("No se encontraron documentos para este usuario");
    }

    return documents;
  }

  // Método para obtener un documento por userId
  static async getDocumentByUserId(userId: string): Promise<Document | null> {
    const document = await prisma.document.findFirst({
      where: { userId },
    });

    return document;
  }
}

// Export the UserService class
export default UserService;
