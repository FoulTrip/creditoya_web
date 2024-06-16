import { ScalarLoanApplication, Status } from "./User";

export type EventClient = {
  type: EventsClient;
  data: ScalarLoanApplication | ScalarLoanApplication[] | reqChangeState;
};

export type reqChangeState = {
  userId: string;
  nameUser: string;
  emailUser: string;
  employeeId: string;
  loanApplicationId: string;
  state: Status;
  reason: string | null;
};

type EventsClient = "updateLoan";
