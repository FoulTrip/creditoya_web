import { prisma } from "@/prisma/db";
import { CardLabor } from "@prisma/client";

class CardLaborServices {
  // metodo para crear una carta laboral
  static async create(
    userId: string,
    documentId: string,
    fileParts: string[]
  ): Promise<CardLabor[]> {
    const createdFilesParts = await prisma.$transaction(
      fileParts.map((part, index) => {
        return prisma.cardLabor.create({
          data: {
            userId,
            filePart: part,
            order: index,
          },
        });
      })
    );

    await prisma.document.update({
      where: { id: documentId },
      data: { laborCardId: createdFilesParts[0].id },
    });

    return createdFilesParts;
  }

  // metodo para obtener una carta laboral por Id
  static async byId(laborCardId: string): Promise<CardLabor | null> {
    return await prisma.cardLabor.findUnique({ where: { id: laborCardId } });
  }
}

export default CardLaborServices;
