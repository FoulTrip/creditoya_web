// Importar las declaraciones necesarias
import { prisma } from "@/prisma/db";
import { pdfLoan } from "@prisma/client";
import { ScalarPdfLoan } from "@/types/User";

// Clase para el servicio de PDF Loan
class PdfLoanService {
  // Método para crear un PDF Loan
  static async create(data: ScalarPdfLoan): Promise<pdfLoan> {
    return prisma.pdfLoan.create({ data });
  }

  // Método para obtener un PDF Loan por su ID
  static async get(id: string): Promise<pdfLoan | null> {
    return prisma.pdfLoan.findUnique({ where: { id } });
  }

  // Método para obtener un PDF Loan por su loanApplicationId
  static async getByLoanApplicationId(
    loanApplicationId: string
  ): Promise<pdfLoan | null> {
    return prisma.pdfLoan.findFirst({
      where: { loanApplicationId },
    });
  }

  // Método para actualizar un PDF Loan
  static async update(id: string, data: ScalarPdfLoan): Promise<pdfLoan> {
    return prisma.pdfLoan.update({ where: { id }, data });
  }

  // Método para eliminar un PDF Loan
  static async delete(id: string): Promise<pdfLoan> {
    return prisma.pdfLoan.delete({ where: { id } });
  }
}

// Exportar la clase PdfLoanService
export default PdfLoanService;
