
import { Control } from "react-hook-form";
import { InputField } from "../form-fields/InputField";

interface PasswordFieldsProps {
  control: Control<any>;
}

export const PasswordFields = ({ control }: PasswordFieldsProps) => {
  return (
    <>
      <InputField 
        control={control}
        name="password"
        label="Password"
        placeholder="Create a password"
        isPassword
      />
      
      <InputField 
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        isPassword
      />
    </>
  );
};
