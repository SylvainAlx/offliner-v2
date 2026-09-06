import { useContext } from "react";

import {
  OnlineStatusContext,
  type OnlineStatusContextValue,
} from "../contexts/OnlineStatusContext";

export function useOnlineStatusContext(): OnlineStatusContextValue {
  const ctx = useContext(OnlineStatusContext);
  if (ctx === null) {
    throw new Error(
      "useOnlineStatusContext must be used inside <OnlineStatusProvider>",
    );
  }
  return ctx;
}
