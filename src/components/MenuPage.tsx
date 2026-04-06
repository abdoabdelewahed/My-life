import React from 'react';
import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';
import { Button } from './ui/Button';
const { Zap, FileBadge, Info, ChevronLeft, Sparkles, Trophy, Users, Volume2, VolumeX, Heart } = Lucide;

interface MenuPageProps {
  onNavigate: (tab: 'tools' | 'certificates' | 'about' | 'tasks' | 'settings' | 'store' | 'routine' | 'abilities' | 'mylife') => void;
  completedCount: number;
  stats: any;
  isInstallable?: boolean;
  onInstall?: () => void;
  visibleTabs?: string[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export const MenuPage = ({ onNavigate, completedCount, stats, isInstallable, onInstall, visibleTabs = [] }: MenuPageProps) => {
  const menuItems = [
    {
      id: 'tasks',
      title: 'الرئيسية',
      icon: <Lucide.Home size={24} className="text-blue-500" />,
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      isMain: true
    },
    {
      id: 'routine',
      title: 'روتيني',
      icon: <Lucide.Activity size={24} className="text-purple-500" />,
      color: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      isMain: true
    },
    {
      id: 'abilities',
      title: 'القدرات',
      icon: <Lucide.Brain size={24} className="text-amber-500" />,
      color: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      isMain: true
    },
    {
      id: 'mylife',
      title: 'حياتي',
      icon: <Heart size={24} className="text-rose-500" />,
      color: 'from-rose-500/20 to-rose-500/5',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
      isMain: true
    },
    {
      id: 'certificates',
      title: 'الشهادات',
      icon: <FileBadge size={24} className="text-emerald-500" />,
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      disabled: completedCount === 0
    },
    {
      id: 'store',
      title: 'المتجر',
      icon: <Lucide.ShoppingBag size={24} className="text-orange-500" />,
      color: 'from-orange-500/20 to-orange-500/5',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400'
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      icon: <Lucide.Settings size={24} className="text-gray-500" />,
      color: 'from-gray-500/20 to-gray-500/5',
      borderColor: 'border-gray-500/30',
      textColor: 'text-gray-400'
    },
    {
      id: 'about',
      title: 'من نحن',
      icon: <Users size={24} className="text-blue-500" />,
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400'
    }
  ].filter(item => !item.isMain || visibleTabs.includes(item.id));

  return (
    <div className="space-y-8">
      {/* Stats Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#181818] p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-xl md:shadow-2xl relative overflow-hidden mb-6 md:mb-8"
      >
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-emerald-500/5 blur-2xl md:blur-3xl rounded-full -mr-16 -mt-16 md:-mr-32 md:-mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Trophy size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-lg font-black text-gray-900 dark:text-white">إنجازاتك حتى الآن</h4>
              <p className="text-[8px] md:text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">أنت تسير في الطريق الصحيح للنمو</p>
            </div>
          </div>
          <div className="flex items-center justify-around w-full md:w-auto gap-4 md:gap-8 bg-gray-100 dark:bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">{completedCount}</div>
              <div className="text-[8px] md:text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">درس مكتمل</div>
            </div>
            <div className="w-px h-6 md:h-8 bg-gray-300 dark:bg-white/10" />
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">{Math.floor(completedCount / 5)}</div>
              <div className="text-[8px] md:text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">شهادة وحدة</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-3 md:gap-4"
      >
        {menuItems.map((menuItem) => (
          <motion.div 
            key={menuItem.id}
            variants={item}
            whileHover={!menuItem.disabled ? { y: -2, scale: 1.01 } : {}}
            whileTap={!menuItem.disabled ? { scale: 0.98 } : {}}
            onClick={() => !menuItem.disabled && onNavigate(menuItem.id as any)}
            className={`p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all group relative overflow-hidden cursor-pointer ${
              menuItem.disabled 
                ? 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 opacity-50 grayscale cursor-not-allowed' 
                : `bg-gradient-to-br ${menuItem.color} ${menuItem.borderColor} hover:bg-gray-50 dark:hover:bg-white/5`
            }`}
          >
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-3 md:gap-5">
                <div className={`w-10 h-10 md:w-14 md:h-14 bg-gray-200 dark:bg-black/40 rounded-xl md:rounded-2xl shadow-xl border border-gray-300 dark:border-white/10 flex items-center justify-center shrink-0 ${menuItem.textColor}`}>
                  {React.cloneElement(menuItem.icon as React.ReactElement, { className: 'w-5 h-5 md:w-6 md:h-6' })}
                </div>
                <div>
                  <h3 className={`font-black text-base sm:text-xl text-gray-900 dark:text-white mb-0.5 md:mb-1 group-hover:${menuItem.textColor} transition-colors`}>
                    {menuItem.title}
                  </h3>
                </div>
              </div>
              {!menuItem.disabled && <ChevronLeft className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors w-4 h-4 md:w-6 md:h-6 shrink-0" />}
              {menuItem.disabled && <Lock size={16} className="text-gray-400 md:w-[18px] md:h-[18px] shrink-0" />}
            </div>
            
            {/* Decorative element */}
            <div className={`absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 w-16 h-16 md:w-32 md:h-32 bg-gray-200 dark:bg-white/5 rounded-full blur-xl md:blur-2xl group-hover:scale-150 transition-transform duration-700`} />
          </motion.div>
        ))}

        {isInstallable && (
          <motion.div 
            variants={item}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onInstall}
            className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] border bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group relative overflow-hidden cursor-pointer"
          >
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-3 md:gap-5">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-200 dark:bg-black/40 rounded-xl md:rounded-2xl shadow-xl border border-gray-300 dark:border-white/10 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                  <Lucide.Download size={24} className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-xl text-gray-900 dark:text-white mb-0.5 md:mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    تحميل التطبيق (PWA)
                  </h3>
                </div>
              </div>
              <ChevronLeft className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors w-4 h-4 md:w-6 md:h-6 shrink-0" />
            </div>
            <div className="absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 w-16 h-16 md:w-32 md:h-32 bg-indigo-500/5 rounded-full blur-xl md:blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        )}
        
      </motion.div>
    </div>
  );
};

const Lock = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
