import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg";

const sizes: Record<AvatarSize, string> = {
  xs: "size-6 text-xs",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
};

const pixels: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 40, lg: 56 };

export interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  /** Ponto de presença no canto inferior direito. */
  status?: "online" | "offline";
  className?: string;
}

export function Avatar({
  src,
  name,
  size = "md",
  status,
  className,
}: AvatarProps) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "bg-brand-200 text-brand-800 flex items-center justify-center overflow-hidden rounded-full font-semibold",
          sizes[size],
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            width={pixels[size]}
            height={pixels[size]}
            className="size-full object-cover"
          />
        ) : (
          initials
        )}
      </span>
      {status ? (
        <span
          aria-label={status === "online" ? "Online" : "Offline"}
          className={cn(
            "border-surface absolute right-0 bottom-0 size-2.5 rounded-full border-2",
            status === "online" ? "bg-success-500" : "bg-neutral-400",
          )}
        />
      ) : null}
    </span>
  );
}
