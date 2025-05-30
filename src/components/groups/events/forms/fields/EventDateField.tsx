
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EventDateFieldProps {
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

export const EventDateField = ({ value, onChange, error }: EventDateFieldProps) => {
  // Convert "5-30-25" to "2025-05-30"
  const toInputFormat = (dbDate: string): string => {
    if (!dbDate) return '';
    
    const parts = dbDate.split('-');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      const fullYear = year.length === 2 ? `20${year}` : year;
      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return dbDate; // Return as-is if already in correct format
  };

  // Convert "2025-05-30" to "5-30-25"
  const toDbFormat = (inputDate: string): string => {
    if (!inputDate) return '';
    
    const [year, month, day] = inputDate.split('-');
    const shortYear = year.slice(2);
    return `${parseInt(month)}-${parseInt(day)}-${shortYear}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue ? toDbFormat(inputValue) : '');
  };

  return (
    <FormItem>
      <FormLabel>Date</FormLabel>
      <FormControl>
        <Input 
          type="date" 
          value={toInputFormat(value)}
          onChange={handleChange}
          className="w-full"
        />
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
