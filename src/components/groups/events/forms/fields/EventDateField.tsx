
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";

interface EventDateFieldProps {
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

export const EventDateField = ({ value, onChange, error }: EventDateFieldProps) => {
  // Convert ISO date to input format (YYYY-MM-DD) - same as dashboard logic
  const displayValue = value ? format(parseISO(value), 'yyyy-MM-dd') : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // HTML date input always returns YYYY-MM-DD format, pass it directly
    onChange(e.target.value);
  };

  return (
    <FormItem>
      <FormLabel>Date</FormLabel>
      <FormControl>
        <Input 
          type="date" 
          value={displayValue}
          onChange={handleChange}
          className="w-full"
        />
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
