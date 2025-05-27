
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Zap, Target, Grid3X3, Users } from "lucide-react";

interface PlayerDetailsStepProps {
  maxPlayers: number;
  allowReserves: boolean;
  pricingModel: string;
  feeAmount: number | null;
  onMaxPlayersChange: (maxPlayers: number) => void;
  onAllowReservesChange: (allowReserves: boolean) => void;
  onPricingModelChange: (pricingModel: string) => void;
  onFeeAmountChange: (feeAmount: number | null) => void;
  errors?: {
    maxPlayers?: string;
    feeAmount?: string;
  };
  eventFormat?: string;
  eventType?: string;
}

const eventFormats = [
  { id: "ladder", label: "Ladder", icon: Zap },
  { id: "kings_court", label: "Kings Court", icon: Target },
  { id: "round_robin", label: "Round Robin", icon: Grid3X3 },
  { id: "single_court", label: "Single Court", icon: Users }
];

export const PlayerDetailsStep = ({
  maxPlayers,
  allowReserves,
  pricingModel,
  feeAmount,
  onMaxPlayersChange,
  onAllowReservesChange,
  onPricingModelChange,
  onFeeAmountChange,
  errors = {},
  eventFormat,
  eventType
}: PlayerDetailsStepProps) => {
  // Generate player count options (8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64)
  const playerOptions = [];
  for (let i = 8; i <= 64; i += 4) {
    playerOptions.push(i);
  }

  const handleFeeAmountChange = (value: string) => {
    if (value === "") {
      onFeeAmountChange(null);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        onFeeAmountChange(numValue);
      }
    }
  };

  const getFormatDisplay = () => {
    if (!eventFormat) return null;
    const format = eventFormats.find(f => f.id === eventFormat);
    if (!format) return null;
    
    const Icon = format.icon;
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <Icon className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700">{format.label}</span>
      </div>
    );
  };

  const getEventTypeDisplay = () => {
    if (!eventType) return null;
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <span className="text-xs text-white font-medium">
            {eventType === "one-time" ? "1" : "M"}
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {eventType === "one-time" ? "One-Time Event" : "Multi-Week Event"}
        </span>
      </div>
    );
  };

  return (
    <div className="flex-1 px-4 py-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Player Details</h2>
        <p className="text-sm text-gray-600">
          Configure player limits and pricing for your event
        </p>
        
        {/* Selections Display */}
        {(eventFormat || eventType) && (
          <div className="flex items-center justify-center gap-4 mt-4">
            {eventFormat && getFormatDisplay()}
            {eventFormat && eventType && (
              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            )}
            {eventType && getEventTypeDisplay()}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="max-players" className="text-base font-medium text-gray-900">
            Max Players
          </Label>
          <Select 
            value={maxPlayers.toString()} 
            onValueChange={(value) => onMaxPlayersChange(parseInt(value))}
          >
            <SelectTrigger id="max-players" className="min-h-[48px]">
              <SelectValue placeholder="Select max players" />
            </SelectTrigger>
            <SelectContent>
              {playerOptions.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} players
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.maxPlayers && (
            <p className="text-sm text-red-600">{errors.maxPlayers}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="allow-reserves" className="text-base font-medium text-gray-900">
            Allow Reserves
          </Label>
          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg min-h-[48px]">
            <Switch
              id="allow-reserves"
              checked={allowReserves}
              onCheckedChange={onAllowReservesChange}
            />
            <Label htmlFor="allow-reserves" className="font-medium cursor-pointer flex-1">
              Allow reserve players to join if spots become available
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricing-model" className="text-base font-medium text-gray-900">
            Pricing
          </Label>
          <Select value={pricingModel} onValueChange={onPricingModelChange}>
            <SelectTrigger id="pricing-model" className="min-h-[48px]">
              <SelectValue placeholder="Select pricing model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="one-time">One-Time Fee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pricingModel === "one-time" && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="fee-amount" className="text-base font-medium text-gray-900">
              Fee Amount ($)
            </Label>
            <Input
              id="fee-amount"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={feeAmount?.toString() || ""}
              onChange={(e) => handleFeeAmountChange(e.target.value)}
              placeholder="e.g., 20.00"
              className="min-h-[48px]"
            />
            {errors.feeAmount && (
              <p className="text-sm text-red-600">{errors.feeAmount}</p>
            )}
            <p className="text-xs text-gray-500">Enter amount between $0 and $100</p>
          </div>
        )}
      </div>
    </div>
  );
};
