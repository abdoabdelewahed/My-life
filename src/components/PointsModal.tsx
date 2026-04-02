import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Trophy, Zap, TrendingUp, Award, Sparkles, Edit3 } from 'lucide-react';
import { Button } from './ui/Button';

interface PointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  xp: number;
  level: number;
  stats: {
    lessonsCompleted: number;
    perfectQuizzes: number;
    pathsCompleted: number;
    totalXP: number;
  };
}

export const PointsModal: React.FC<PointsModalProps> = ({ isOpen, onClose, xp, level, stats }) => {
  const nextLevelXP = (level + 1) * 1000;
  const progressToNextLevel = (xp % 1000) / 10;
  const pointsToNext = 1000 - (xp % 1000);

  const waysToEarn = [
    { title: 'إكمال الدروس', desc: 'احصل على 50-100 نقطة لكل درس', icon: <Zap size={18} className="text-yellow-400" />, reward: '+50 XP' },
    { title: 'الاختبارات المثالية', desc: 'مكافأة مضاعفة عند الإجابة الصحيحة 100%', icon: <Award size={18} className="text-orange-400" />, reward: '+100 XP' },
    { title: 'إنهاء المسارات', desc: 'مكافأة كبرى عند إتمام مسار تعليمي كامل', icon: <Trophy size={18} className="text-purple-400" />, reward: '+500 XP' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto selection:bg-yellow-500/30"
        >
          <div 
            className="min-h-screen relative w-full flex flex-col items-center overflow-hidden"
            style={{ 
              background: `radial-gradient(circle at 50% -20%, #eab30822, #0a0a0a 70%)` 
            }}
          >
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.05, 0.15, 0.05],
                  rotate: [0, -90, 0]
                }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-yellow-500/20"
              />
            </div>

            {/* Header Controls */}
            <div className="sticky top-0 left-0 right-0 w-full p-6 md:p-10 flex items-center justify-end z-30">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-2xl flex items-center justify-center text-white border border-white/10 shadow-2xl hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="w-full max-w-xl px-6 pb-24 flex flex-col items-center relative z-10">
              {/* Character Section */}
              <div className="relative w-full flex flex-col items-center mb-4">
                {/* Character Aura */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-yellow-500/20 blur-[80px] opacity-40" />
                
                {/* Level Badge */}
                <div className="mt-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                  <span className="text-[8px] font-black text-white/40 tracking-[0.2em] uppercase">المستوى {level}</span>
                </div>
              </div>

              {/* Main Stats Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-4">إجمالي النقاط</p>
                <div className="flex items-center justify-center gap-4">
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="filter drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] select-none"
                  >
                    <Star className="text-yellow-500 w-12 h-12 md:w-16 md:h-16" fill="currentColor" />
                  </motion.div>
                  <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                    {xp}
                  </h2>
                </div>

                {/* Progress Section */}
                <div className="mt-10 w-full">
                  <div className="flex justify-between items-end mb-2 px-1">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">التقدم للمستوى التالي</span>
                    <span className="text-[10px] font-black text-yellow-500">{Math.round(progressToNextLevel)}%</span>
                  </div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNextLevel}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                    />
                  </div>
                  <p className="mt-4 text-white/40 text-[11px] font-bold text-center">
                    متبقي {pointsToNext} XP للوصول للمستوى {level + 1}
                  </p>
                </div>
              </motion.div>

              {/* Ways to Earn Section */}
              <div className="w-full mt-10 space-y-4">
                <div className="flex items-center justify-between px-4 mb-2">
                  <h4 className="text-white text-lg font-black">كيف تحصل على النقاط؟</h4>
                  <div className="px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="text-[10px] font-black text-yellow-500 uppercase">دليل النقاط</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {waysToEarn.map((way, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: -5 }}
                      className="bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/5 rounded-3xl p-5 flex items-center gap-5 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {way.icon}
                      </div>
                      <div className="flex-1 text-right">
                        <h5 className="text-white font-black text-base mb-0.5">{way.title}</h5>
                        <p className="text-gray-500 text-xs font-medium">{way.desc}</p>
                        <p className="text-[10px] font-black text-yellow-500/80 uppercase tracking-wider mt-1">
                          {way.reward}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="w-full mt-10 grid grid-cols-3 gap-4">
                {[
                  { label: 'الدروس', value: stats.lessonsCompleted },
                  { label: 'الاختبارات', value: stats.perfectQuizzes },
                  { label: 'المسارات', value: stats.pathsCompleted }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 flex flex-col items-center text-center group hover:bg-white/[0.04] transition-colors">
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
