import React from 'react';
import { motion } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { Button } from './ui/Button';

const { X, Medal, Flame, Star, Target, Zap, Crown } = Lucide;

export const AchievementsModal = ({ stats, onClose }: { stats: any, onClose: () => void }) => {
  const achievements = [
    { id: 'first_lesson', title: 'بطل البدايات', desc: 'أكملت أول درس لك', icon: <Medal />, color: 'text-blue-400', bg: 'bg-blue-400/10', unlocked: stats.lessonsCompleted >= 1 },
    { id: 'streak_3', title: 'شعلة النشاط', desc: 'حافظت على حماسك لـ 3 أيام', icon: <Flame />, color: 'text-orange-500', bg: 'bg-orange-500/10', unlocked: stats.currentStreak >= 3 },
    { id: 'perfect_5', title: 'العقل المدبر', desc: 'أجبت إجابات صحيحة 5 مرات', icon: <Target />, color: 'text-purple-400', bg: 'bg-purple-400/10', unlocked: stats.perfectQuizzes >= 5 },
    { id: 'xp_1000', title: 'حاصد النقاط', desc: 'جمعت 1000 نقطة خبرة', icon: <Star />, color: 'text-yellow-400', bg: 'bg-yellow-400/10', unlocked: stats.totalXP >= 1000 },
    { id: 'lessons_10', title: 'المتعلم الشغوف', desc: 'أكملت 10 دروس', icon: <Zap />, color: 'text-[#1DB954]', bg: 'bg-[#1DB954]/10', unlocked: stats.lessonsCompleted >= 10 },
    { id: 'path_complete', title: 'الخبير', desc: 'أنهيت مساراً تعليمياً كاملاً', icon: <Crown />, color: 'text-pink-400', bg: 'bg-pink-400/10', unlocked: stats.pathsCompleted >= 1 },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-[#181818] rounded-3xl max-w-2xl w-full p-6 md:p-8 border border-white/10 relative max-h-[90vh] overflow-y-auto"
      >
        <Button 
          onClick={onClose} 
          variant="ghost"
          size="sm"
          className="absolute top-6 right-6 text-gray-300 hover:text-white p-0"
        >
          <X size={24} />
        </Button>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">الجوائز والإنجازات</h2>
          <p className="text-gray-200">اجمع الجوائز واثبت مهارتك في مسار الثراء</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {achievements.map((ach) => (
            <div key={ach.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${ach.unlocked ? 'bg-[#282828] border-white/10' : 'bg-[#121212] border-white/5 opacity-50 grayscale'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${ach.unlocked ? ach.bg : 'bg-white/5'} ${ach.unlocked ? ach.color : 'text-white/20'}`}>
                {React.cloneElement(ach.icon as React.ReactElement, { size: 28 })}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{ach.title}</h3>
                <p className="text-sm text-gray-300">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
