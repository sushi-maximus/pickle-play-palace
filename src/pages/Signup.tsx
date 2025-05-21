
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignupForm } from "@/components/auth/SignupForm";

const Signup = () => {
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
