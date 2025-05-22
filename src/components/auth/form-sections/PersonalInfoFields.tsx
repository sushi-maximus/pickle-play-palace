
import { Control } from "react-hook-form";
import { InputField } from "../form-fields/InputField";
import { SelectField } from "../form-fields/SelectField";
import { SkillLevelGuide } from "@/components/SkillLevelGuide";
import { skillLevelOptions } from "@/lib/constants/skill-levels";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PersonalInfoFieldsProps {
  control: Control<any>;
}

export const PersonalInfoFields = ({ control }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
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
      
      <InputField 
        control={control}
        name="email"
        label="Email"
        placeholder="you@example.com"
        type="email"
      />

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          control={control}
          name="gender"
          label="Gender"
          placeholder="Select gender"
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" }
          ]}
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
            placeholder="Select skill"
            options={skillLevelOptions}
          />
        </div>
      </div>
    </>
  );
};
