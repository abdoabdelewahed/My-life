import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Flame, Lightbulb, ChevronRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ProgressPageProps {
  routines: any[];
  onClose: () => void;
}

export const ProgressPage = ({ routines, onClose }: ProgressPageProps) => {
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);

  // Calculate overall streak (any task completed today)
  const anyTaskCompletedToday = routines.some(routine => 
    routine.categories.some((cat: any) => 
      cat.tasks.some((task: any) => task.completed)
    )
  );
  const overallStreak = anyTaskCompletedToday ? 1 : 0;

  const data = routines.map(routine => {
    let totalPoints = 0;
    let completedPoints = 0;
    
    routine.categories.forEach((cat: any) => {
      cat.tasks.forEach((task: any) => {
        totalPoints += task.points;
        if (task.completed) {
          completedPoints += task.points;
        }
      });
    });
    
    let simplifiedTitle = routine.title;
    if (routine.title === 'نفسيتي') simplifiedTitle = 'نفسيتي';
    else if (routine.title === 'إيماني') simplifiedTitle = 'إيماني';
    else if (routine.title === 'إنتاجيتي') simplifiedTitle = 'إنتاجيتي';
    else if (routine.title === 'بدني') simplifiedTitle = 'بدني';
    else if (routine.title === 'علاقاتي') simplifiedTitle = 'علاقاتي';

    // Calculate streak from history
    const history = JSON.parse(localStorage.getItem('improvement_routine_history') || '{}');
    const routineHistory = history[routine.id] || [];
    
    const calculateStreak = (dates: string[]) => {
      if (!dates || dates.length === 0) return 0;
      
      const sortedDates = dates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
      
      let streak = 0;
      let lastDate = new Date();
      
      // Check if last activity was today or yesterday
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (sortedDates[0].getTime() < yesterday.getTime()) return 0;

      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          streak = 1;
          lastDate = sortedDates[i];
        } else {
          const diff = lastDate.getTime() - sortedDates[i].getTime();
          if (diff <= 24 * 60 * 60 * 1000 * 2 && diff > 0) {
            streak++;
            lastDate = sortedDates[i];
          } else {
            break;
          }
        }
      }
      return streak;
    };

    return {
      ...routine,
      subject: simplifiedTitle,
      A: totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0,
      fullMark: 100,
      streak: calculateStreak(routineHistory)
    };
  });

  const overallProgress = Math.round(data.reduce((acc, curr) => acc + curr.A, 0) / data.length);
  const lowestRoutine = data.reduce((prev, curr) => (prev.A < curr.A ? prev : curr), data[0]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#121212] z-[130] p-6 overflow-y-auto text-white"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">مؤشرات التحسن والتقدم</h2>
        <button 
          onClick={onClose} 
          className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-purple-600 to-emerald-600 p-6 rounded-3xl mb-6 shadow-lg">
        <p className="text-white/80 text-sm mb-1">النتيجة الإجمالية</p>
        <h3 className="text-4xl font-black">{overallProgress}%</h3>
        <p className="text-white/90 mt-2 text-sm">سلسلة الإنجاز العامة: {overallStreak} يوم</p>
      </div>

      {/* Radar Chart */}
      <div className="h-[350px] w-full bg-white/5 rounded-3xl p-4 mb-6 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#fff', fontSize: 12, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Progress"
              dataKey="A"
              stroke="#10b981"
              strokeWidth={3}
              fill="#10b981"
              fillOpacity={0.5}
              onClick={(data) => setSelectedRoutine(data)}
              className="cursor-pointer"
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Routine Streaks */}
      <div className="space-y-3 mb-6">
        <h3 className="font-bold text-lg">أيام الاستمرار</h3>
        {data.map((item, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center">
            <span className="font-bold">{item.subject}</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-black text-xl">{item.streak}</span>
              <span className="text-white/50 text-sm">يوم</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tip of the Day */}
      <div className="bg-white/5 p-4 rounded-2xl flex items-start gap-3 mb-6 border border-white/5">
        <Lightbulb className="text-yellow-400 shrink-0" size={24} />
        <div>
          <p className="text-sm font-bold mb-1">نصيحة اليوم</p>
          <p className="text-xs text-white/70">يبدو أن جانب "{lowestRoutine.subject}" يحتاج لبعض الاهتمام. حاول التركيز عليه اليوم لتحسين توازنك العام.</p>
        </div>
      </div>

      {/* Drill-down Overlay */}
      <AnimatePresence>
        {selectedRoutine && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 bg-[#121212] z-[140] p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{selectedRoutine.title}</h2>
              <button onClick={() => setSelectedRoutine(null)} className="bg-white/10 p-2 rounded-full">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {selectedRoutine.categories.map((cat: any) => (
                <div key={cat.id} className="bg-white/5 p-4 rounded-2xl">
                  <h4 className="font-bold mb-2">{cat.title}</h4>
                  <div className="space-y-2">
                    {cat.tasks.map((task: any) => (
                      <div key={task.id} className="flex justify-between text-sm text-white/70">
                        <span>{task.title}</span>
                        <span className={task.completed ? 'text-emerald-400' : 'text-white/30'}>
                          {task.completed ? 'مكتمل' : 'لم يكتمل'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
