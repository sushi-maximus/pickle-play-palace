
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { ValidationIcon } from "./ValidationIcon";
import { PasswordInputField } from "./PasswordInputField";

export interface FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  className?: string;
  isPassword?: boolean;
  "data-testid"?: string; // Add data-testid prop
}

export function FormInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: FormInputFieldProps<TFieldValues, TName>) {
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
    "data-testid": dataTestId
  } = props;

  // If this is a password field, use the dedicated PasswordInputField component
  if (props.isPassword) {
    return (
      <PasswordInputField
        control={control}
        name={name}
        label={label}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={className}
        data-testid={dataTestId}
      />
    );
  }

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
                  type={type}
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
                  data-testid={dataTestId} // Pass data-testid to the Input component
                  {...field}
                />
                {fieldState.isDirty && (
                  <ValidationIcon valid={!error} />
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
