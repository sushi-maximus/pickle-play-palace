
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ValidationIcon } from "./ValidationIcon";
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
}

export function PasswordInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: PasswordInputFieldProps<TFieldValues, TName>) {
  const { 
    control, 
    name, 
    label, 
    placeholder, 
    required = false,
    disabled = false,
    autoComplete = "current-password",
    className
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
                    "pr-20 input-focus-animation",
                    error ? "border-destructive/50 focus:border-destructive" : "",
                    !error && fieldState.isDirty ? "border-primary/50 focus:border-primary" : ""
                  )}
                  {...field}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                  {fieldState.isDirty && (
                    <ValidationIcon valid={!error} />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 ml-1"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? 
                      <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    }
                  </Button>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
