
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventPricingFieldsProps {
  pricingModel: "free" | "one-time" | "per-event";
  feeAmount: number | null;
  onPricingModelChange: (model: "free" | "one-time" | "per-event") => void;
  onFeeAmountChange: (amount: number | null) => void;
  errors?: {
    feeAmount?: string;
  };
}

export const EventPricingFields = ({ 
  pricingModel, 
  feeAmount, 
  onPricingModelChange, 
  onFeeAmountChange, 
  errors 
}: EventPricingFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Pricing Model</FormLabel>
        <Select onValueChange={onPricingModelChange} value={pricingModel}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select pricing model" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="one-time">One-time Fee</SelectItem>
            <SelectItem value="per-event">Per Event</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>

      {pricingModel !== 'free' && (
        <FormItem>
          <FormLabel>Fee Amount ($)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              step="0.01"
              min="0"
              value={feeAmount || ''}
              onChange={(e) => onFeeAmountChange(e.target.value ? parseFloat(e.target.value) : null)}
            />
          </FormControl>
          {errors?.feeAmount && <FormMessage>{errors.feeAmount}</FormMessage>}
        </FormItem>
      )}
    </div>
  );
};
