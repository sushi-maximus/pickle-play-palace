
import { useState } from "react";
import { 
  Zap, 
  Target, 
  Grid3X3, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EventFormatStepProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const eventFormats = [
  {
    id: "ladder",
    label: "Ladder",
    icon: Zap,
    description: "Competitive ladder format"
  },
  {
    id: "kings_court", 
    label: "Kings Court",
    icon: Target,
    description: "King of the court style"
  },
  {
    id: "round_robin",
    label: "Round Robin",
    icon: Grid3X3,
    description: "Everyone plays everyone"
  },
  {
    id: "single_court",
    label: "Single Court",
    icon: Users,
    description: "Single court matches"
  }
];

export const EventFormatStep = ({ value, onChange, error }: EventFormatStepProps) => {
  const handleSelect = (formatId: string) => {
    onChange(formatId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Create an Event
          </h2>
          <p className="text-sm text-gray-600">
            Select event format
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {eventFormats.map((format) => {
            const Icon = format.icon;
            const isSelected = value === format.id;
            
            return (
              <button
                key={format.id}
                onClick={() => handleSelect(format.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 min-h-[100px] hover:scale-105",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                )}
                type="button"
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-xs font-medium text-center leading-tight",
                  isSelected ? "text-primary" : "text-gray-700"
                )}>
                  {format.label}
                </span>
              </button>
            );
          })}
        </div>

        {value && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              {(() => {
                const selectedFormat = eventFormats.find(f => f.id === value);
                if (!selectedFormat) return null;
                const Icon = selectedFormat.icon;
                return (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedFormat.label}</p>
                      <p className="text-sm text-gray-600">{selectedFormat.description}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
