
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import { UpdateGroupFormValues } from "@/components/groups/schemas/groupSchemas";
import { BasicInfoForm } from "./BasicInfoForm";
import { GroupAvatarSection } from "./GroupAvatarSection";

interface BasicInfoCardProps {
  group: any;
  form: UseFormReturn<UpdateGroupFormValues>;
  isSubmitting: boolean;
  onGroupUpdate: (updatedGroup: any) => void;
}

export const BasicInfoCard = ({ group, form, isSubmitting, onGroupUpdate }: BasicInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <GroupAvatarSection group={group} onGroupUpdate={onGroupUpdate} />
          <div className="flex-grow">
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Manage the basic details of your group.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <BasicInfoForm form={form} isSubmitting={isSubmitting} />
      </CardContent>
    </Card>
  );
};
