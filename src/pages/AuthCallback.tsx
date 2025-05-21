
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Process the authentication callback
    const handleAuthCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      
      if (accessToken) {
        try {
          // Set session from the URL hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get("refresh_token") || "",
          });

          if (error) {
            console.error("Error setting auth session:", error);
            toast.error("Authentication failed", {
              description: error.message || "Unable to complete authentication process."
            });
            navigate("/login");
            return;
          }

          if (data.session) {
            console.log("Authentication successful");
            toast.success("Authentication successful", {
              description: "You have been authenticated successfully."
            });
            navigate("/");
          }
        } catch (err) {
          console.error("Error in auth callback:", err);
          toast.error("Authentication error", {
            description: "An unexpected error occurred during authentication."
          });
          navigate("/login");
        }
      } else {
        console.error("No access token found in URL");
        toast.error("Authentication failed", {
          description: "No authentication token found. Please try logging in again."
        });
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing authentication...</h1>
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Please wait while we complete the process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
