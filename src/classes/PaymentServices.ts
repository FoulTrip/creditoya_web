import { prisma } from "@/prisma/db";
import { ScalarPaymentLoan } from "@/types/User";
import { paymentsLoan } from "@prisma/client";

class PaymentServices {
  /* Metodo para crear un registro de pago en un prestamo activo */
  static async create(data: ScalarPaymentLoan): Promise<paymentsLoan> {
    return prisma.paymentsLoan.create({ data });
  }

  /* Metodo para obtener todos los registros de pago de un prestamo activo */
  static async getAllbyLoanId(loanId: string): Promise<paymentsLoan[]> {
    if (!prisma.paymentsLoan) {
      throw new Error("Prisma paymentsLoan client is not defined");
    }
    
    return prisma.paymentsLoan.findMany({
      where: { loanApplicationId: loanId },
    });
  }
}

export default PaymentServices;
