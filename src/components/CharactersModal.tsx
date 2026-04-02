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
  ownedCharacters: string[];
  activeCharacterId: string;
  onPurchase: (id: string, price: number) => boolean;
  onEquip: (id: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Brain,
  Target,
  Heart,
  Crown,
  Star,
  Award
};

export function CharactersModal({ 
  isOpen, 
  onClose, 
  currentLevel, 
  xp, 
  stats,
  ownedCharacters,
  activeCharacterId,
  onPurchase,
  onEquip
}: CharactersModalProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'shop'>('status');
  const [selectedNoteChar, setSelectedNoteChar] = useState<typeof USER_CHARACTERS[0] | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const lessonsCount = stats.lessonsCompleted || 0;
  const pathsCount = stats.pathsCompleted || 0;

  const currentChar = USER_CHARACTERS.find(c => c.id === activeCharacterId) || USER_CHARACTERS[0];
  const nextProgressionChar = USER_CHARACTERS.filter(c => c.level > 0).find(c => c.level === Math.floor(currentLevel) + 1);
  const requirements = nextProgressionChar?.requirements;
  const Icon = iconMap[currentChar.icon] || Brain;

  // Generate dynamic stats based on user progress
  const radarData = [
    { subject: 'الوعي الذاتي', A: Math.round(Math.min(100, 30 + (currentLevel * 12) + (pathsCount * 5))) },
    { subject: 'التنظيم العاطفي', A: Math.round(Math.min(100, 20 + (lessonsCount * 3))) },
    { subject: 'المرونة النفسية', A: Math.round(Math.min(100, 30 + (pathsCount * 15))) },
    { subject: 'الاستمرارية', A: Math.round(Math.min(100, 35 + (lessonsCount * 2))) },
    { subject: 'التعاطف', A: Math.round(Math.min(100, 45 + (currentLevel * 8))) },
  ];

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

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'status' 
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            الحالة
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'shop' 
                ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            المتجر
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'status' ? (
            <motion.div
              key="status"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
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
                          {currentChar.level > 0 ? `مستوى ${currentChar.level}` : 'شخصية خاصة'}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="shop"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-white tracking-tight">متجر الشخصيات</h3>
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded-xl">
                  <Star size={18} className="text-yellow-500" />
                  <span className="text-lg font-black text-white">{xp} XP</span>
                </div>
              </div>

              {purchaseError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm font-bold text-center"
                >
                  {purchaseError}
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {USER_CHARACTERS.map((char) => {
                  const isOwned = ownedCharacters.includes(char.id);
                  const isActive = activeCharacterId === char.id;
                  const isLocked = char.level > Math.floor(currentLevel) && char.level > 0;
                  const canAfford = xp >= (char.price || 0);
                  const Icon = iconMap[char.icon] || Brain;

                  return (
                    <motion.div
                      key={char.id}
                      whileHover={{ y: -5 }}
                      className={`relative p-6 rounded-3xl border transition-all duration-300 flex flex-col h-full ${
                        isActive 
                          ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                          : isOwned 
                            ? 'bg-white/5 border-white/10 hover:border-white/20' 
                            : isLocked
                              ? 'bg-black/40 border-white/5 opacity-60 grayscale'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                          isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'
                        }`}>
                          <Icon size={28} />
                        </div>
                        {isActive && (
                          <div className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest">
                            مفعل
                          </div>
                        )}
                        {!isOwned && char.price && (
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                            canAfford ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 'bg-red-500/10 border-red-500/30 text-red-400'
                          }`}>
                            <Star size={12} />
                            <span className="text-xs font-black">{char.price}</span>
                          </div>
                        )}
                      </div>

                      <h4 className="text-xl font-black text-white mb-2">{char.name}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-grow">
                        {char.description}
                      </p>

                      <div className="mt-auto">
                        {isActive ? (
                          <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black text-center">
                            الشخصية الحالية
                          </div>
                        ) : isOwned ? (
                          <Button
                            onClick={() => onEquip(char.id)}
                            variant="primary"
                            size="sm"
                            fullWidth
                            className="bg-white text-black hover:bg-gray-200 font-black rounded-xl"
                          >
                            اختيار الشخصية
                          </Button>
                        ) : isLocked ? (
                          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-xs font-black">
                            <Lock size={14} />
                            مستوى {char.level} مطلوب
                          </div>
                        ) : char.price ? (
                          <Button
                            onClick={() => {
                              const success = onPurchase(char.id, char.price!);
                              if (!success) {
                                setPurchaseError('عذراً، ليس لديك نقاط خبرة كافية لشراء هذه الشخصية.');
                                setTimeout(() => setPurchaseError(null), 3000);
                              }
                            }}
                            variant="primary"
                            size="sm"
                            fullWidth
                            className="bg-yellow-500 hover:bg-yellow-600 text-black font-black rounded-xl border-none"
                          >
                            شراء الشخصية
                          </Button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-xs font-black">
                            <Lock size={14} />
                            غير متوفر
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unified Dashboard Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity size={20} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">لوحة التحكم الموحدة</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Abilities Summary */}
            <div className="bg-[#181818] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 group-hover:bg-blue-500/10 transition-colors" />
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="text-blue-400" size={18} />
                  القدرات
                </h4>
                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                  {Object.keys(JSON.parse(localStorage.getItem('abilitiesResults') || '{}')).length} مقاييس
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                تتبع تطور مهاراتك وقدراتك عبر الزمن من خلال المقاييس النفسية والعملية.
              </p>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[60%]" />
              </div>
            </div>

            {/* Routine Summary */}
            <div className="bg-[#181818] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="text-emerald-400" size={18} />
                  الروتين
                </h4>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                  {JSON.parse(localStorage.getItem('myRoutine') || '[]').reduce((acc: number, area: any) => acc + area.groups.reduce((gAcc: number, g: any) => gAcc + g.tasks.filter((t: any) => t.completed).length, 0), 0)} مهام منجزة
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                التزامك اليومي بالمهام المحددة يبني أساساً قوياً للنجاح المستمر.
              </p>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[45%]" />
              </div>
            </div>

            {/* Habits Summary */}
            <div className="bg-[#181818] p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group hover:border-purple-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/10 transition-colors" />
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="text-purple-400" size={18} />
                  العادات
                </h4>
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
                  مؤشر القوة 70%
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                تحليل وتطوير عاداتك اليومية لضمان توافقها مع أهدافك الكبرى.
              </p>
              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full w-[70%]" />
              </div>
            </div>
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
