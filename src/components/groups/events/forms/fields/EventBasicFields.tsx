
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EventBasicFieldsProps {
  title: string;
  description: string;
  location: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onLocationChange: (location: string) => void;
  errors?: {
    title?: string;
    description?: string;
    location?: string;
  };
}

export const EventBasicFields = ({ 
  title, 
  description, 
  location, 
  onTitleChange, 
  onDescriptionChange, 
  onLocationChange, 
  errors 
}: EventBasicFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Event Title</FormLabel>
        <FormControl>
          <Input 
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter event title"
          />
        </FormControl>
        {errors?.title && <FormMessage>{errors.title}</FormMessage>}
      </FormItem>

      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea 
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Enter event description"
          />
        </FormControl>
        {errors?.description && <FormMessage>{errors.description}</FormMessage>}
      </FormItem>

      <FormItem>
        <FormLabel>Location</FormLabel>
        <FormControl>
          <Input 
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Enter event location"
          />
        </FormControl>
        {errors?.location && <FormMessage>{errors.location}</FormMessage>}
      </FormItem>
    </div>
  );
};
