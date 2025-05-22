
import { ProfileFormValues } from "../schemas/profileSchema";

export const formatProfileDataForUpdate = (values: ProfileFormValues) => {
  return {
    first_name: values.firstName,
    last_name: values.lastName,
    gender: values.gender,
    skill_level: values.skillLevel,
    birthday: values.birthday ? values.birthday.toISOString().split('T')[0] : null,
    dupr_rating: values.duprRating ? parseFloat(values.duprRating) : null
  };
};

export const mapProfileDataToFormValues = (profileData: any): Partial<ProfileFormValues> => {
  if (!profileData) return {};
  
  return {
    firstName: profileData.first_name || "",
    lastName: profileData.last_name || "",
    gender: profileData.gender || "Male",
    skillLevel: profileData.skill_level || "2.5",
    birthday: profileData.birthday ? new Date(profileData.birthday) : undefined,
    duprRating: profileData.dupr_rating ? String(profileData.dupr_rating) : ""
  };
};
