
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ResetPasswordForm } from "@/components/auth/form-fields/ResetPasswordForm";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-t-4 border-t-primary">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t bg-muted/10 p-6">
              <div className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="flex items-center justify-center text-primary hover:text-primary/90 transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
