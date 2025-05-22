
import { Control } from "react-hook-form";
import { InputField } from "../form-fields/InputField";

interface LoginFieldsProps {
  control: Control<any>;
}

export const LoginFields = ({ control }: LoginFieldsProps) => {
  return (
    <>
      <InputField 
        control={control}
        name="email"
        label="Email"
        placeholder="your.email@example.com"
        type="email"
        required
      />
      
      <InputField 
        control={control}
        name="password"
        label="Password"
        placeholder="••••••••"
        isPassword={true}
        required
      />
    </>
  );
};
