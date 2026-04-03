import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Flame, Lightbulb, ChevronRight, Check } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ProgressPageProps {
  routines: any[];
  onClose: () => void;
}

export const ProgressPage = ({ routines, onClose }: ProgressPageProps) => {
  const [selectedRoutine, setSelectedRoutine] = useState<any>(null);

  const getRoutineStatus = (progress: number) => {
    if (progress >= 90) return { label: 'ملتزم جداً', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (progress >= 70) return { label: 'أداء رائع', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (progress >= 50) return { label: 'تقدم جيد', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (progress >= 30) return { label: 'بداية جيدة', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { label: 'يحتاج تركيز', color: 'text-rose-400', bg: 'bg-rose-500/20' };
  };

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

    const progress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

    return {
      ...routine,
      subject: simplifiedTitle,
      A: progress,
      fullMark: 100,
      streak: calculateStreak(routineHistory),
      status: getRoutineStatus(progress)
    };
  });

  const overallProgress = Math.round(data.reduce((acc, curr) => acc + curr.A, 0) / data.length);
  const lowestRoutine = data.reduce((prev, curr) => (prev.A < curr.A ? prev : curr), data[0]);

  const prayerStats = JSON.parse(localStorage.getItem('prayer_stats') || '{"total":0, "monthly":0, "fajr":0, "dhuhr":0, "asr":0, "maghrib":0, "isha":0, "azkar_morning":0, "azkar_evening":0}');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0a0a0a] z-[130] overflow-y-auto text-white"
    >
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500">
            <Award size={20} />
          </div>
          <h2 className="text-xl font-black">مؤشرات التقدم</h2>
        </div>
        <button 
          onClick={onClose} 
          className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-8 max-w-2xl mx-auto pb-32">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
          
          <div className="relative space-y-2">
            <h2 className="text-4xl font-black tracking-tighter">رحلة الإنجاز</h2>
            <p className="text-gray-500 font-bold text-sm">تتبع نموك وتطورك اليومي بكل دقة</p>
          </div>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-5 rounded-[2.5rem] border border-emerald-500/20">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 mb-3">
              <Award size={20} />
            </div>
            <div className="text-2xl font-black text-white">{data.reduce((acc, curr) => acc + curr.streak, 0)}</div>
            <div className="text-[10px] text-emerald-500/60 font-black uppercase tracking-wider">إجمالي الأيام</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-5 rounded-[2.5rem] border border-blue-500/20">
            <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 mb-3">
              <Flame size={20} />
            </div>
            <div className="text-2xl font-black text-white">
              {overallProgress}%
            </div>
            <div className="text-[10px] text-blue-500/60 font-black uppercase tracking-wider">متوسط الإنجاز</div>
          </div>
        </div>

        {/* Radar Chart Section */}
        <div className="bg-[#181818] p-6 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <h3 className="text-xl font-black mb-6 relative z-10 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            توازن المهارات
          </h3>
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                <Radar
                  name="التقدم"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black">تفاصيل المسارات</h3>
            <span className="text-xs font-bold text-gray-500">اضغط للتفاصيل</span>
          </div>
          {data.map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.01, backgroundColor: '#1f1f1f' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRoutine(item)}
              className="bg-[#181818] p-5 rounded-[2.5rem] border border-white/5 shadow-xl flex items-center justify-between cursor-pointer group transition-all duration-300"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-emerald-500 rounded-full group-hover:h-10 transition-all duration-300" />
                    <div>
                      <h4 className="text-lg font-black group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${item.status.color} bg-white/5`}>
                        {item.status.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-400 leading-none">{item.streak}</div>
                      <div className="text-[8px] text-gray-500 font-black uppercase tracking-tighter">يوم استمرار</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold px-1">
                    <span className="text-gray-500">مستوى الإنجاز</span>
                    <span className="text-emerald-400">{item.A}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.A}%` }}
                      className={`h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tip of the Day */}
        <div className="bg-amber-500/10 p-6 rounded-[2rem] border border-amber-500/20 flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
            <Lightbulb size={24} />
          </div>
          <div>
            <p className="text-sm font-black text-amber-500 mb-1">توصية ذكية</p>
            <p className="text-sm text-gray-300 font-bold leading-relaxed">
              يبدو أن جانب "{lowestRoutine.subject}" يحتاج لبعض الاهتمام. حاول التركيز عليه اليوم لتحسين توازنك العام وزيادة إنتاجيتك.
            </p>
          </div>
        </div>
      </div>

      {/* Drill-down Overlay */}
      <AnimatePresence>
        {selectedRoutine && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-[#0a0a0a] z-[140] overflow-y-auto"
          >
            <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedRoutine(null)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <ChevronRight size={18} />
                </button>
                <h2 className="text-xl font-black">{selectedRoutine.title}</h2>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-xs font-black ${selectedRoutine.status.bg} ${selectedRoutine.status.color}`}>
                {selectedRoutine.status.label}
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Stats Grid for Faith */}
              {selectedRoutine.id === 'faith' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#181818] p-6 rounded-[2rem] border border-white/5">
                    <p className="text-gray-500 text-xs font-black mb-1">إجمالي الصلوات</p>
                    <h4 className="text-3xl font-black text-emerald-400">{prayerStats.total}</h4>
                  </div>
                  <div className="bg-[#181818] p-6 rounded-[2rem] border border-white/5">
                    <p className="text-gray-500 text-xs font-black mb-1">صلوات هذا الشهر</p>
                    <h4 className="text-3xl font-black text-blue-400">{prayerStats.monthly}</h4>
                  </div>
                  <div className="bg-[#181818] p-6 rounded-[2rem] border border-white/5">
                    <p className="text-gray-500 text-xs font-black mb-1">أذكار الصباح</p>
                    <h4 className="text-3xl font-black text-yellow-400">{prayerStats.azkar_morning}</h4>
                  </div>
                  <div className="bg-[#181818] p-6 rounded-[2rem] border border-white/5">
                    <p className="text-gray-500 text-xs font-black mb-1">أذكار المساء</p>
                    <h4 className="text-3xl font-black text-orange-400">{prayerStats.azkar_evening}</h4>
                  </div>
                </div>
              )}

              {/* Individual Prayer Breakdown */}
              {selectedRoutine.id === 'faith' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-black px-2">تفصيل الصلوات</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: 'الفجر', count: prayerStats.fajr, color: 'text-indigo-400' },
                      { label: 'الظهر', count: prayerStats.dhuhr, color: 'text-blue-400' },
                      { label: 'العصر', count: prayerStats.asr, color: 'text-emerald-400' },
                      { label: 'المغرب', count: prayerStats.maghrib, color: 'text-orange-400' },
                      { label: 'العشاء', count: prayerStats.isha, color: 'text-purple-400' },
                    ].map((p, i) => (
                      <div key={i} className="bg-[#181818] p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                        <span className="font-black">{p.label}</span>
                        <span className={`text-xl font-black ${p.color}`}>{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General Progress Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-black px-2">المهام الحالية</h3>
                <div className="space-y-3">
                  {selectedRoutine.categories.map((cat: any) => (
                    <div key={cat.id} className="bg-[#181818] p-6 rounded-[2rem] border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-black">{cat.title}</h4>
                        <span className="text-xs font-black text-gray-500">{cat.current}/{cat.target} {cat.unit}</span>
                      </div>
                      <div className="space-y-3">
                        {cat.tasks.map((task: any) => (
                          <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <span className="text-sm font-bold text-gray-300">{task.title}</span>
                            {task.completed ? (
                              <div className="w-6 h-6 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                                <Check size={14} />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-white/5 rounded-full" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
