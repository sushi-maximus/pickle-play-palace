
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
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
}

export function InputField({
  id,
  label,
  type,
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
  ...props
}: InputFieldProps) {
  const [touched, setTouched] = useState(false);
  const [internalValid, setInternalValid] = useState<boolean | undefined>(undefined);
  const [validationMessage, setValidationMessage] = useState<string | undefined>(undefined);
  
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

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          type={type}
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
            "pr-10 input-focus-animation",
            error ? "border-destructive/50 focus:border-destructive" : "",
            valid ? "border-primary/50 focus:border-primary" : "",
            touched && !error && !valid && !disabled ? "animate-[shake_0.3s_ease-in-out]" : ""
          )}
          onBlur={() => setTouched(true)}
          {...props}
        />
        {touched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-200">
            {error || (touched && validationMessage && !valid) ? (
              <AlertCircle className="h-5 w-5 text-destructive animate-scale-in" />
            ) : valid ? (
              <CheckCircle2 className="h-5 w-5 text-primary animate-scale-in" />
            ) : null}
          </div>
        )}
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
