import React from 'react';
import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';
import { Button } from './ui/Button';

const { ChevronRight, Zap } = Lucide;

interface StorePageProps {
  onBack: () => void;
  stats: any;
  onUpdateStats: (stats: any) => void;
}

export const StorePage = ({ onBack, stats, onUpdateStats }: StorePageProps) => {
  const useForgivenessDay = () => {
    if (stats?.forgivenessDays > 0) {
      onUpdateStats({ ...stats, forgivenessDays: stats.forgivenessDays - 1 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="ghost" size="sm" className="w-10 h-10 rounded-full p-0">
          <ChevronRight size={24} />
        </Button>
        <h2 className="text-2xl font-black text-white">المتجر</h2>
      </div>

      {/* Forgiveness Days Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#181818] p-6 rounded-2xl border border-white/5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="text-lg font-black text-white">أيام السماح (Streak Freeze)</h4>
            <p className="text-sm text-gray-400 font-bold mt-1">لديك {stats?.forgivenessDays || 0} أيام سماح متبقية</p>
          </div>
        </div>
        <Button
          onClick={useForgivenessDay}
          disabled={!stats?.forgivenessDays || stats.forgivenessDays === 0}
          variant="success"
          size="sm"
        >
          استخدام يوم سماح
        </Button>
      </motion.div>
    </div>
  );
};
