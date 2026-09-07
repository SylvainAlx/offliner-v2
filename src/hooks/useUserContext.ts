import { useContext } from "react";
import { UserContext, type UserContextValue } from "../contexts/UserContext";

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext);
  if (ctx === null) {
    throw new Error("useUserContext must be used inside <UserProvider>");
  }
  return ctx;
}
