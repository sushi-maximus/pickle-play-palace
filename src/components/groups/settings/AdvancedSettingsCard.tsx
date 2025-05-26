
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";
import { AdvancedSettingsForm } from "./AdvancedSettingsForm";

interface AdvancedSettingsCardProps {
  form: UseFormReturn<UpdateGroupFormValues>;
  isSubmitting: boolean;
}

export const AdvancedSettingsCard = ({ form, isSubmitting }: AdvancedSettingsCardProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
          <Award className="h-5 w-5 mr-2" />
          Skill Level Range
        </CardTitle>
        <CardDescription>
          Set the skill level range for players in this group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AdvancedSettingsForm form={form} isSubmitting={isSubmitting} />
      </CardContent>
    </Card>
  );
};
