import LoanApplicationService from "@/classes/LoanApplicationServices";
import { ScalarLoanApplication } from "@/types/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data: ScalarLoanApplication = await req.json();

    const response = await LoanApplicationService.create(data);

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    }
  }
}
