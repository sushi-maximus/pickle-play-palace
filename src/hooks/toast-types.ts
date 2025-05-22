
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import * as React from "react"

// Toast configuration constants
export const TOAST_LIMIT = 1
export const TOAST_REMOVE_DELAY = 1000000
export const DEFAULT_TOAST_DURATION = 5000

// Toast data type
export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number | null // null means toast won't auto-dismiss
}

// Action types for reducer
export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

export type ActionType = typeof actionTypes

export type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

// State interface
export interface State {
  toasts: ToasterToast[]
}

// Helper for generating unique IDs
let count = 0
export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}
