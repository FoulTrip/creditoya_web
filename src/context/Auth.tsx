"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import Cookies from "js-cookie";

import { AuthUser } from "@/types/User";

interface GlobalContextType {
  user: AuthUser | null;
  setUserData: (userData: AuthUser) => void;
  handleLogout: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const infoSession = Cookies.get("userData");
    if (infoSession) {
      setUser(JSON.parse(infoSession));
    }
  }, []);

  const setUserData = (userData: AuthUser) => {
    setUser(userData);
    Cookies.set("userData", JSON.stringify(userData), { expires: 1 });
  };

  const handleLogout = () => {
    setUser(null);
    Cookies.remove("userData");
  };

  return (
    <GlobalContext.Provider value={{ user, setUserData, handleLogout }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
