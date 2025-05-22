
import * as React from "react"
import { 
  ToasterToast, 
  genId, 
  DEFAULT_TOAST_DURATION 
} from "./toast-types"
import { dispatch, memoryState, listeners } from "./toast-reducer"

type Toast = Omit<ToasterToast, "id">

/**
 * Creates and manages toast notifications
 */
function toast({ ...props }: Toast) {
  const id = genId()
  
  // Determine if toast should auto-dismiss or be permanent
  const duration = props.duration === null ? null : props.duration || DEFAULT_TOAST_DURATION;
  
  // CRITICAL: Set showCloseButton to false by default
  // Only show for permanent toasts (null duration) unless explicitly overridden
  const showCloseButton = props.showCloseButton === true ? true : false;
  
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
    
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Auto-dismiss logic for toasts with duration
  if (duration !== null) {
    setTimeout(() => {
      dismiss();
    }, duration);
  }

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      duration,
      showCloseButton,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * Hook to access toast state and functions
 */
function useToast() {
  const [state, setState] = React.useState<{ toasts: ToasterToast[] }>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
