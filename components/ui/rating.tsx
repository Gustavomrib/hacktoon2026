import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  /** Nota de 0 a 10. */
  value: number;
  /** Quantidade de estrelas exibidas. */
  max?: number;
  className?: string;
}

export function Rating({ value, max = 5, className }: RatingProps) {
  const filled = Math.round((value / 10) * max);

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      aria-label={`Nota ${value.toFixed(1).replace(".", ",")} de 10`}
    >
      <span className="font-display text-2xl font-semibold tabular-nums">
        {value.toFixed(1).replace(".", ",")}
      </span>
      <div aria-hidden className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "size-4",
              i < filled
                ? "fill-primary text-primary"
                : "fill-neutral-200 text-neutral-200",
            )}
          />
        ))}
      </div>
    </div>
  );
}
