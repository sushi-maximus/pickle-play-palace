
import { DatePickerField } from "../form-fields/DatePickerField";
import { PhoneInputField } from "../form-fields/PhoneInputField";
import { InputField } from "@/components/auth/form-fields/InputField";
import { Control } from "react-hook-form";
import { ProfileFormValues } from "../schemas/profileSchema";
import { Info, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdditionalInfoFieldsProps {
  control: Control<ProfileFormValues>;
}

export const AdditionalInfoFields = ({ control }: AdditionalInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DatePickerField
          control={control}
          name="birthday"
          label="Birthday"
        />
        <div className="space-y-4">
          <InputField
            control={control}
            name="duprRating"
            label="DUPR Rating"
            placeholder="4.5"
            validateFn={(value) => {
              if (!value) return { valid: true };
              const parsed = parseFloat(value);
              return {
                valid: !isNaN(parsed) && parsed >= 2.0 && parsed <= 8.0,
                message: "DUPR rating must be between 2.0 and 8.0"
              };
            }}
          />
          <div className="relative">
            <div className="mb-2 flex items-center">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                DUPR Profile Link
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex items-center cursor-pointer text-muted-foreground ml-1">
                      <Info className="h-4 w-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Add a link to your DUPR profile for others to see your tournament history and ratings.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative">
              <InputField
                control={control}
                name="duprProfileLink"
                label=""
                type="url"
                placeholder="https://dupr.com/player/your-profile"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <div className="mb-2 flex items-center">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Phone Number
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center cursor-pointer text-muted-foreground ml-1">
                  <Info className="h-4 w-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>This is available to anyone in a group you are in so leave it blank if you don't want anyone to know your phone number and contact you.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <PhoneInputField
          control={control}
          name="phoneNumber"
          label=""
        />
      </div>
    </div>
  );
};
