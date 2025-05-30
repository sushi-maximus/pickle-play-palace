
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateInput } from "@/components/ui/date-input";

interface EventDateFieldProps {
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

export const EventDateField = ({ value, onChange, error }: EventDateFieldProps) => {
  return (
    <FormItem>
      <FormLabel>Date</FormLabel>
      <FormControl>
        <DateInput 
          value={value}
          onChange={onChange}
          className="w-full"
        />
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
