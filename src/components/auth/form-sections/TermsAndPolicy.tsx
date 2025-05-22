
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";

export const TermsAndPolicy = () => {
  const form = useFormContext();
  
  console.log("Rendering TermsAndPolicy, form value:", form.getValues("agreeToTerms"));
  
  return (
    <FormField
      control={form.control}
      name="agreeToTerms"
      render={({ field }) => {
        console.log("TermsAndPolicy field value:", field.value);
        return (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                id="agreeToTerms"
                aria-required="true"
                aria-invalid={form.formState.errors.agreeToTerms ? "true" : "false"}
                data-testid="terms-checkbox"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel htmlFor="agreeToTerms" className="text-sm font-medium cursor-pointer">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline underline-offset-4 transition-colors">
                  terms of service
                </Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline underline-offset-4 transition-colors">
                  privacy policy
                </Link>
              </FormLabel>
              <FormMessage data-testid="terms-error" />
            </div>
          </FormItem>
        );
      }}
    />
  );
};
