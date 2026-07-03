import { LucideIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
      <div className="w-20 h-20 rounded-full border-2 border-black dark:border-white flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 stroke-1" />
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="font-semibold px-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
