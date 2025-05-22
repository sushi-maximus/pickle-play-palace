
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  options: SelectOption[] | { value: string; label: string }[];
  labelSuffix?: ReactNode;
  hideLabel?: boolean;
  required?: boolean; // Added required prop
}

export const SelectField = ({
  control,
  name,
  label,
  placeholder,
  options,
  labelSuffix,
  hideLabel = false,
  required = false, // Default to false
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {!hideLabel && (
            <FormLabel className="block mb-2">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
              {labelSuffix && <span className="ml-1">{labelSuffix}</span>}
            </FormLabel>
          )}
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
