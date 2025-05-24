
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "./AppRoutes";

export const AppRouter = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-background font-sans antialiased">
          <AppRoutes />
        </div>
        <Toaster />
      </AuthProvider>
    </Router>
  );
};
