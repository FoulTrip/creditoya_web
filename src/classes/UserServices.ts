// Import statements
import { prisma } from "@/prisma/db";
import { ScalarDocument, ScalarUser } from "@/types/User";
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
  static async update({ id, data }: { id: string; data: Partial<User> }) {
    const {
      id: userId,
      password,
      createdAt,
      updatedAt,
      ...updatableData
    } = data;
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updatableData,
      });
      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  // Update Avatar
  static async avatarUpdate({ userId, img }: { userId: string; img: string }) {
    return await prisma.user.update({
      where: { id: userId },
      data: { avatar: img },
    });
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
  static async hasDocumentData(
    userId: string
  ): Promise<{ complete: boolean; missing: string[] }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Document: true },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const missingFields: string[] = [];

    // Verificar si hay documentos
    if (!user.Document.length) {
      missingFields.push(
        "documentFront",
        "documentBack",
        "number",
        "imageWithCC"
      );
    } else {
      user.Document.forEach((document) => {
        if (document.documentFront === "No definido") {
          missingFields.push("documentFront");
        }
        if (document.documentBack === "No definido") {
          missingFields.push("documentBack");
        }
        if (document.number === "No definido") {
          missingFields.push("number");
        }
        if (document.imageWithCC === "No definido") {
          missingFields.push("imageWithCC");
        }
      });
    }

    return {
      complete: missingFields.length === 0,
      missing: missingFields,
    };
  }

  // Update user document method
  static async updateDocument(
    userId: string,
    documentFront: string,
    documentBack: string,
    number: string
  ): Promise<ScalarDocument[]> {
    if (number && documentBack == undefined && documentFront == undefined) {
      await prisma.document.updateMany({
        where: { userId },
        data: {
          number: { set: number },
        },
      });
    }

    if (documentBack) {
      await prisma.document.updateMany({
        where: { userId },
        data: {
          documentBack: { set: documentBack },
        },
      });
    }

    if (documentFront) {
      await prisma.document.updateMany({
        where: { userId },
        data: {
          documentFront: { set: documentFront },
        },
      });
    }

    return prisma.document.findMany({
      where: { userId },
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

  static async imageWithCCUpdate(
    docId: string,
    image: string
  ): Promise<Document | null> {
    return await prisma.document.update({
      where: { id: docId },
      data: { imageWithCC: image },
    });
  }

  static async imageWithCCToUndefined(docId: string): Promise<Document | null> {
    return await prisma.document.update({
      where: { id: docId },
      data: { imageWithCC: "No definido" },
    });
  }

  static async avatarToUndefined(userId: string): Promise<User | null> {
    return await prisma.user.update({
      where: { id: userId },
      data: { avatar: "No definido" },
    });
  }

  static async setDocumentToUndefined(
    userId: string,
    type: string
  ): Promise<ScalarDocument[] | null> {
    if (type == "front") {
      await prisma.document.updateMany({
        where: { userId },
        data: {
          documentFront: "No definido",
        },
      });
    } else if (type == "back") {
      await prisma.document.updateMany({
        where: { userId },
        data: {
          documentBack: "No definido",
        },
      });
    }

    return prisma.document.findMany({
      where: { userId },
    });
  }

  // Method to check for missing fields in User and Document models
  static async checkMissingFields(
    userId: string
  ): Promise<{ complete: boolean; missing: string[] }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Document: true },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const missingFields: string[] = [];

    // Check user fields
    if (!user.avatar || user.avatar === "No definido")
      missingFields.push("avatar");
    if (!user.phone || user.phone === "No definido")
      missingFields.push("phone");
    if (
      !user.residence_phone_number ||
      user.residence_phone_number === "No definido"
    )
      missingFields.push("residence_phone_number");
    if (!user.phone_whatsapp || user.phone_whatsapp === "No definido")
      missingFields.push("phone_whatsapp");
    if (!user.birth_day) missingFields.push("birth_day");
    if (!user.genre || user.genre === "No definido")
      missingFields.push("genre");
    if (!user.residence_address || user.residence_address === "No definido")
      missingFields.push("residence_address");
    if (!user.city || user.city === "No definido") missingFields.push("city");
    if (!user.place_of_birth || user.place_of_birth === "No definido")
      missingFields.push("place_of_birth");

    // Check document fields
    if (!user.Document.length) {
      missingFields.push(
        "documentFront",
        "documentBack",
        "number",
        "imageWithCC"
      );
    } else {
      user.Document.forEach((document) => {
        if (document.documentFront === "No definido")
          missingFields.push("documentFront");
        if (document.documentBack === "No definido")
          missingFields.push("documentBack");
        if (document.number === "No definido") missingFields.push("number");
        if (document.imageWithCC === "No definido")
          missingFields.push("imageWithCC");
      });
    }

    return {
      complete: missingFields.length === 0,
      missing: missingFields,
    };
  }
}

// Export the UserService class
export default UserService;
