
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface BaseInputFieldProps {
  id?: string;
  label: string;
  type?: string;
  placeholder?: string;
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

interface StandaloneInputFieldProps extends BaseInputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string; // Required for standalone usage
}

interface FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseInputFieldProps {
  control: Control<TFieldValues>;
  name: TName;
  isPassword?: boolean;
}

export type InputFieldProps = StandaloneInputFieldProps | FormInputFieldProps;

function isFormInputField(props: InputFieldProps): props is FormInputFieldProps {
  return 'control' in props && 'name' in props;
}

export function InputField(props: InputFieldProps) {
  // If the component is used with react-hook-form
  if (isFormInputField(props)) {
    const { 
      control, 
      name, 
      label, 
      type = 'text',
      placeholder, 
      required = false,
      disabled = false,
      autoComplete,
      pattern,
      maxLength,
      minLength,
      className,
      isPassword = false
    } = props;

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
                    type={isPassword ? "password" : type}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    pattern={pattern}
                    maxLength={maxLength}
                    minLength={minLength}
                    className={cn(
                      "pr-10 input-focus-animation",
                      error ? "border-destructive/50 focus:border-destructive" : "",
                      !error && fieldState.isDirty ? "border-primary/50 focus:border-primary" : ""
                    )}
                    {...field}
                  />
                  {fieldState.isDirty && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-200">
                      {error ? (
                        <AlertCircle className="h-5 w-5 text-destructive animate-scale-in" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-primary animate-scale-in" />
                      )}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  }

  // Original standalone implementation (not used with react-hook-form)
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
  } = props;

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
