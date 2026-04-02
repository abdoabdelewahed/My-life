import React, { useState, useMemo } from 'react';
import { SKILLS_ROADMAP } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
const { 
  Zap, 
  Trophy, 
  Target, 
  Rocket, 
  Brain, 
  Code, 
  Shield, 
  Heart,
  Sparkles,
  Lock,
  CheckCircle2,
  Terminal,
  Crown,
  Briefcase,
  TrendingUp,
  Users,
  Presentation
} = Lucide;

interface SkillIndicatorsProps {
  completedTasksCount?: number;
  totalTasksCount?: number;
  pathProgress?: Record<string, number>;
  compact?: boolean;
}

export const SkillsRoadmap: React.FC<SkillIndicatorsProps> = ({ 
  completedTasksCount = 0, 
  totalTasksCount = 1,
  pathProgress = {},
  compact = false
}) => {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);
  
  // Calculate overall progress
  const totalItems = useMemo(() => SKILLS_ROADMAP.reduce((acc, phase) => acc + phase.items.length, 0), []);
  const progressRatio = totalTasksCount > 0 ? completedTasksCount / totalTasksCount : 0;
  const completedRoadmapItemsCount = Math.round(progressRatio * totalItems);
  const overallProgressPercentage = Math.round((completedRoadmapItemsCount / totalItems) * 100);

  const isItemCompleted = (phaseIdx: number, itemIdx: number) => {
    let absoluteIdx = 0;
    for (let i = 0; i < phaseIdx; i++) {
      absoluteIdx += SKILLS_ROADMAP[i].items.length;
    }
    absoluteIdx += itemIdx;
    return absoluteIdx < completedRoadmapItemsCount;
  };

  const getPhaseProgress = (phaseIdx: number) => {
    const phase = SKILLS_ROADMAP[phaseIdx];
    const completedInPhase = phase.items.filter((_, i) => isItemCompleted(phaseIdx, i)).length;
    return (completedInPhase / phase.items.length) * 100;
  };

  const phaseIcons = [
    <Zap className="text-yellow-400" />,
    <Shield className="text-blue-400" />,
    <Brain className="text-purple-400" />,
    <Target className="text-emerald-400" />,
    <Heart className="text-pink-400" />,
    <Crown className="text-amber-400" />
  ];

  const phaseGradients = [
    "from-yellow-500/20 to-yellow-500/5",
    "from-blue-500/20 to-blue-500/5",
    "from-purple-500/20 to-purple-500/5",
    "from-emerald-500/20 to-emerald-500/5",
    "from-pink-500/20 to-pink-500/5",
    "from-amber-500/20 to-amber-500/5"
  ];

  const phaseBorders = [
    "border-yellow-500/30",
    "border-blue-500/30",
    "border-purple-500/30",
    "border-emerald-500/30",
    "border-pink-500/30",
    "border-amber-500/30"
  ];

  const phaseTextColors = [
    "text-yellow-400",
    "text-blue-400",
    "text-purple-400",
    "text-emerald-400",
    "text-pink-400",
    "text-amber-400"
  ];

  if (compact) {
    return (
      <div className="bg-[#181818]/60 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-xl relative overflow-hidden group flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 64 64" className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={175.93}
                initial={{ strokeDashoffset: 175.93 }}
                animate={{ strokeDashoffset: 175.93 - (175.93 * overallProgressPercentage) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-[#1DB954] drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-white">{overallProgressPercentage}%</span>
            </div>
          </div>
          <div className="text-right">
            <h4 className="text-sm font-black text-white tracking-tight">مؤشر الوعي</h4>
            <p className="text-[10px] text-gray-500 font-bold">تقدمك الكلي في المسارات</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {phaseIcons.slice(0, 3).map((icon, i) => (
            <div key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-50">
              {React.cloneElement(icon as React.ReactElement, { size: 16 })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 py-6 md:py-8">
      {/* Hero Progress Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 via-transparent to-blue-500/10 blur-3xl -z-10 opacity-50" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 bg-[#181818]/60 backdrop-blur-xl border border-white/10 p-6 md:p-12 rounded-3xl md:rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1DB954] to-transparent opacity-30" />
          
          <div className="space-y-3 md:space-y-4 text-center md:text-right relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 md:mb-2"
            >
              <Sparkles size={14} className="animate-pulse" />
              مؤشرات التشافي والوعي
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              رحلتك نحو <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DB954] to-emerald-400">السلام الداخلي</span>
            </h2>
            <p className="text-gray-400 font-medium max-w-xl text-sm md:text-lg leading-relaxed">
              نحن لا نقيس مجرد دروس مكتملة، بل نقيس تطور وعيك الداخلي وقدرتك على بناء علاقة صحية ومتزنة مع ذاتك.
            </p>
          </div>

          <div className="relative shrink-0">
            <svg viewBox="0 0 192 192" className="w-32 h-32 md:w-48 md:h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={552.92}
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * overallProgressPercentage) / 100 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="text-[#1DB954] drop-shadow-[0_0_15px_rgba(29,185,84,0.5)]"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl md:text-5xl font-black text-white tracking-tighter"
              >
                {overallProgressPercentage}%
              </motion.span>
              <span className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mt-0.5 md:mt-1">الإنجاز الكلي</span>
            </div>
            
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-[#1DB954]/20 blur-[40px] md:blur-[60px] rounded-full -z-10 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {SKILLS_ROADMAP.map((phase, phaseIdx) => {
          const progress = getPhaseProgress(phaseIdx);
          const isCompleted = progress === 100;
          const isLocked = phaseIdx > 0 && getPhaseProgress(phaseIdx - 1) < 100;
          const isHovered = hoveredPhase === phaseIdx;
          const colorIndex = phaseIdx % phaseGradients.length;

          return (
            <motion.div
              key={phaseIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIdx * 0.1 }}
              onHoverStart={() => setHoveredPhase(phaseIdx)}
              onHoverEnd={() => setHoveredPhase(null)}
              className={`relative bg-[#181818]/80 backdrop-blur-md border rounded-2xl md:rounded-[2rem] p-5 md:p-6 overflow-hidden transition-all duration-500 ${
                isLocked ? 'border-white/5 opacity-50 grayscale' : 
                isHovered ? `${phaseBorders[colorIndex]} shadow-2xl shadow-black/50 transform -translate-y-2` : 
                'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${phaseGradients[colorIndex]} opacity-0 transition-opacity duration-500 ${isHovered && !isLocked ? 'opacity-100' : ''}`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center ${
                    isLocked ? 'bg-white/5 text-gray-600' : 
                    isCompleted ? 'bg-white text-black shadow-lg shadow-white/20' : 
                    'bg-[#222] border border-white/10'
                  }`}>
                    {isLocked ? <Lock size={20} className="md:w-6 md:h-6" /> : 
                     isCompleted ? <CheckCircle2 size={24} className="md:w-7 md:h-7" /> : 
                     React.cloneElement(phaseIcons[colorIndex] as React.ReactElement, { size: 28 })}
                  </div>
                  
                  {!isLocked && (
                    <div className="text-right">
                      <span className={`text-xl md:text-2xl font-black ${isCompleted ? 'text-white' : phaseTextColors[colorIndex]}`}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  )}
                </div>

                <h3 className={`text-lg md:text-xl font-black mb-3 md:mb-4 ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                  {phase.title}
                </h3>

                <div className="space-y-2 md:space-y-3">
                  {phase.items.map((item, itemIdx) => {
                    const completed = isItemCompleted(phaseIdx, itemIdx);
                    return (
                      <div key={itemIdx} className="flex items-start gap-2 md:gap-3">
                        <div className={`mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center shrink-0 border ${
                          completed ? `bg-[#1DB954] border-[#1DB954] text-black` : 
                          'border-white/20 text-transparent'
                        }`}>
                          <CheckCircle2 size={10} className={`md:w-3 md:h-3 ${completed ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <span className={`text-xs md:text-sm font-medium leading-relaxed ${
                          completed ? 'text-gray-300' : 
                          isLocked ? 'text-gray-600' : 
                          'text-gray-400'
                        }`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Bar */}
                {!isLocked && (
                  <div className="mt-4 md:mt-6 h-1 md:h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${phaseGradients[colorIndex].replace('to-', 'via-').replace('/5', '/50')} to-white`}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
