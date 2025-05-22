
import { FormInputField, FormInputFieldProps } from "./FormInputField";
import { Control, FieldValues, FieldPath } from "react-hook-form";

interface InputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  type?: string;
  placeholder?: string;
  isPassword?: boolean;
  hideLabel?: boolean;
  "data-testid"?: string; // Add data-testid prop
}

export function InputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ 
  control, 
  name, 
  label, 
  type = "text", 
  placeholder,
  isPassword,
  hideLabel,
  "data-testid": dataTestId,
  ...props 
}: InputFieldProps<TFieldValues, TName>) {
  // Forward all props including data-testid to FormInputField
  return (
    <FormInputField
      control={control}
      name={name}
      label={hideLabel ? "" : label}
      type={type}
      placeholder={placeholder}
      isPassword={isPassword}
      data-testid={dataTestId}
      {...props}
    />
  );
}
