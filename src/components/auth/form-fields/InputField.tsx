
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface InputFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  isPassword?: boolean;
  hideLabel?: boolean;
}

export const InputField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  isPassword = false,
  hideLabel = false,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {!hideLabel && <FormLabel className="block mb-2">{label}</FormLabel>}
          <FormControl>
            {isPassword ? (
              <div className="relative w-full">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={placeholder} 
                  {...field} 
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            ) : (
              <Input placeholder={placeholder} type={type} {...field} className="w-full" />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
