import type { ReactNode } from "react";
import { useUser } from "../hooks/useUser";
import { UserContext } from "../contexts/UserContext";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const value = useUser();

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
