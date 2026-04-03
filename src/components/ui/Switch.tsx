import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export const Switch = ({ checked, onCheckedChange, className }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none p-0.5",
        checked ? "bg-emerald-500" : "bg-gray-700",
        className,
        checked ? "justify-end" : "justify-start"
      )}
    >
      <motion.span
        layout
        className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};
