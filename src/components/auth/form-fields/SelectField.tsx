
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
}

export const SelectField = ({
  control,
  name,
  label,
  placeholder,
  options,
  labelSuffix,
  hideLabel = false,
}: SelectFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {!hideLabel && (
            <FormLabel>
              {label}
              {labelSuffix && <span className="ml-1">{labelSuffix}</span>}
            </FormLabel>
          )}
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
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
