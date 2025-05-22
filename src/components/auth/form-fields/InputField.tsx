
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormInputField } from "./FormInputField";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ValidationIcon } from "./ValidationIcon";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// Interface for standalone input field (not connected to react-hook-form)
interface StandaloneInputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  valid?: boolean;
  className?: string;
  validateFn?: (value: string) => { valid: boolean; message?: string };
  isPassword?: boolean;
}

// Type to allow either standalone or form-controlled usage
export type InputFieldProps = 
  | StandaloneInputFieldProps 
  | (Omit<FormInputField.FormInputFieldProps, 'control'> & { control: Control<any> });

// Type guard to check if props are for FormInputField
function isFormInputField(props: InputFieldProps): props is FormInputField.FormInputFieldProps {
  return 'control' in props && 'name' in props;
}

export function InputField(props: InputFieldProps) {
  // If using with react-hook-form, delegate to FormInputField component
  if (isFormInputField(props)) {
    return <FormInputField {...props} />;
  }

  // Original standalone implementation for direct usage without react-hook-form
  const {
    id,
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    required = false,
    autoComplete,
    pattern,
    maxLength,
    minLength,
    disabled = false,
    valid: externalValid,
    className,
    validateFn,
    isPassword = false,
  } = props;

  const [touched, setTouched] = useState(false);
  const [internalValid, setInternalValid] = useState<boolean | undefined>(undefined);
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  
  // Use either external valid state or internal validation
  const valid = externalValid !== undefined ? externalValid : internalValid;
  
  // Run validation whenever value changes and field has been touched
  useEffect(() => {
    if (validateFn && touched) {
      const result = validateFn(value);
      setInternalValid(result.valid);
      setValidationMessage(result.message);
    }
  }, [value, validateFn, touched]);

  // Password visibility toggle
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Determine input type based on isPassword and showPassword
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={inputType}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          pattern={pattern}
          maxLength={maxLength}
          minLength={minLength}
          disabled={disabled}
          className={cn(
            isPassword ? "pr-20" : "pr-10",
            "input-focus-animation",
            error ? "border-destructive/50 focus:border-destructive" : "",
            valid ? "border-primary/50 focus:border-primary" : "",
            touched && !error && !valid && !disabled ? "animate-[shake_0.3s_ease-in-out]" : ""
          )}
          onBlur={() => setTouched(true)}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          {touched && (
            <ValidationIcon valid={!error && valid === true} />
          )}
          {isPassword && (
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
          )}
        </div>
      </div>
      {error || (touched && validationMessage && !valid) ? (
        <p className="text-sm text-destructive animate-fade-in mt-1">
          {error || validationMessage}
        </p>
      ) : touched && valid && (
        <p className="text-sm text-primary animate-fade-in mt-1">Looks good!</p>
      )}
    </div>
  );
}
