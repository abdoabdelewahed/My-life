import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Check, Lock, Play, Target, ChevronDown, ChevronUp, BookOpen, Trophy, Rocket, Compass, X } from 'lucide-react';
import { LEARNING_PATHS, PATH_COLORS } from '../constants';
import { Button } from './ui/Button';

interface FullRoadmapProps {
  pathProgress: Record<string, number>;
  onStepClick: (step: any) => void;
  onClose: () => void;
  activePathId: string;
  onSelectPath: (pathId: string) => void;
  onViewCertificate: (title: string, type: 'unit' | 'path', color: any) => void;
  initialPathId?: string | null;
}

export function FullRoadmap({ 
  pathProgress, 
  onStepClick, 
  onClose, 
  activePathId, 
  onSelectPath, 
  onViewCertificate,
  initialPathId = null
}: FullRoadmapProps) {
  const [viewingPathId, setViewingPathId] = useState<string | null>(initialPathId);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
  const currentUnitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If we are viewing a path, scroll to current unit
    if (viewingPathId) {
      const timer = setTimeout(() => {
        if (currentUnitRef.current) {
          currentUnitRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathProgress, viewingPathId]);

  const toggleUnit = (unitId: string) => {
    setExpandedUnitId(prev => prev === unitId ? null : unitId);
  };

  const selectedPath = LEARNING_PATHS.find(p => p.id === viewingPathId);
  const selectedPathIndex = LEARNING_PATHS.findIndex(p => p.id === viewingPathId);
  const selectedPathColor = selectedPathIndex !== -1 ? PATH_COLORS[selectedPathIndex % PATH_COLORS.length] : null;

  // Calculate overall progress
  const totalLessons = LEARNING_PATHS.reduce((acc, path) => acc + (Array.isArray(path?.units) ? path.units.flatMap(u => Array.isArray(u?.lessons) ? u.lessons : []).length : 0), 0);
  const completedLessons = LEARNING_PATHS.reduce((acc, path) => acc + (pathProgress[path.id] || 0), 0);
  const overallProgressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Calculate certificates count (Unit certificates + Path certificates)
  const certificatesCount = LEARNING_PATHS.reduce((acc, path) => {
    const currentProgress = pathProgress[path.id] || 0;
    let count = 0;
    let accumulated = 0;
    if (Array.isArray(path?.units)) {
      for (const unit of path.units) {
        accumulated += Array.isArray(unit?.lessons) ? unit.lessons.length : 0;
        if (currentProgress >= accumulated) count++;
      }
      const totalInPath = path.units.flatMap(u => Array.isArray(u?.lessons) ? u.lessons : []).length;
      if (totalInPath > 0 && currentProgress === totalInPath) count++;
    }
    return acc + count;
  }, 0);

  const totalCertificatesCount = LEARNING_PATHS.reduce((acc, path) => {
    return acc + (Array.isArray(path?.units) ? path.units.length : 0) + 1;
  }, 0);

  const activePath = LEARNING_PATHS.find(p => p.id === activePathId) || LEARNING_PATHS[0];
  const activePathIndex = LEARNING_PATHS.findIndex(p => p.id === activePathId);
  const activePathColor = activePathIndex !== -1 ? PATH_COLORS[activePathIndex % PATH_COLORS.length] : PATH_COLORS[0];

  if (!viewingPathId) {
    return (
      <div className="space-y-10 pb-12">
        {/* Header & Progress Dashboard */}
        <div className="bg-gradient-to-br from-[#181818] to-[#121212] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-black/50 group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#1DB954]/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 md:gap-8 relative z-10">
            <div className="space-y-6 md:space-y-8 w-full">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 w-full">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#1DB954]/30 to-[#1DB954]/10 flex items-center justify-center text-[#1DB954] shadow-lg shadow-[#1DB954]/20 border border-[#1DB954]/20 backdrop-blur-md shrink-0">
                    <Target size={36} className="drop-shadow-md w-7 h-7 md:w-9 md:h-9" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">استكشف المسارات</h2>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base font-medium mt-1 md:mt-2">اختر تخصصك وابدأ رحلة النجاح في عالم الذكاء الاصطناعي</p>
                  </div>
                </div>

                <div className="flex items-center bg-black/20 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 backdrop-blur-sm w-full lg:w-[503px]">
                  <div className="flex-1 text-center space-y-1">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black text-white drop-shadow-md">{overallProgressPercent}%</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      التقدم
                    </p>
                  </div>
                  
                  <div className="h-10 md:h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex-1 text-center space-y-1">
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black text-[#1DB954] drop-shadow-md">{completedLessons}</span>
                      <span className="text-gray-500 text-sm sm:text-base font-bold">/ {totalLessons}</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
                      الدروس
                    </p>
                  </div>

                  <div className="h-10 md:h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex-1 text-center space-y-1">
                    <div className="flex items-baseline justify-center gap-1.5">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black text-yellow-500 drop-shadow-md">{certificatesCount}</span>
                      <span className="text-gray-500 text-sm sm:text-base font-bold">/ {totalCertificatesCount}</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      الشهادات
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paths Grid */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {(Array.isArray(LEARNING_PATHS) ? LEARNING_PATHS : []).map((path, index) => {
            const color = PATH_COLORS[index % PATH_COLORS.length];
            const currentStepIndex = pathProgress[path.id] || 0;
            const totalLessonsInPath = Array.isArray(path?.units) ? path.units.flatMap(u => Array.isArray(u?.lessons) ? u.lessons : []).length : 0;
            const isCompleted = totalLessonsInPath > 0 && currentStepIndex === totalLessonsInPath;
            const isActive = activePathId === path.id;

            return (
              <motion.div
                key={path.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 30px -10px rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewingPathId(path.id)}
                className={`group relative p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] bg-[#181818] border transition-all cursor-pointer overflow-hidden shadow-xl shadow-black/20 ${isActive ? `border-white/30` : 'border-white/5 hover:border-white/20'}`}
              >
                <div className="flex flex-col h-full justify-between gap-6 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${color.bg} text-black flex items-center justify-center shadow-lg ${color.shadow}`}>
                      {isCompleted ? <Trophy size={24} className="md:w-8 md:h-8" /> : <span className="text-xl md:text-2xl font-black">{index + 1}</span>}
                    </div>
                    {isActive && (
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${color.bg} text-black`}>
                        المسار الحالي
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2 group-hover:text-white transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed">
                      {path.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500 uppercase tracking-widest">التقدم</span>
                      <span className={color.text}>{totalLessonsInPath > 0 ? Math.round((currentStepIndex / totalLessonsInPath) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${totalLessonsInPath > 0 ? (currentStepIndex / totalLessonsInPath) * 100 : 0}%` }}
                        className={`h-full ${color.bg}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  }

  // Path Detail View
  const allLessons = Array.isArray(selectedPath?.units) ? selectedPath.units.flatMap(u => Array.isArray(u?.lessons) ? u.lessons : []) : [];
  const currentStepIndex = selectedPath ? (pathProgress[selectedPath.id] || 0) : 0;
  const isPathCompleted = allLessons.length > 0 && currentStepIndex === allLessons.length;
  const isActive = selectedPath ? (activePathId === selectedPath.id) : false;
  let globalLessonIndex = 0;

  // Calculate certificates for this path specifically
  const currentPathCertificatesCount = (() => {
    if (!selectedPath || !Array.isArray(selectedPath.units)) return 0;
    let count = 0;
    let accumulated = 0;
    for (const unit of selectedPath.units) {
      accumulated += Array.isArray(unit?.lessons) ? unit.lessons.length : 0;
      if (currentStepIndex >= accumulated) count++;
    }
    if (isPathCompleted) count++;
    return count;
  })();

  const cleanTitle = (title: string) => {
    // Remove "الوحدة الأولى:" or "الوحدة 1:" or just "الوحدة:" prefixes
    return title.replace(/^الوحدة\s+[\u0621-\u064A0-9]+\s*:\s*/, '').replace(/^الوحدة\s*:\s*/, '').trim();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Detail Header */}
      <div className="bg-[#181818] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl shadow-black/50 mb-6 md:mb-8">
        
        <div className="flex flex-col gap-6 md:gap-8 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl ${selectedPathColor?.bg} flex items-center justify-center text-black shadow-lg ${selectedPathColor?.shadow}`}>
                <Compass size={28} className="md:w-8 md:h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">{selectedPath.title}</h2>
                  {isPathCompleted && <Trophy className="text-yellow-500 md:w-6 md:h-6" size={20} />}
                </div>
                <p className="text-gray-400 text-xs sm:text-sm font-medium line-clamp-2">{selectedPath.description}</p>
              </div>
            </div>

            <div className="flex items-center bg-black/20 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 backdrop-blur-sm w-full lg:w-[503px]">
              <div className="flex-1 text-center space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black text-white">{Math.round((currentStepIndex / allLessons.length) * 100) || 0}%</span>
                </div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">التقدم</p>
              </div>
              
              <div className="h-10 md:h-12 w-px bg-white/10" />
              
              <div className="flex-1 text-center space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black ${selectedPathColor?.text}`}>{currentStepIndex}</span>
                  <span className="text-gray-600 text-sm sm:text-base font-bold">/{allLessons.length}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">الدروس</p>
              </div>
              
              <div className="h-10 md:h-12 w-px bg-white/10" />
              
              <div className="flex-1 text-center space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black ${selectedPathColor?.text}`}>{selectedPath.units.length}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">الوحدات</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 sm:mr-auto w-full sm:w-auto">
            {!isActive && !isPathCompleted && (
              <Button 
                onClick={() => {
                  onSelectPath(selectedPath.id);
                  onClose();
                }}
                variant="primary"
                size="xl"
                className={`w-full sm:w-auto ${selectedPathColor?.bg} text-black font-black px-6 md:px-10 py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:translate-y-1 shadow-[0_6px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.3)] border-b-4 border-black/20`}
              >
                <Rocket size={24} className="animate-bounce" />
                <span className="text-lg md:text-xl">ابدأ هذا المسار</span>
              </Button>
            )}
            {isActive && !isPathCompleted && (
              <Button 
                onClick={onClose}
                variant="primary"
                size="xl"
                className={`w-full sm:w-auto ${selectedPathColor?.bg} text-black font-black px-6 md:px-10 py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:translate-y-1 shadow-[0_6px_0_0_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_0_rgba(0,0,0,0.3)] border-b-4 border-black/20`}
              >
                <Play size={24} fill="currentColor" />
                <span className="text-lg md:text-xl">متابعة التعلم</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-4 md:space-y-6">
        {(Array.isArray(selectedPath?.units) ? selectedPath.units : []).map((unit, index) => {
          const unitIndex = index + 1;
          const unitOrdinal = ['', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة', 'السابعة', 'الثامنة', 'التاسعة', 'العاشرة', 'الحادية عشرة', 'الثانية عشرة'][unitIndex] || unitIndex;
          const lessonsCount = Array.isArray(unit?.lessons) ? unit.lessons.length : 0;
          const unitStartIndex = globalLessonIndex;
          const unitEndIndex = globalLessonIndex + lessonsCount;
          const isUnitCompleted = currentStepIndex >= unitEndIndex;
          const isUnitLocked = false; // Always unlocked as requested
          const isUnitCurrent = currentStepIndex >= unitStartIndex && currentStepIndex < unitEndIndex;
          const isExpanded = expandedUnitId === unit.id;

          const currentUnitStartIndex = globalLessonIndex;
          globalLessonIndex += lessonsCount;

          return (
            <div key={unit.id} className="flex flex-col" ref={isUnitCurrent ? currentUnitRef : null}>
              <motion.div
                onClick={() => toggleUnit(unit.id)}
                className={`relative p-4 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all duration-300 ${
                  isUnitCurrent
                    ? `bg-[#1a1a1a] border-white/20 shadow-xl shadow-black/40 cursor-pointer`
                    : 'bg-[#181818] border-white/5 cursor-pointer hover:border-white/10 hover:bg-[#1c1c1c]'
                }`}
              >
                <div className="flex items-center justify-between gap-3 md:gap-4 relative z-10">
                  <div className="flex items-center gap-3 md:gap-5">
                    {/* Icon Container (Moved to right) */}
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                      isUnitCompleted ? 'bg-green-500 text-white' : 
                      isUnitCurrent ? `bg-white text-black shadow-lg shadow-white/10` : 
                      'bg-white/5 text-gray-600'
                    }`}>
                      {isUnitCompleted ? <Check size={24} className="md:w-7 md:h-7" /> : 
                       isUnitLocked ? <Lock size={20} className="md:w-6 md:h-6" /> : 
                       <Check size={24} className="md:w-7 md:h-7" />}
                    </div>
                    <div>
                      <h4 className="font-black text-base md:text-xl text-white">{cleanTitle(unit.title)}</h4>
                      <p className="text-xs md:text-sm mt-1 text-gray-500 font-medium">
                        الوحدة {unitOrdinal} • {lessonsCount} دروس • {isUnitCompleted ? 'مكتمل' : isUnitLocked ? 'مغلق' : 'قيد التقدم'}
                      </p>
                    </div>
                  </div>
                  {!isUnitLocked && (
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${isUnitCurrent ? 'bg-white/10 text-white' : 'text-gray-600'}`}>
                      {isExpanded ? <ChevronUp size={20} className="md:w-6 md:h-6" /> : <ChevronDown size={20} className="md:w-6 md:h-6" />}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 md:pt-8 pb-2 md:pb-4 pr-6 md:pr-8 relative">
                        <div className="absolute right-[35px] md:right-[51px] top-0 bottom-4 w-0.5 bg-white/5" />
                        <div className="space-y-3 md:space-y-4">
                          {(Array.isArray(unit?.lessons) ? unit.lessons : []).map((step, lessonIndex) => {
                            const stepIndex = currentUnitStartIndex + lessonIndex;
                            const isCompleted = stepIndex < currentStepIndex;
                            const isCurrent = stepIndex === currentStepIndex;
                            const isLocked = false; // Always unlocked as requested

                            return (
                              <div
                                key={step.id}
                                onClick={() => onStepClick({ ...step, pathId: selectedPath?.id })}
                                className={`group relative p-3 md:p-4 rounded-xl md:rounded-2xl transition-all mr-8 md:mr-12 border ${
                                  isCurrent
                                    ? `bg-white/5 ${selectedPathColor?.border} shadow-xl cursor-pointer`
                                    : 'bg-transparent border-transparent hover:bg-white/5 cursor-pointer'
                                }`}
                              >
                                <div className={`absolute -right-8 md:-right-12 top-1/2 w-8 md:w-12 h-0.5 ${isCompleted ? selectedPathColor?.bg : 'bg-white/5'}`} />
                                <div className={`absolute -right-[37px] md:-right-[53px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-[3px] border-[#121212] ${
                                  isCompleted ? selectedPathColor?.bg : isCurrent ? `${selectedPathColor?.bg}` : 'bg-[#222]'
                                }`} />
                                <div className="flex items-center justify-between gap-3 md:gap-4">
                                  <div className="flex items-center gap-3 md:gap-4">
                                    <div>
                                      <h5 className={`font-bold text-sm md:text-base ${isCurrent ? 'text-white' : isLocked ? 'text-gray-600' : 'text-gray-300'}`}>
                                        {step.title}
                                      </h5>
                                      {!isLocked && (
                                        <p className="text-[10px] md:text-[11px] mt-1 text-gray-500 line-clamp-1">
                                          {step.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <span className={`text-[10px] font-black ${isCurrent ? selectedPathColor?.text : 'text-gray-600'} px-2.5 py-1 rounded-lg bg-white/5`}>
                                    +{step.xp} XP
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
