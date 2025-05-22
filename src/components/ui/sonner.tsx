
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast, type ExternalToast } from "sonner"
import { ReactNode } from "react"

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
const toastWithCloseButton = (message: string, opts: ExternalToast = {}) => {
  return sonnerToast(message, {
    ...opts,
    closeButton: true
  });
};

// Create our custom toast interface that extends the original
interface CustomToast {
  (message: ReactNode, data?: ExternalToast): string | number;
  success: typeof sonnerToast.success;
  error: typeof sonnerToast.error;
  warning: typeof sonnerToast.warning;
  info: typeof sonnerToast.info;
  message: typeof sonnerToast.message;
  promise: typeof sonnerToast.promise;
  loading: typeof sonnerToast.loading;
  dismiss: typeof sonnerToast.dismiss;
  custom: typeof sonnerToast.custom;
  // Add our persistent method
  persistent: (message: ReactNode, data?: ExternalToast) => string | number;
}

// Create our custom toast object and add the persistent method
const toast = Object.assign(
  sonnerToast,
  {
    persistent: (message: ReactNode, opts: ExternalToast = {}) => {
      return sonnerToast(message, {
        ...opts,
        duration: undefined, // No auto-dismiss
        closeButton: true, // Always show close button
      });
    }
  }
) as CustomToast;

export { Toaster, toast, toastWithCloseButton }
