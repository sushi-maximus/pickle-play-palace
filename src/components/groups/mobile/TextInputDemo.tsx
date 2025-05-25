
import { useAuth } from "@/contexts/AuthContext";
import { TextInputComparison } from "./TextInputComparison";

export const TextInputDemo = () => {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">Please log in to see the text input comparison</p>
      </div>
    );
  }

  return (
    <TextInputComparison 
      user={{
        id: profile.id,
        first_name: profile.first_name || 'User',
        last_name: profile.last_name || '',
        avatar_url: profile.avatar_url
      }}
    />
  );
};
