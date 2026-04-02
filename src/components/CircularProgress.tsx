import React from 'react';
import { motion } from 'motion/react';

interface Props {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  gradientId: string;
  gradientStops: { offset: string; color: string }[];
  label?: string;
  subLabel?: string;
  labelClassName?: string;
  subLabelClassName?: string;
  className?: string;
}

export const CircularProgress = ({
  percentage,
  size = 100,
  strokeWidth = 8,
  gradientId,
  gradientStops,
  label,
  subLabel,
  labelClassName = "text-xl font-black text-white",
  subLabelClassName = "text-[8px] text-gray-400 font-bold uppercase tracking-wider mt-0.5",
  className = ""
}: Props) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#333"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {gradientStops.map((stop, i) => (
              <stop key={i} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
      </svg>
      {(label || subLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label && <span className={labelClassName}>{label}</span>}
          {subLabel && <span className={subLabelClassName}>{subLabel}</span>}
        </div>
      )}
    </div>
  );
};
