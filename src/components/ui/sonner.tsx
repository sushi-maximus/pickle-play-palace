
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Remove the global closeButton={false} to allow per-toast configuration
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// Extend the toast object with a version that shows the close button
const toastWithCloseButton = (message: string, opts: any = {}) => {
  return toast(message, {
    ...opts,
    closeButton: true
  });
};

// Add the persistent method that shows a close button by default
toast.persistent = (message: string, opts: any = {}) => {
  return toast(message, {
    ...opts,
    duration: undefined, // No auto-dismiss
    closeButton: true, // Always show close button
  });
};

export { Toaster, toast, toastWithCloseButton }
