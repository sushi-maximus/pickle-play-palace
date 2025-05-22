
import { InputField } from "@/components/auth/form-fields/InputField";
import { SelectField } from "@/components/auth/form-fields/SelectField";
import { Control } from "react-hook-form";
import { GENDER_VALUES, ProfileFormValues } from "../schemas/profileSchema";
import { skillLevelOptions } from "@/lib/constants/skill-levels";

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
        <SelectField
          control={control}
          name="skillLevel"
          label="Skill Level"
          placeholder="Select skill level"
          options={skillLevelOptions}
        />
      </div>
    </>
  );
};
