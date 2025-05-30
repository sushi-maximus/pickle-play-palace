
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EventDateFieldProps {
  value: string;
  onChange: (date: string) => void;
  error?: string;
}

export const EventDateField = ({ value, onChange, error }: EventDateFieldProps) => {
  console.log('EventDateField - Received value:', value);
  
  // Convert database format "MM-DD-YY" to HTML input format "YYYY-MM-DD"
  const convertToInputFormat = (dbDate: string): string => {
    if (!dbDate) return '';
    
    // Handle "MM-DD-YY" format (e.g., "5-30-25")
    const parts = dbDate.split('-');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      const fullYear = year.length === 2 ? `20${year}` : year;
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      return `${fullYear}-${paddedMonth}-${paddedDay}`;
    }
    
    // If already in YYYY-MM-DD format, return as is
    if (dbDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dbDate;
    }
    
    return '';
  };

  // Convert HTML input format "YYYY-MM-DD" back to database format "MM-DD-YY"
  const convertToDatabaseFormat = (inputDate: string): string => {
    if (!inputDate) return '';
    
    const [year, month, day] = inputDate.split('-');
    const shortYear = year.slice(2);
    const cleanMonth = parseInt(month).toString();
    const cleanDay = parseInt(day).toString();
    
    return `${cleanMonth}-${cleanDay}-${shortYear}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log('EventDateField - User input:', inputValue);
    
    if (!inputValue) {
      onChange('');
      return;
    }
    
    const dbFormat = convertToDatabaseFormat(inputValue);
    console.log('EventDateField - Converted to database format:', dbFormat);
    onChange(dbFormat);
  };

  const displayValue = convertToInputFormat(value);
  console.log('EventDateField - Display value:', displayValue);

  return (
    <FormItem>
      <FormLabel>Date</FormLabel>
      <FormControl>
        <Input 
          type="date" 
          value={displayValue}
          onChange={handleDateChange}
          className="w-full"
        />
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
