
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
  const convertDatabaseDateToInputFormat = (dbDate: string): string => {
    if (!dbDate || typeof dbDate !== 'string') return '';
    
    console.log('EventDateField - Converting database date:', dbDate);
    
    // Handle "MM-DD-YY" format (e.g., "5-30-25")
    const parts = dbDate.split('-');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      const fullYear = year.length === 2 ? `20${year}` : year;
      const paddedMonth = month.padStart(2, '0');
      const paddedDay = day.padStart(2, '0');
      const result = `${fullYear}-${paddedMonth}-${paddedDay}`;
      console.log('EventDateField - Converted to input format:', result);
      return result;
    }
    
    // If already in YYYY-MM-DD format, return as is
    if (dbDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.log('EventDateField - Already in YYYY-MM-DD format:', dbDate);
      return dbDate;
    }
    
    console.log('EventDateField - Unable to parse date format:', dbDate);
    return '';
  };

  // Convert HTML input format "YYYY-MM-DD" back to database format "MM-DD-YY"
  const convertInputFormatToDatabaseFormat = (inputDate: string): string => {
    if (!inputDate) return '';
    
    console.log('EventDateField - Converting input date to database format:', inputDate);
    
    const [year, month, day] = inputDate.split('-');
    const shortYear = year.slice(2); // Convert 2025 to 25
    const result = `${parseInt(month)}-${parseInt(day)}-${shortYear}`;
    console.log('EventDateField - Converted to database format:', result);
    return result;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log('EventDateField - User input:', inputValue);
    const dbFormat = convertInputFormatToDatabaseFormat(inputValue);
    console.log('EventDateField - Calling onChange with:', dbFormat);
    onChange(dbFormat);
  };

  const displayValue = convertDatabaseDateToInputFormat(value);
  console.log('EventDateField - Display value for HTML input:', displayValue);

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
