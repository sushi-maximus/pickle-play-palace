
import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Fixed AvatarWithBorder component with proper rounded styling
const AvatarWithBorder = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & { 
    borderColor?: string;
    borderWidth?: string | number;
  }
>(({ className, borderColor, borderWidth = 3, ...props }, ref) => (
  <div 
    className="rounded-full overflow-hidden flex items-center justify-center"
    style={{ 
      padding: borderWidth,
      background: borderColor || 'transparent',
      border: '1px solid black', // Add thin black outside edge
      boxSizing: 'content-box', // Ensure padding doesn't affect overall dimensions
      display: 'inline-flex', // Ensure it takes up just the space needed
      width: 'fit-content', // Maintain compact size
      height: 'fit-content',
    }}
  >
    <AvatarPrimitive.Root
      ref={ref}
      className={cn("rounded-full overflow-hidden", className)}
      {...props}
    />
  </div>
))
AvatarWithBorder.displayName = "AvatarWithBorder"

export { Avatar, AvatarImage, AvatarFallback, AvatarWithBorder }
