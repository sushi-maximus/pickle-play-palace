
import React from "react";
import { Input } from "@/components/ui/input";
import { formatDateForInput, normalizeEventDate } from "@/utils/dateUtils";

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const DateInput = ({ 
  value, 
  onChange, 
  className = "w-full",
  placeholder,
  disabled = false
}: DateInputProps) => {
  // Convert any date format to HTML input format (YYYY-MM-DD)
  const displayValue = formatDateForInput(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Always output in ISO format for consistency
    onChange(inputValue ? normalizeEventDate(inputValue) : '');
  };

  return (
    <Input 
      type="date" 
      value={displayValue}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};
