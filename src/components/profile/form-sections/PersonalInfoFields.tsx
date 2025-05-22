
import { InputField } from "@/components/auth/form-fields/InputField";
import { SelectField } from "@/components/auth/form-fields/SelectField";
import { Control } from "react-hook-form";
import { GENDER_VALUES, ProfileFormValues } from "../schemas/profileSchema";
import { skillLevelOptions } from "@/lib/constants/skill-levels";
import { HelpCircle, Info } from "lucide-react";
import { SkillLevelGuide } from "@/components/SkillLevelGuide";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PersonalInfoFieldsProps {
  control: Control<ProfileFormValues>;
}

export const PersonalInfoFields = ({ control }: PersonalInfoFieldsProps) => {
  const genderOptions = GENDER_VALUES.map(value => ({ value, label: value }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          control={control}
          name="firstName"
          label="First Name"
          placeholder="John"
        />
        <InputField
          control={control}
          name="lastName"
          label="Last Name"
          placeholder="Doe"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          control={control}
          name="gender"
          label="Gender"
          placeholder="Select gender"
          options={genderOptions}
        />
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Skill Level
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center cursor-pointer text-primary ml-1">
                    <SkillLevelGuide triggerElement={
                      <HelpCircle className="h-4 w-4" />
                    } />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn about skill levels</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <SelectField
            control={control}
            name="skillLevel"
            label=""
            hideLabel={true}
            placeholder="Select skill level"
            options={skillLevelOptions}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <div className="flex items-center">
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
          <InputField
            control={control}
            name="phoneNumber"
            label=""
            placeholder="(123) 456-7890"
          />
        </div>
      </div>
    </>
  );
};
