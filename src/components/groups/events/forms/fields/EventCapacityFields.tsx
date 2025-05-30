
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface EventCapacityFieldsProps {
  maxPlayers: number;
  allowReserves: boolean;
  registrationOpen: boolean;
  onMaxPlayersChange: (maxPlayers: number) => void;
  onAllowReservesChange: (allowReserves: boolean) => void;
  onRegistrationOpenChange: (registrationOpen: boolean) => void;
  errors?: {
    maxPlayers?: string;
  };
}

export const EventCapacityFields = ({ 
  maxPlayers, 
  allowReserves, 
  registrationOpen, 
  onMaxPlayersChange, 
  onAllowReservesChange, 
  onRegistrationOpenChange, 
  errors 
}: EventCapacityFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Max Players</FormLabel>
        <FormControl>
          <Input 
            type="number" 
            min="1"
            value={maxPlayers}
            onChange={(e) => onMaxPlayersChange(parseInt(e.target.value))}
          />
        </FormControl>
        {errors?.maxPlayers && <FormMessage>{errors.maxPlayers}</FormMessage>}
      </FormItem>

      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <FormLabel>Allow Reserves</FormLabel>
          <div className="text-sm text-muted-foreground">
            Allow players to join a waitlist when event is full
          </div>
        </div>
        <FormControl>
          <Switch 
            checked={allowReserves} 
            onCheckedChange={onAllowReservesChange} 
          />
        </FormControl>
      </FormItem>

      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <FormLabel>Registration Open</FormLabel>
          <div className="text-sm text-muted-foreground">
            Allow new players to register for this event
          </div>
        </div>
        <FormControl>
          <Switch 
            checked={registrationOpen} 
            onCheckedChange={onRegistrationOpenChange} 
          />
        </FormControl>
      </FormItem>
    </div>
  );
};
