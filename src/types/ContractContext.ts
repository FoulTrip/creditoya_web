import { ScalarLoanApplication } from "./User";

export interface ContractContextType {
  loan: ScalarLoanApplication | null;
  setLoanInfo: (loan: ScalarLoanApplication) => void;
}
