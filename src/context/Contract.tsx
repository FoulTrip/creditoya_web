"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import Cookies from "js-cookie";

import { ContractContextType } from "@/types/ContractContext";
import { ScalarLoanApplication } from "@/types/User";

const GlobalContext = createContext<ContractContextType | undefined>(
  undefined
);

export function ContractProvider({ children }: { children: ReactNode }) {
  const [loan, setLoan] = useState<ScalarLoanApplication | null>(null);

  useEffect(() => {
    const savedLoan = Cookies.get("respaldeLoan");
    if (savedLoan) {
      setLoan(JSON.parse(savedLoan));
    }
  }, []);

  const setLoanInfo = (loan: ScalarLoanApplication) => {
    setLoan(loan);
    Cookies.set("respaldeLoan", JSON.stringify(loan));
  };

  return (
    <GlobalContext.Provider value={{ loan, setLoanInfo }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useContractContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
