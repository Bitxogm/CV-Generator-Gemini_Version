import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import "@/shared/i18n/config";
import { LanguageProvider } from "@/app/providers";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
