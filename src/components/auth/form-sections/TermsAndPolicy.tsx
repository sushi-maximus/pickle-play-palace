
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Link } from "react-router-dom";

export const TermsAndPolicy = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="agreeToTerms"
      defaultValue={false}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-medium cursor-pointer">
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline underline-offset-4 transition-colors">
                terms of service
              </Link>
              {" "}and{" "}
              <Link to="/privacy" className="text-primary hover:underline underline-offset-4 transition-colors">
                privacy policy
              </Link>
              .
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
