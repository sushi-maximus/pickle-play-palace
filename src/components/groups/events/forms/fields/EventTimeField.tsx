
import React from "react";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-2">
      <Label htmlFor="event-time">Time</Label>
      <Input 
        id="event-time"
        type="time" 
        value={value || ''}
        onChange={handleTimeChange}
        className="w-full"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
