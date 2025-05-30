
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeApp } from "@/utils/appInitialization";
import "./index.css";

// Initialize app with performance monitoring
initializeApp();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
