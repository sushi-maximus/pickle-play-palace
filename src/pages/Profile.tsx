
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { User, LogOut, Upload, Pencil } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { skillLevelOptions } from "@/lib/constants/skill-levels";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name cannot exceed 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name cannot exceed 50 characters"),
  gender: z.enum(["Male", "Female"], { required_error: "Please select your gender" }),
  skillLevel: z.enum(["2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"], { required_error: "Please select your skill level" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: undefined,
      skillLevel: undefined,
    },
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setProfileData(data);
          
          // Validate skill_level value is one of the expected enum values
          const validSkillLevel = skillLevelOptions.find(option => option.value === data.skill_level)?.value;
          
          form.reset({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            gender: (data.gender as any) || undefined,
            // Only set the skill level if it's one of the valid options, otherwise use default
            skillLevel: validSkillLevel as "2.5" | "3.0" | "3.5" | "4.0" | "4.5" | "5.0" | "5.5" || "2.5",
          });
          
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, form]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = async () => {
    await signOut();
    toast.success("You have been logged out");
  };

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          gender: values.gender,
          skill_level: values.skillLevel
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;
      
      setUploading(true);
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      toast.success("Avatar updated successfully");
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(`Error uploading avatar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const getInitials = () => {
    if (form.watch("firstName") && form.watch("lastName")) {
      return `${form.watch("firstName").charAt(0)}${form.watch("lastName").charAt(0)}`.toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 mx-auto py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 border border-border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Account</h3>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to sign in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Log out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="border border-border rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6">My Profile</h1>
              
              <div className="space-y-6">
                {/* Avatar Upload Section */}
                <div className="flex flex-col items-center md:flex-row md:items-start md:gap-6 mb-8">
                  <div className="relative mb-4 md:mb-0">
                    <Avatar className="h-24 w-24">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt="Profile" />
                      ) : null}
                      <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0">
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          {uploading ? (
                            <span className="animate-spin">⋯</span>
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                        </div>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={uploadAvatar}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{form.watch("firstName")} {form.watch("lastName")}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="skillLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skill Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select skill level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {skillLevelOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Updating..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Information</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">User ID</p>
                        <p className="truncate">{user.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
