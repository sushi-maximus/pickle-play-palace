
import { InputField } from "@/components/auth/form-fields/InputField";
import { DatePickerField } from "../form-fields/DatePickerField";
import { Control } from "react-hook-form";
import { ProfileFormValues } from "../schemas/profileSchema";

interface AdditionalInfoFieldsProps {
  control: Control<ProfileFormValues>;
}

export const AdditionalInfoFields = ({ control }: AdditionalInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DatePickerField
        control={control}
        name="birthday"
        label="Birthday"
      />
      <InputField
        control={control}
        name="duprRating"
        label="DUPR Rating"
        placeholder="4.5"
      />
    </div>
  );
};
