
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

// Schema for form validation
const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters"),
  description: z.string().optional(),
  location: z.string().optional(),
  is_private: z.boolean().default(false),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

interface CreateGroupDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateGroupDialog({ trigger, onSuccess }: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      is_private: false,
    },
  });

  const onSubmit = async (values: CreateGroupFormValues) => {
    if (!user) {
      toast.error("You need to be logged in to create a group");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Create the group
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert([
          {
            name: values.name,
            description: values.description || null,
            location: values.location || null,
            created_by: user.id,
            is_private: values.is_private,
          },
        ])
        .select();

      if (groupError) {
        console.error("Error details:", groupError);
        throw groupError;
      }

      const newGroup = groupData[0];
      
      // Step 2: Add the creator as a member with admin role
      const { error: memberError } = await supabase
        .from("group_members")
        .insert([
          {
            group_id: newGroup.id,
            user_id: user.id,
            role: 'admin',
            status: 'active'
          },
        ]);

      if (memberError) {
        console.error("Error adding creator as member:", memberError);
        toast.error("Group created but failed to add you as a member. Please try again.");
      } else {
        toast.success("Group created successfully!");
      }

      form.reset();
      setOpen(false);
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to the group page if no callback is provided
        navigate(`/groups/${newGroup.id}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default">
            Create Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create a New Group</DialogTitle>
              <DialogDescription>
                Create a group for pickleball players with similar interests or skill levels.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter group name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what your group is about" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Private Group
                      </FormLabel>
                      <FormDescription>
                        Private groups require approval to join
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
