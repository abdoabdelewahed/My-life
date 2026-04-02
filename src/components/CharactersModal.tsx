import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Telescope, Brain, Code, Terminal, Rocket, Crown, Lock, Star, BookOpen, Map, CheckCircle2, MessageSquare, Quote, Zap, Target, Award, Shield, Heart, Activity } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { USER_CHARACTERS } from '../constants';
import { Button } from './ui/Button';

interface CharactersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  xp: number;
  stats: {
    lessonsCompleted?: number;
    pathsCompleted?: number;
  };
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Brain,
  Target,
  Heart,
  Crown
};

export function CharactersModal({ isOpen, onClose, currentLevel, xp, stats }: CharactersModalProps) {
  const [selectedNoteChar, setSelectedNoteChar] = useState<typeof USER_CHARACTERS[0] | null>(null);

  if (!isOpen) return null;

  const lessonsCount = stats.lessonsCompleted || 0;
  const pathsCount = stats.pathsCompleted || 0;

  const currentChar = USER_CHARACTERS.find(c => c.level === Math.floor(currentLevel)) || USER_CHARACTERS[0];
  const nextChar = USER_CHARACTERS.find(c => c.level === currentChar.level + 1);
  const requirements = nextChar?.requirements;
  const Icon = iconMap[currentChar.icon] || Brain;

  // Calculate dynamic stats based on real application data
  const getDynamicStats = () => {
    // 1. Routine Progress (from improvement_routines)
    const savedRoutines = JSON.parse(localStorage.getItem('improvement_routines') || '[]');
    let totalTasks = 0;
    let completedTasks = 0;
    
    savedRoutines.forEach((r: any) => {
      r.categories.forEach((cat: any) => {
        cat.tasks.forEach((t: any) => {
          totalTasks++;
          if (t.completed) completedTasks++;
        });
      });
    });
    const routineScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 2. Continuity/Streak (from improvement_routine_history)
    const history = JSON.parse(localStorage.getItem('improvement_routine_history') || '{}');
    let maxStreak = 0;
    
    const calculateStreak = (dates: string[]) => {
      if (!dates || dates.length === 0) return 0;
      const sortedDates = dates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
      let streak = 0;
      let lastDate = new Date();
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

    Object.values(history).forEach((dates: any) => {
      const s = calculateStreak(dates);
      if (s > maxStreak) maxStreak = s;
    });
    const streakScore = Math.min(100, maxStreak * 10); // 10 days = 100%

    // 3. Learning (Lessons & Paths)
    const learningScore = Math.min(100, (lessonsCount * 4) + (pathsCount * 10));

    // 4. Awareness (Paths & Level)
    const awarenessScore = Math.min(100, (pathsCount * 15) + (currentLevel * 5));

    // 5. Growth (XP & Level)
    const growthScore = Math.min(100, (currentLevel * 10) + (xp / 500));

    return [
      { subject: 'الروتين', A: routineScore },
      { subject: 'الاستمرارية', A: streakScore },
      { subject: 'التعلم', A: learningScore },
      { subject: 'الوعي', A: awarenessScore },
      { subject: 'النمو', A: growthScore },
    ];
  };

  const radarData = getDynamicStats();

  const topStat = radarData.reduce((prev, current) => (prev.A > current.A) ? prev : current);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col overflow-y-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-[101] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={onClose} 
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/10 p-0"
          >
            <X size={20} />
          </Button>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">شخصيتك وتطورك</h2>
            <p className="text-[#b3b3b3] text-xs">مستواك الحالي وإحصائياتك المتقدمة</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Current Level Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative p-8 rounded-3xl border transition-all duration-500 flex flex-col bg-gradient-to-br from-emerald-500/20 to-transparent border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400 border border-emerald-500/30">
                <Icon size={40} />
              </div>
              <div className="text-left">
                <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 animate-glow-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <span className="text-lg md:text-xl font-black tracking-tighter text-emerald-400">
                    مستوى {currentChar.level}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-black mb-3 tracking-tight text-white">
              {currentChar.name}
            </h3>
            <p className="text-sm leading-relaxed font-medium mb-6 text-emerald-100/70">
              {currentChar.description}
            </p>
            
            <Button
              onClick={() => setSelectedNoteChar(currentChar)}
              variant="ghost"
              size="sm"
              fullWidth
              className="mt-2 mb-6 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
            >
              <MessageSquare size={16} />
              رسالة المستوى
            </Button>

            {requirements && (
              <div className="mt-auto pt-6 border-t border-emerald-500/20 space-y-4">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">متطلبات المستوى التالي</h4>
                  
                  <div className="space-y-2">
                    {/* XP Requirement */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-100/60">
                        <Star size={14} className="text-yellow-500" />
                        <span>نقاط الخبرة (XP)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{xp} / {requirements.xp}</span>
                        {xp >= requirements.xp && <CheckCircle2 size={14} className="text-emerald-500" />}
                      </div>
                    </div>

                    {/* Lessons Requirement */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-100/60">
                        <BookOpen size={14} className="text-blue-400" />
                        <span>الدروس المكتملة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{lessonsCount} / {requirements.lessons}</span>
                        {lessonsCount >= requirements.lessons && <CheckCircle2 size={14} className="text-emerald-500" />}
                      </div>
                    </div>

                    {/* Paths Requirement */}
                    {requirements.paths > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-emerald-100/60">
                          <Map size={14} className="text-purple-400" />
                          <span>المسارات المكتملة</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{pathsCount} / {requirements.paths}</span>
                          {pathsCount >= requirements.paths && <CheckCircle2 size={14} className="text-emerald-500" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <span>إجمالي التقدم</span>
                    <span>{Math.round((currentLevel % 1) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentLevel % 1) * 100}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Radar Chart & Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative p-8 rounded-3xl border transition-all duration-500 flex flex-col bg-gradient-to-bl from-emerald-500/10 to-transparent border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)] min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white tracking-tight">مؤشرات الوعي</h3>
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <Target size={20} />
              </div>
            </div>

            <div className="w-full h-[280px] relative" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                  <PolarGrid stroke="#10b981" strokeOpacity={0.2} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#a7f3d0', fontSize: 13, fontWeight: 'bold', fontFamily: 'system-ui' }} 
                  />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="#10b981"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Stats List with Descriptions */}
            <div className="mt-4 space-y-3">
              {radarData.map((stat, index) => {
                const descriptions: Record<string, string> = {
                  'الروتين': 'مدى التزامك بالمهام اليومية المحددة.',
                  'الاستمرارية': 'قوة الحفاظ على سلسلة الإنجاز دون انقطاع.',
                  'التعلم': 'التقدم في الدروس والمسارات التعليمية.',
                  'الوعي': 'عمق فهمك لذاتك من خلال المسارات المنجزة.',
                  'النمو': 'التطور العام في مستواك ونقاط الخبرة.',
                };
                return (
                  <div key={index} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">{stat.subject}</span>
                        <span className="text-sm font-black text-emerald-400">{stat.A}%</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        {descriptions[stat.subject] || ''}
                      </p>
                    </div>
                    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden shrink-0">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${stat.A}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top Strength Highlight */}
            <div className="mt-auto pt-6 w-full">
              <div className="bg-black/30 rounded-2xl p-4 border border-emerald-500/20 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">أبرز نقاط قوتك</p>
                  <p className="text-base font-bold text-white">
                    {topStat.subject} <span className="text-emerald-400 font-black">({Math.round(topStat.A)}%)</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Quick Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
              <Star className="text-yellow-500" size={20} />
            </div>
            <span className="text-3xl font-black text-white mb-1">{xp}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">إجمالي الخبرة</span>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
              <BookOpen className="text-blue-400" size={20} />
            </div>
            <span className="text-3xl font-black text-white mb-1">{lessonsCount}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">دروس مكتملة</span>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
              <Map className="text-purple-400" size={20} />
            </div>
            <span className="text-3xl font-black text-white mb-1">{pathsCount}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">مسارات منجزة</span>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
              <Award className="text-emerald-400" size={20} />
            </div>
            <span className="text-3xl font-black text-white mb-1">{Math.floor(currentLevel)}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">المستوى الحالي</span>
          </div>
        </motion.div>

      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {selectedNoteChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedNoteChar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#121212] border border-white/10 rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
              
              <Button 
                onClick={() => setSelectedNoteChar(null)}
                variant="ghost"
                size="sm"
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors p-0"
              >
                <X size={16} />
              </Button>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">رسالة {selectedNoteChar.name}</h3>
                  <p className="text-xs text-gray-400">نصيحة للمستوى {selectedNoteChar.level}</p>
                </div>
              </div>

              <div className="relative z-10 bg-white/5 rounded-2xl p-6 border border-white/5">
                <Quote size={24} className="text-emerald-500/30 absolute top-4 right-4" />
                <p className="text-gray-300 text-sm leading-relaxed font-medium relative z-10 mt-4">
                  {selectedNoteChar.level === 1 && "مرحباً بك في بداية رحلتك! الوعي هو الخطوة الأولى. لا تخف من مواجهة الحقيقة، فكل تغيير حقيقي يبدأ بلحظة صدق مع الذات."}
                  {selectedNoteChar.level === 2 && "أنت الآن تواجه مخاوفك بشجاعة. تذكر أن الألم الذي تشعر به هو جزء من عملية التشافي. لا تهرب، بل واجه بلطف ورحمة."}
                  {selectedNoteChar.level === 3 && "أنت تقوم بعمل عظيم في تفكيك المعتقدات القديمة. قد تشعر بالضياع أحياناً، وهذا طبيعي جداً عند التخلي عن النسخة القديمة منك."}
                  {selectedNoteChar.level === 4 && "الآن تبدأ في زراعة بذور جديدة. ركز على بناء عادات يومية تدعم صحتك النفسية، ولا تنسَ أهمية وضع حدود واضحة لحماية طاقتك."}
                  {selectedNoteChar.level === 5 && "لقد وصلت لمرحلة متقدمة من التصالح مع الذات. تقبلك لعيوبك ونقاط ضعفك هو مصدر قوتك الحقيقي. استمر في احتضان كل أجزائك."}
                  {selectedNoteChar.level === 6 && "أنت الآن تعيش بأصالة وسلام داخلي. نورك الداخلي يفيض لمن حولك. تذكر أن الرحلة مستمرة، استمتع بكل لحظة وكن مصدر إلهام للآخرين."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
