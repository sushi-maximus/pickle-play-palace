
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EventTimeFieldProps {
  value: string;
  onChange: (time: string) => void;
  error?: string;
}

export const EventTimeField = ({ value, onChange, error }: EventTimeFieldProps) => {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <FormItem>
      <FormLabel>Time</FormLabel>
      <FormControl>
        <Input 
          type="time" 
          value={value || ''}
          onChange={handleTimeChange}
          className="w-full"
        />
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
