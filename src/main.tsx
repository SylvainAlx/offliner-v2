import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";
import { migrateLegacyStorage } from "./services/migrateStorage";
import { useUser } from "./stores/userStore";

async function bootstrap() {
  await migrateLegacyStorage();
  await useUser.getState().hydrate();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
