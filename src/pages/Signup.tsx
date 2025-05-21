
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupForm } from "@/components/auth/SignupForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const Signup = () => {
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
        <SignupForm />
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
