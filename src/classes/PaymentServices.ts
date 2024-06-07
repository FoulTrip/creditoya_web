import { prisma } from "@/prisma/db";
import { ScalarPaymentLoan, StatusPaymentSignature } from "@/types/User";
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

  static async statusChange(
    payId: string,
    status: StatusPaymentSignature
  ): Promise<paymentsLoan> {
    console.log(payId)
    console.log(status)
    return prisma.paymentsLoan.update({
      where: { id: payId },
      data: { status: status },
    });
  }

  static async addSignature(
    payId: string,
    signature: string
  ): Promise<paymentsLoan> {
    console.log(payId)
    console.log(signature)
    return prisma.paymentsLoan.update({
      where: { id: payId },
      data: { signature: signature },
    });
  }
}

export default PaymentServices;
