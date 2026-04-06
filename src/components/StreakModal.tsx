import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flame, Star, Trophy, CheckCircle2, MessageSquare, Zap, ArrowLeft, ArrowRight, Share2, MoreHorizontal, Book } from 'lucide-react';
import { Button } from './ui/Button';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    currentStreak: number;
    lessonsCompleted: number;
    perfectQuizzes: number;
    totalXP: number;
  };
  level: number;
}

const FLAME_STAGES = [
  {
    level: 1,
    name: 'شعلة مبتدئة',
    color: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-500/20',
    icon: '🔥',
    description: 'بداية الرحلة! استمر في التعلم لتكبر شعلتك.',
    message: 'كلما تعلمت أكثر، كلما كبرت شعلتي!'
  },
  {
    level: 5,
    name: 'شعلة متوهجة',
    color: 'from-orange-500 to-red-600',
    bg: 'bg-orange-600/20',
    icon: '🔥',
    description: 'أنت تزداد حرارة! شعلتك بدأت تأخذ شكلاً أقوى.',
    message: 'أنا أشعر بالقوة الآن!'
  },
  {
    level: 10,
    name: 'شعلة زرقاء',
    color: 'from-blue-400 to-blue-600',
    bg: 'bg-blue-500/20',
    icon: '💎',
    description: 'وصلت لأعلى درجات الحرارة! شعلتك أصبحت زرقاء ونقية.',
    message: 'لقد وصلت لمستوى مذهل!'
  },
  {
    level: 20,
    name: 'شعلة ملكية',
    color: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-600/20',
    icon: '👑',
    description: 'أنت ملك الانضباط! شعلتك أسطورية ولا تنطفئ.',
    message: 'أنا فخور بك جداً!'
  }
];

