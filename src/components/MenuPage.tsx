import React from 'react';
import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';
import { Button } from './ui/Button';
const { Zap, FileBadge, Info, ChevronLeft, Sparkles, Trophy, Users, Volume2, VolumeX } = Lucide;

interface MenuPageProps {
  onNavigate: (tab: 'tools' | 'certificates' | 'about' | 'tasks') => void;
  completedCount: number;
  stats: any;
  onUpdateStats: (stats: any) => void;
  onLogout: () => void;
  isInstallable?: boolean;
  onInstall?: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
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

export const MenuPage = ({ onNavigate, completedCount, stats, onUpdateStats, onLogout, isInstallable, onInstall, soundEnabled, setSoundEnabled }: MenuPageProps) => {
  const menuItems = [
    {
      id: 'certificates',
      title: 'الشهادات والإنجازات',
      description: 'استعرض جميع الشهادات التي حصلت عليها خلال رحلتك.',
      icon: <FileBadge size={24} className="text-emerald-500" />,
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      disabled: completedCount === 0
    },
    {
      id: 'about',
      title: 'من نحن',
      description: 'تعرف على رؤية منصة الثراء المعرفي 2026 وأهدافنا.',
      icon: <Users size={24} className="text-blue-500" />,
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400'
    }
  ];

  const useForgivenessDay = () => {
    if (stats?.forgivenessDays > 0) {
      onUpdateStats({ ...stats, forgivenessDays: stats.forgivenessDays - 1 });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-6 md:mb-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Ethereal Background Animation */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: [0, 20, -20, 0],
                y: [0, -20, 20, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-emerald-500/10 blur-[60px] md:blur-[80px] rounded-full"
            />
            <motion.div
              animate={{
                x: [0, -30, 30, 0],
                y: [0, 30, -30, 0],
                scale: [1, 0.8, 1.2, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-blue-500/10 blur-[40px] md:blur-[60px] rounded-full"
            />
          </div>

          <div className="inline-block px-2 py-0.5 md:px-3 md:py-1 mb-2 md:mb-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
            رحلة الوعي الداخلي
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 md:mb-3 tracking-tighter leading-tight">
            استكشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">آفاق النمو</span> الذاتي
          </h2>
          <p className="text-gray-400 text-xs md:text-sm font-medium max-w-md mx-auto leading-relaxed px-4 md:px-0">
            محطتك الشاملة للتحكم في صحتك النفسية وتطوير ذاتك. اختر وجهتك التالية في رحلة السلام الداخلي.
          </p>
          <div className="flex justify-center gap-1 mt-3 md:mt-4">
            <div className="w-4 h-1 md:w-6 md:h-1 bg-emerald-500 rounded-full" />
            <div className="w-1 h-1 md:w-1.5 md:h-1 bg-emerald-500/30 rounded-full" />
            <div className="w-0.5 h-1 md:w-1 md:h-1 bg-emerald-500/10 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* Sound Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#181818] p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/5 shadow-xl md:shadow-2xl relative overflow-hidden mb-4 md:mb-8 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white">
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </div>
          <div>
            <h4 className="text-base md:text-lg font-black text-white">الصوت</h4>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold mt-0.5 md:mt-1">
              {soundEnabled ? 'تم تفعيل المؤثرات الصوتية' : 'تم تعطيل المؤثرات الصوتية'}
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          variant={soundEnabled ? "success" : "ghost"}
          size="sm"
        >
          {soundEnabled ? 'تشغيل' : 'إيقاف'}
        </Button>
      </motion.div>

      {/* Forgiveness Days Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#181818] p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/5 shadow-xl md:shadow-2xl relative overflow-hidden mb-4 md:mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h4 className="text-base md:text-lg font-black text-white">أيام السماح (Streak Freeze)</h4>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold mt-0.5 md:mt-1">لديك {stats?.forgivenessDays || 0} أيام سماح متبقية</p>
          </div>
          <Button 
            onClick={useForgivenessDay}
            disabled={!stats?.forgivenessDays || stats.forgivenessDays === 0}
            variant="success"
            size="sm"
            className="w-full sm:w-auto"
          >
            استخدام يوم سماح
          </Button>
        </div>
      </motion.div>

      {/* Stats Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#181818] p-4 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/5 shadow-xl md:shadow-2xl relative overflow-hidden mb-6 md:mb-8"
      >
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-emerald-500/5 blur-2xl md:blur-3xl rounded-full -mr-16 -mt-16 md:-mr-32 md:-mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-lg font-black text-white">إنجازاتك حتى الآن</h4>
              <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 md:mt-1">أنت تسير في الطريق الصحيح للنمو</p>
            </div>
          </div>
          <div className="flex items-center justify-around w-full md:w-auto gap-4 md:gap-8 bg-white/5 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-black text-white">{completedCount}</div>
              <div className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-tighter">درس مكتمل</div>
            </div>
            <div className="w-px h-6 md:h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-lg sm:text-2xl font-black text-white">{Math.floor(completedCount / 5)}</div>
              <div className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-tighter">شهادة وحدة</div>
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
                ? 'bg-white/5 border-white/5 opacity-50 grayscale cursor-not-allowed' 
                : `bg-gradient-to-br ${menuItem.color} ${menuItem.borderColor} hover:bg-white/5`
            }`}
          >
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-3 md:gap-5">
                <div className={`w-10 h-10 md:w-14 md:h-14 bg-black/40 rounded-xl md:rounded-2xl shadow-xl border border-white/10 flex items-center justify-center shrink-0 ${menuItem.textColor}`}>
                  {React.cloneElement(menuItem.icon as React.ReactElement, { className: 'w-5 h-5 md:w-6 md:h-6' })}
                </div>
                <div>
                  <h3 className={`font-black text-base sm:text-xl text-white mb-0.5 md:mb-1 group-hover:${menuItem.textColor} transition-colors`}>
                    {menuItem.title}
                  </h3>
                  <p className="text-[10px] sm:text-sm text-gray-400 font-medium leading-relaxed max-w-[200px] sm:max-w-xs">
                    {menuItem.description}
                  </p>
                </div>
              </div>
              {!menuItem.disabled && <ChevronLeft className="text-gray-500 group-hover:text-white transition-colors w-4 h-4 md:w-6 md:h-6 shrink-0" />}
              {menuItem.disabled && <Lock size={16} className="text-gray-600 md:w-[18px] md:h-[18px] shrink-0" />}
            </div>
            
            {/* Decorative element */}
            <div className={`absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 w-16 h-16 md:w-32 md:h-32 bg-white/5 rounded-full blur-xl md:blur-2xl group-hover:scale-150 transition-transform duration-700`} />
          </motion.div>
        ))}

        {isInstallable && (
          <motion.div 
            variants={item}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onInstall}
            className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] border bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border-indigo-500/30 hover:bg-white/5 transition-all group relative overflow-hidden cursor-pointer"
          >
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-3 md:gap-5">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-black/40 rounded-xl md:rounded-2xl shadow-xl border border-white/10 flex items-center justify-center shrink-0 text-indigo-400">
                  <Lucide.Download size={24} className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-xl text-white mb-0.5 md:mb-1 group-hover:text-indigo-400 transition-colors">
                    تحميل التطبيق (PWA)
                  </h3>
                  <p className="text-[10px] sm:text-sm text-gray-400 font-medium leading-relaxed max-w-[200px] sm:max-w-xs">
                    قم بتثبيت التطبيق على جهازك للوصول السريع والعمل بدون إنترنت.
                  </p>
                </div>
              </div>
              <ChevronLeft className="text-gray-500 group-hover:text-white transition-colors w-4 h-4 md:w-6 md:h-6 shrink-0" />
            </div>
            <div className="absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 w-16 h-16 md:w-32 md:h-32 bg-indigo-500/5 rounded-full blur-xl md:blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        )}
        
        <Button
          onClick={onLogout}
          variant="danger"
          size="xl"
          fullWidth
        >
          <Lucide.LogOut size={20} />
          تسجيل الخروج
        </Button>
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
