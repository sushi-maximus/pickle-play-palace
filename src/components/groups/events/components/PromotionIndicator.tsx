
import { ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Temp_PromotionIndicatorProps } from "../types/promotionTypes";

export const PromotionIndicator = ({ registration, size = 'md' }: Temp_PromotionIndicatorProps) => {
  if (!registration.promoted_at) {
    return null;
  }

  const isSmall = size === 'sm';
  const iconSize = isSmall ? 'h-3 w-3' : 'h-4 w-4';
  const textSize = isSmall ? 'text-xs' : 'text-sm';

  return (
    <Badge 
      variant="secondary" 
      className={`bg-green-100 text-green-700 ${textSize} flex items-center gap-1`}
    >
      <ArrowUp className={iconSize} />
      Promoted
    </Badge>
  );
};