export const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose, stats, level }) => {
  const currentStage = [...FLAME_STAGES].reverse().find(s => level >= s.level) || FLAME_STAGES[0];
  const nextStage = FLAME_STAGES.find(s => s.level > level);
  
  const progressToNext = nextStage 
    ? ((level - currentStage.level) / (nextStage.level - currentStage.level)) * 100 
    : 100;

  const pointsToNext = nextStage ? nextStage.level - level : 0;

  const tasks = [
    { id: 1, title: 'أكمل درساً واحداً', reward: '+10 نقطة نمو', completed: false, icon: <Zap size={18} className="text-yellow-400" /> },
    { id: 2, title: 'احصل على درجة كاملة في اختبار', reward: '+25 نقطة نمو', completed: false, icon: <Trophy size={18} className="text-orange-400" /> },
    { id: 3, title: 'حافظ على الاستمرارية لـ 3 أيام', reward: '+50 نقطة نمو', completed: stats.currentStreak >= 3, icon: <Flame size={18} className="text-red-400" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[100] bg-app-bg overflow-y-auto selection:bg-orange-500/30"
        >
          <div 
            className="min-h-screen relative w-full flex flex-col items-center overflow-hidden"
            style={{ 
              background: `radial-gradient(circle at 50% -20%, ${currentStage.level >= 10 ? '#1e40af' : currentStage.level >= 5 ? '#9a3412' : '#ea580c'}44, var(--app-bg) 70%)` 
            }}
          >
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                  rotate: [0, 90, 0]
                }}
                transition={{ duration: 10, repeat: Infinity }}
                className={`absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[120px] ${currentStage.bg}`}
              />
            </div>

            {/* Header Controls */}
            <div className="sticky top-0 left-0 right-0 w-full p-6 md:p-10 flex items-center justify-end z-30">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-12 h-12 rounded-2xl bg-app-surface/50 backdrop-blur-2xl flex items-center justify-center text-app-text-primary border border-app-border shadow-2xl hover:bg-app-surface/80 transition-all"
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="w-full max-w-xl px-6 pb-24 flex flex-col items-center relative z-10">
              {/* Character Section */}
              <div className="relative w-full flex flex-col items-center mb-4">
                {/* Character Aura */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full ${currentStage.bg} blur-[80px] opacity-40`} />
                
                {/* Level Badge */}
                <div className="mt-2 px-2 py-0.5 rounded-full bg-app-surface/50 border border-app-border backdrop-blur-md">
                  <span className="text-[8px] font-black text-app-text-secondary tracking-[0.2em] uppercase">{currentStage.name}</span>
                </div>
              </div>

              {/* Main Stats Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full bg-gradient-to-b from-app-surface/80 to-app-surface/40 backdrop-blur-3xl border border-app-border rounded-[3rem] p-10 shadow-2xl flex flex-col items-center relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                
                <p className="text-app-text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-4">سلسلة أيامك</p>
                <div className="flex items-center justify-center gap-4">
                  <motion.div
                    animate={{ 
                      y: [0, -8, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="filter drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] select-none"
                  >
                    <Flame className="text-orange-500 w-12 h-12 md:w-16 md:h-16" fill="currentColor" />
                  </motion.div>
                  <h2 className="text-6xl md:text-8xl font-black text-app-text-primary tracking-tighter drop-shadow-lg">
                    {stats.currentStreak}<span className="text-app-text-secondary/50 text-3xl md:text-4xl ml-1">/30</span>
                  </h2>
                </div>

                {/* Progress Section */}
                <div className="mt-10 w-full">
                  <div className="flex justify-between items-end mb-2 px-1">
                    <span className="text-[9px] font-black text-app-text-secondary uppercase tracking-widest">التقدم للمظهر التالي</span>
                    <span className="text-[10px] font-black text-orange-500">{Math.round(progressToNext)}%</span>
                  </div>
                  <div className="h-1.5 bg-app-bg rounded-full overflow-hidden border border-app-border p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${currentStage.color} shadow-[0_0_10px_rgba(249,115,22,0.4)]`}
                    />
                  </div>
                  <p className="mt-4 text-app-text-secondary text-[11px] font-bold text-center">
                    {nextStage ? `متبقي ${pointsToNext} مستوى للتحول الجديد` : 'وصلت لأقصى تطور متاح حالياً!'}
                  </p>
                </div>
              </motion.div>

              {/* Tasks Section */}
              <div className="w-full mt-10 space-y-4">
                <div className="flex items-center justify-between px-4 mb-2">
                  <h4 className="text-app-text-primary text-lg font-black">المهام اليومية</h4>
                  <div className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <span className="text-[10px] font-black text-orange-500 uppercase">تحديث يومي</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {tasks.map((task) => (
                    <motion.div 
                      key={task.id}
                      whileHover={{ x: -5 }}
                      className="bg-app-surface hover:bg-app-surface/80 backdrop-blur-xl border border-app-border rounded-3xl p-5 flex items-center gap-5 transition-all group cursor-pointer"
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-app-bg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        {task.icon}
                      </div>
                      <div className="flex-1 text-right">
                        <p className={`text-base font-bold ${task.completed ? 'text-app-text-secondary line-through' : 'text-app-text-primary'}`}>
                          {task.title}
                        </p>
                        <p className="text-[10px] font-black text-orange-500/80 uppercase tracking-wider mt-1">
                          {task.reward}
                        </p>
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white scale-110' : 'border-app-border group-hover:border-app-text-secondary'}`}>
                        {task.completed && <CheckCircle2 size={16} />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer Stats */}
              <div className="w-full mt-10 grid grid-cols-2 gap-4">
                {[
                  { label: 'الدروس المكتملة', value: stats.lessonsCompleted, icon: <Book size={14} /> },
                  { label: 'إجمالي النقاط', value: stats.totalXP, icon: <Star size={14} /> }
                ].map((stat, i) => (
                  <div key={i} className="bg-app-surface border border-app-border rounded-[2rem] p-6 flex flex-col items-center text-center group hover:bg-app-surface/80 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-app-bg flex items-center justify-center text-app-text-secondary mb-3 group-hover:text-app-text-primary transition-colors">
                      {stat.icon}
                    </div>
                    <p className="text-app-text-secondary text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-app-text-primary">{stat.value}</p>
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
