
import { CheckCircle2, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ValidationIconProps {
  valid: boolean;
  className?: string;
}

export function ValidationIcon({ valid, className }: ValidationIconProps) {
  return (
    <div className={cn(
      "absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-200",
      className
    )}>
      <AnimatePresence initial={false}>
        {valid ? (
          <motion.div
            key="valid"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="invalid"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <AlertCircle className="h-5 w-5 text-destructive" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
