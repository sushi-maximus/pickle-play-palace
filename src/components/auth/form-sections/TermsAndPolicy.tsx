
import { Link } from "react-router-dom";

export const TermsAndPolicy = () => {
  return (
    <div className="text-sm text-muted-foreground">
      By signing up, you agree to our{" "}
      <Link to="/terms" className="text-primary underline underline-offset-4">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link to="/privacy" className="text-primary underline underline-offset-4">
        Privacy Policy
      </Link>
      .
    </div>
  );
};
