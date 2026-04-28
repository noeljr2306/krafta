import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
}

export function VerifiedBadge({ size = "md" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const containerClasses = {
    sm: "gap-1 px-2 py-0.5 text-[9.9px]",
    md: "gap-1.5 px-2.5 py-1 text-xs",
    lg: "gap-2 px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-sky-50 border border-sky-200 font-bold text-sky-600 ${containerClasses[size]}`}
    >
      <BadgeCheck className={`${sizeClasses[size]} fill-sky-500 text-white`} />
      Verified
    </span>
  );
}