import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "tag" | "category" | "default";
  className?: string;
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  tag: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  category: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  default: "bg-gray-100 text-gray-700 border border-gray-200",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
