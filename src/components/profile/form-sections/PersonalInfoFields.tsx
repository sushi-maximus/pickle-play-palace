
import { InputField } from "@/components/auth/form-fields/InputField";
import { SelectField } from "@/components/auth/form-fields/SelectField";
import { Control } from "react-hook-form";
import { GENDER_VALUES, ProfileFormValues } from "../schemas/profileSchema";
import { skillLevelOptions } from "@/lib/constants/skill-levels";
import { HelpCircle } from "lucide-react";
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="w-full">
          <SelectField
            control={control}
            name="gender"
            label="Gender"
            placeholder="Select gender"
            options={genderOptions}
          />
        </div>
        <div className="w-full">
          <div className="flex items-center mb-2">
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
    </div>
  );
};
