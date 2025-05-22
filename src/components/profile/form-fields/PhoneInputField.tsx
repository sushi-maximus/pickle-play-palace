
import { useState, useEffect } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface PhoneInputFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  hideLabel?: boolean;
}

export const PhoneInputField = ({
  control,
  name,
  label,
  placeholder = "(123) 456-7890",
  hideLabel = false,
}: PhoneInputFieldProps) => {
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, "");
    
    // Check if we have enough digits to format
    if (cleaned.length === 0) return "";
    
    // Format based on the length of the number
    if (cleaned.length <= 3) {
      return `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Store the raw value (for form submission) and formatted value (for display)
        const formattedValue = formatPhoneNumber(field.value || "");
        
        return (
          <FormItem>
            {!hideLabel && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                placeholder={placeholder}
                value={formattedValue}
                onChange={(e) => {
                  // Update the field value with the formatted phone number
                  const formatted = formatPhoneNumber(e.target.value);
                  field.onChange(formatted);
                }}
                onBlur={field.onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
