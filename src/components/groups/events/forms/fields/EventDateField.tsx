
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EventDateFieldProps {
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

export const EventDateField = ({ value, onChange, error }: EventDateFieldProps) => {
  // Add comprehensive debugging
  console.log('=== EventDateField DEBUG ===');
  console.log('Raw value received:', value);
  console.log('Value type:', typeof value);
  console.log('Value length:', value?.length);
  console.log('Value split by "-":', value?.split('-'));

  // Convert "5-30-25" to "2025-05-30"
  const toInputFormat = (dbDate: string): string => {
    console.log('toInputFormat called with:', dbDate);
    
    if (!dbDate) {
      console.log('Empty date, returning empty string');
      return '';
    }
    
    // Check if it's already in YYYY-MM-DD format
    if (dbDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.log('Already in YYYY-MM-DD format, returning as-is');
      return dbDate;
    }
    
    const parts = dbDate.split('-');
    console.log('Date parts:', parts);
    
    if (parts.length === 3) {
      const [month, day, year] = parts;
      const fullYear = year.length === 2 ? `20${year}` : year;
      const result = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      console.log('Converted result:', result);
      return result;
    }
    
    console.log('Could not parse date format, returning as-is');
    return dbDate; // Return as-is if already in correct format
  };

  // Convert "2025-05-30" to "5-30-25"
  const toDbFormat = (inputDate: string): string => {
    console.log('toDbFormat called with:', inputDate);
    
    if (!inputDate) return '';
    
    const [year, month, day] = inputDate.split('-');
    const shortYear = year.slice(2);
    const result = `${parseInt(month)}-${parseInt(day)}-${shortYear}`;
    console.log('DB format result:', result);
    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log('Input changed to:', inputValue);
    onChange(inputValue ? toDbFormat(inputValue) : '');
  };

  const displayValue = toInputFormat(value);
  console.log('Final display value for input:', displayValue);

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
