
import { Control } from "react-hook-form";
import { PasswordInputField } from "../form-fields/PasswordInputField";

interface PasswordFieldsProps {
  control: Control<any>;
}

export const PasswordFields = ({ control }: PasswordFieldsProps) => {
  return (
    <>
      <PasswordInputField 
        control={control}
        name="password"
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
        required
      />
      
      <PasswordInputField 
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        required
      />
    </>
  );
};
