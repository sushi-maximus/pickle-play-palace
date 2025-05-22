
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ValidationIcon } from "./ValidationIcon";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PasswordInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  "data-testid"?: string; // Add data-testid prop
}

export function PasswordInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "••••••••",
  required = false,
  disabled = false,
  autoComplete = "new-password",
  className,
  "data-testid": dataTestId,
}: PasswordInputFieldProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { error } = fieldState;
        
        return (
          <FormItem className={cn("space-y-2", className)}>
            <FormLabel className="text-sm font-medium">
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder}
                  required={required}
                  disabled={disabled}
                  autoComplete={autoComplete}
                  className={cn(
                    "pr-10 input-focus-animation",
                    error ? "border-destructive/50 focus:border-destructive" : "",
                    !error && fieldState.isDirty ? "border-primary/50 focus:border-primary" : ""
                  )}
                  data-testid={dataTestId} // Use data-testid prop
                  {...field}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {fieldState.isDirty && (
                  <ValidationIcon valid={!error} className="right-8" />
                )}
              </div>
            </FormControl>
            <FormMessage data-testid={`${name}-error`} /> {/* Add data-testid to FormMessage */}
          </FormItem>
        );
      }}
    />
  );
}
