import React from 'react';
import { Battery, BatteryMedium, BatteryCharging } from 'lucide-react';

export type EnergyLevel = 'high' | 'medium' | 'low';

const EnergyBadge = ({ level }: { level: EnergyLevel }) => {
  if (level === 'high') return <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded-md border border-rose-500/20"><BatteryCharging size={12}/> طاقة عالية</span>;
  if (level === 'medium') return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md border border-amber-500/20"><BatteryMedium size={12}/> طاقة متوسطة</span>;
  return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md border border-emerald-500/20"><Battery size={12}/> طاقة منخفضة</span>;
};

export default EnergyBadge;
