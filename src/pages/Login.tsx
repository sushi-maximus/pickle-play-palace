
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect already authenticated users
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;
