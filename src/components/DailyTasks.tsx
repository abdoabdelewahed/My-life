import React, { useState } from 'react';
import * as Lucide from 'lucide-react';
const { CheckCircle2, Circle, Brain, Lightbulb, TrendingUp, CheckSquare, Sparkles } = Lucide;
import { Task } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { playSuccess, playPop } from '../utils/sounds';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
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

export const DailyTasks = ({ tasks, onToggle }: Props) => {
  const [lastCompletedId, setLastCompletedId] = useState<string | null>(null);

  const handleToggle = (task: Task) => {
    if (!task.completed) {
      playSuccess();
      setLastCompletedId(task.id);
      setTimeout(() => setLastCompletedId(null), 1500);
    } else {
      playPop();
    }
    onToggle(task.id);
  };

  const categories = {
    mindset: { icon: <Brain size={16} />, label: 'العقلية', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    skill: { icon: <Lightbulb size={16} />, label: 'المهارة', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    action: { icon: <TrendingUp size={16} />, label: 'التنفيذ', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white flex items-center gap-2 md:gap-3">
          <CheckSquare className="text-[#1DB954] w-6 h-6 md:w-8 md:h-8" />
          مهام اليوم للثراء
        </h2>
      </div>
      
      <p className="text-gray-200 text-sm md:text-base leading-relaxed font-medium">
        النجاح ليس قفزة واحدة، بل هو تراكم لعادات يومية صغيرة. أنجز هذه المهام لتقترب خطوة نحو هدفك.
      </p>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-2 md:gap-3"
      >
        {tasks.map((task) => (
          <motion.div
            variants={item}
            whileHover={{ scale: 1.01, backgroundColor: '#282828' }}
            whileTap={{ scale: 0.98 }}
            key={task.id}
            onClick={() => handleToggle(task)}
            className={`relative p-4 md:p-5 rounded-xl md:rounded-2xl cursor-pointer transition-all flex items-center gap-3 md:gap-5 group ${
              task.completed 
                ? 'bg-[#181818] border border-white/5 opacity-60' 
                : 'bg-[#181818] border border-white/5 hover:border-white/10 shadow-lg shadow-black/20'
            }`}
          >
            {/* Gamification XP Popup */}
            <AnimatePresence>
              {lastCompletedId === task.id && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -40, scale: 1.2 }}
                  exit={{ opacity: 0, y: -60, scale: 1 }}
                  className="absolute -top-4 right-10 z-50 flex items-center gap-1 text-[#1DB954] font-black text-base md:text-lg drop-shadow-lg"
                >
                  <Sparkles size={14} className="md:w-4 md:h-4" /> +50 XP
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1">
              <p className={`font-bold text-base md:text-lg mb-1.5 md:mb-2 transition-colors tracking-tight ${task.completed ? 'line-through text-[#8e8e93]' : 'text-white'}`}>
                {task.title}
              </p>
              <div className="flex gap-2">
                <span className={`text-[10px] md:text-[11px] font-bold px-2.5 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1 md:gap-1.5 border ${categories[task.category].color}`}>
                  {React.cloneElement(categories[task.category].icon as React.ReactElement, { className: "w-3 h-3 md:w-4 md:h-4" })}
                  {categories[task.category].label}
                </span>
              </div>
            </div>
            <motion.div 
              initial={false}
              animate={{ 
                scale: task.completed ? [1, 1.3, 1] : 1,
                rotate: task.completed ? [0, 15, 0] : 0
              }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={task.completed ? 'text-[#1DB954]' : 'text-gray-300 group-hover:text-white transition-colors'}
            >
              {task.completed ? <CheckCircle2 size={24} className="md:w-8 md:h-8 fill-[#1DB954]/20" /> : <Circle size={24} className="md:w-8 md:h-8" />}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
