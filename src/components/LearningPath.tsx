import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Star, Brain, MessageSquare, Layout, Code, Rocket, Target, Play, Sparkles, User, Zap, Trophy, Book, Globe, Network, BrainCircuit, Database, Cloud, GitBranch, Shield, FileText, RefreshCw, Users, PenTool, CheckSquare, FileCode, Terminal, Box, Layers, Server, Activity, Link, BarChart, ListChecks, Kanban, AlertCircle, Compass } from 'lucide-react';

import { Button } from './ui/Button';

interface LearningPathProps {
  activePathId: string;
  pathProgress: Record<string, number>;
  onStepClick: (step: any) => void;
  onShowFullRoadmap: () => void;
  onViewCertificate: (title: string, type: 'unit' | 'path') => void;
}

import { LEARNING_PATHS, PATH_COLORS } from '../constants';

const getIcon = (iconName: string, size: number) => {
  const renderIcon = () => {
    switch (iconName) {
      case 'Brain': return <Brain size={size} />;
      case 'MessageSquare': return <MessageSquare size={size} />;
      case 'Layout': return <Layout size={size} />;
      case 'Code': return <Code size={size} />;
      case 'Rocket': return <Rocket size={size} />;
      case 'Target': return <Target size={size} />;
      case 'Play': return <Play size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'User': return <User size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'Book': return <Book size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'Network': return <Network size={size} />;
      case 'BrainCircuit': return <BrainCircuit size={size} />;
      case 'Database': return <Database size={size} />;
      case 'Cloud': return <Cloud size={size} />;
      case 'GitBranch': return <GitBranch size={size} />;
      case 'Shield': return <Shield size={size} />;
      case 'FileText': return <FileText size={size} />;
      case 'RefreshCw': return <RefreshCw size={size} />;
      case 'Users': return <Users size={size} />;
      case 'PenTool': return <PenTool size={size} />;
      case 'CheckSquare': return <CheckSquare size={size} />;
      case 'FileCode': return <FileCode size={size} />;
      case 'Terminal': return <Terminal size={size} />;
      case 'Box': return <Box size={size} />;
      case 'Layers': return <Layers size={size} />;
      case 'Server': return <Server size={size} />;
      case 'Activity': return <Activity size={size} />;
      case 'Link': return <Link size={size} />;
      case 'BarChart': return <BarChart size={size} />;
      case 'ListChecks': return <ListChecks size={size} />;
      case 'Kanban': return <Kanban size={size} />;
      case 'AlertCircle': return <AlertCircle size={size} />;
      default: return <Star size={size} />;
    }
  };

  return (
    <motion.div
      animate={{
        y: [0, -2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {renderIcon()}
    </motion.div>
  );
};

export const LearningPath: React.FC<LearningPathProps> = ({ 
  activePathId, 
  pathProgress, 
  onStepClick, 
  onShowFullRoadmap,
  onViewCertificate 
}) => {
  const activeNodeRef = useRef<HTMLDivElement>(null);

  const currentPathIndex = LEARNING_PATHS.findIndex(p => p.id === activePathId);
  const currentPath = LEARNING_PATHS[currentPathIndex !== -1 ? currentPathIndex : 0];
  const color = PATH_COLORS[currentPathIndex !== -1 ? currentPathIndex % PATH_COLORS.length : 0];
  const currentPathProg = pathProgress[currentPath.id] || 0;

  // Find the active unit based on progress
  let activeUnit = currentPath.units[0];
  let lessonsBeforeActiveUnit = 0;
  let accumulatedLessons = 0;
  
  const totalLessons = currentPath.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  
  for (const unit of currentPath.units) {
    if (currentPathProg < accumulatedLessons + unit.lessons.length) {
      activeUnit = unit;
      lessonsBeforeActiveUnit = accumulatedLessons;
      break;
    }
    accumulatedLessons += unit.lessons.length;
  }

  // If all units are completed, show the last unit
  if (currentPathProg >= totalLessons && currentPath.units.length > 0) {
    activeUnit = currentPath.units[currentPath.units.length - 1];
    lessonsBeforeActiveUnit = totalLessons - activeUnit.lessons.length;
  } else if (currentPathProg === accumulatedLessons && currentPathProg > 0 && currentPathProg < totalLessons) {
    const nextUnitIndex = currentPath.units.findIndex(u => u.id === activeUnit.id) + 1;
    if (nextUnitIndex < currentPath.units.length) {
      activeUnit = currentPath.units[nextUnitIndex];
      lessonsBeforeActiveUnit = accumulatedLessons;
    }
  }

  const unitProg = Math.min(Math.max(currentPathProg - lessonsBeforeActiveUnit, 0), activeUnit.lessons.length);
  const unitIndex = currentPath.units.findIndex(u => u.id === activeUnit.id) + 1;
  const steps = activeUnit.lessons;

  useEffect(() => {
    if (activeNodeRef.current) {
      setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [unitProg]);

  return (
    <div className="w-full space-y-6 md:space-y-8 py-2 md:py-4">
      {/* Unit Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] ${color.text} mb-1`}>
              الوحدة {unitIndex} من {currentPath.units.length}
            </span>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight">
              {activeUnit.title}
            </h2>
          </div>
          <Button
            onClick={onShowFullRoadmap}
            variant="ghost"
            size="sm"
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 group transition-all"
          >
            <Compass size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">استكشف</span>
          </Button>
        </div>
        
        {/* Unit Progress Bar */}
        <div className="w-full h-2 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden border border-gray-200 dark:border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(unitProg / activeUnit.lessons.length) * 100}%` }}
            className={`h-full ${color.bg} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
          />
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {(Array.isArray(steps) ? steps : []).map((step, index) => {
          const isCompleted = index < unitProg;
          const isActive = index === unitProg;
          const isLocked = false;
          
          return (
            <motion.div
              key={step.id}
              ref={isActive ? activeNodeRef : null}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                onClick={() => onStepClick({ ...step, pathId: activePathId })}
                variant="ghost"
                className={`w-full relative overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-5 flex items-center gap-4 md:gap-6 border transition-all duration-300 h-auto ${
                  isActive 
                    ? `border-gray-200 dark:border-white/20 shadow-2xl ${color.shadow} scale-[1.02] z-10 bg-gray-50 dark:bg-[#282828]` 
                    : isCompleted 
                      ? 'bg-gray-100/50 dark:bg-[#282828]/40 border-gray-200 dark:border-white/5 opacity-80' 
                      : 'bg-gray-50 dark:bg-[#181818] border-gray-200 dark:border-white/5'
                } cursor-pointer hover:bg-gray-100 dark:hover:bg-[#282828] group`}
              >
                {/* Icon Container */}
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${
                  isActive ? `${color.bg} text-black border-transparent` : 
                  isCompleted ? `${color.lightBg} ${color.text} border-gray-200 dark:border-white/10` : 
                  'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-white/20 border-gray-200 dark:border-white/5'
                }`}>
                  {getIcon(step.icon, 24)}
                </div>

                {/* Content */}
                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold text-base md:text-lg ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                      {step.title}
                    </h4>
                    {isCompleted && (
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40">
                          مكتمل
                        </span>
                    )}
                  </div>
                  <p className={`text-xs md:text-sm ${isActive ? 'text-gray-600 dark:text-white/70' : 'text-gray-500 dark:text-gray-400'} font-normal line-clamp-1`}>
                    {step.description || 'تعلم مهارات جديدة في هذا الدرس'}
                  </p>
                </div>

                {/* Action Icon */}
                {!isCompleted && (
                  <div className={`${isActive ? color.text : 'text-gray-300 dark:text-white/20'} transition-colors`}>
                    <Play size={20} className={isActive ? 'animate-pulse' : ''} />
                  </div>
                )}
              </Button>
            </motion.div>
          );
        })}

        {/* Certificate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (Array.isArray(steps) ? steps.length : 0) * 0.05 }}
        >
          <Button
            disabled={unitProg < (Array.isArray(steps) ? steps.length : 0)}
            onClick={() => onViewCertificate(activeUnit.title, 'unit')}
            variant="ghost"
            className={`w-full relative overflow-hidden rounded-xl md:rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6 border transition-all duration-300 h-auto ${
              unitProg >= (Array.isArray(steps) ? steps.length : 0)
                ? `border-purple-500/30 shadow-2xl shadow-purple-500/10 scale-[1.02] bg-white dark:bg-[#282828] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#333]`
                : 'bg-gray-100 dark:bg-[#181818] border-gray-200 dark:border-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 border ${
              unitProg >= (Array.isArray(steps) ? steps.length : 0)
                ? 'bg-purple-500 text-white border-transparent shadow-[0_0_30_rgba(168,85,247,0.4)]'
                : 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-white/20 border-gray-200 dark:border-white/5'
            }`}>
              <Trophy size={32} className="md:w-10 md:h-10" />
            </div>
            <div className="flex-1 text-center">
              <h4 className={`font-bold text-xl md:text-2xl ${unitProg >= (Array.isArray(steps) ? steps.length : 0) ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-[#b3b3b3]'}`}>
                شهادة إتمام الوحدة
              </h4>
              <p className="text-sm md:text-base text-gray-500 dark:text-[#b3b3b3]/50 mt-2">
                احصل على شهادتك بعد إكمال جميع الدروس
              </p>
            </div>
            {unitProg < (Array.isArray(steps) ? steps.length : 0) && <Lock size={20} className="text-gray-300 dark:text-white/20 md:w-6 md:h-6" />}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
