import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
const { X, CheckCircle2, ArrowRight, ArrowLeft, Brain, Volume2, VolumeX, Loader2 } = Lucide;
import confetti from 'canvas-confetti';
import { playPop, playLevelUp } from '../utils/sounds';
import { getOrGenerateAudio } from '../services/audioCache';
import { playBase64Audio } from '../utils/audio';
import { Button } from './ui/Button';
import { useAudioAvailability } from '../hooks/useAudioAvailability';

interface AssessmentFlowProps {
  assessment: any;
  onClose: () => void;
  onComplete: (results: any) => void;
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ assessment, onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<'intro' | 'assessment' | 'celebration'>('intro');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const questions = Array.isArray(assessment?.questions) ? assessment.questions : [];
  const question = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Auto-play when question changes
  const handleAnswer = (questionId: string, value: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    playPop();
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setStage('celebration');
      setIsTransitioning(false);
      playLevelUp();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      });
    }
  };

  const handleSpeak = async (text: string) => {
    // Audio playback disabled per user request
  };

  const handleFinish = () => {
    onComplete(answers);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col overflow-hidden"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-atmospheric opacity-40" />
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-${assessment.color}-500/10 to-transparent opacity-30`} />
      </div>

      {stage === 'intro' && (
        <div className="relative z-10 w-full h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl w-full mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center bg-indigo-500/10 text-indigo-500 mb-8">
                {(() => {
                  const IconComponent = (Lucide as any)[assessment.iconName] || Brain;
                  return <IconComponent className="w-12 h-12" />;
                })()}
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                {assessment.title}
              </h2>
              
              <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed mb-8">
                {assessment.description || `اكتشف قدراتك في ${assessment.title} وتعرف على نقاط قوتك ومجالات التحسين.`}
              </p>

              <div className="mb-6 text-right">
                <h3 className="text-lg font-black text-white mb-4">ماذا يختبر هذا التقييم؟</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  هذا الاختبار مصمم لقياس مجموعة محددة من القدرات والسمات الشخصية التي تؤثر بشكل مباشر على جودة حياتك وأدائك، وهي:
                </p>
                <div className="space-y-4">
                  {assessment.subCategoriesDef?.map((cat: any, i: number) => (
                    <div key={i} className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl p-5 flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-white text-sm mb-1">{cat.name}</h5>
                        <p className="text-gray-400 text-xs leading-relaxed">{cat.description}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-400 text-sm">يختبر هذا التقييم مجموعة متنوعة من المهارات الأساسية المتعلقة بـ {assessment.title}.</p>
                  )}
                </div>
              </div>

              <div className="bg-white/5 dark:bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-right">
                <h3 className="text-lg font-black text-white mb-4">مميزات الاختبار</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: Lucide.Target, title: "تحليل دقيق", desc: "نتائج مبنية على إجاباتك الشخصية." },
                    { icon: Lucide.Zap, title: "تطوير مستمر", desc: "خطوات عملية لتحسين أدائك." },
                    { icon: Lucide.BarChart2, title: "قياس التقدم", desc: "تابع تطورك عبر الوقت." },
                    { icon: Lucide.Shield, title: "خصوصية تامة", desc: "بياناتك محمية ومخصصة لك فقط." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-indigo-500/20 text-indigo-400`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h5>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8 text-right">
                <h4 className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
                  <Lucide.Info className="w-5 h-5" />
                  نصيحة للحصول على أفضل نتيجة
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  يرجى الإجابة بصدق وشفافية على جميع الأسئلة. إجاباتك الصادقة هي المفتاح للحصول على تحليل دقيق ومخصص يساعدك فعلياً في رحلة تطويرك.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="p-6 md:p-10 border-t border-white/10 bg-[#0a0a0a] z-20">
            <div className="max-w-2xl mx-auto flex gap-4">
              <Button
                onClick={() => {
                  playPop();
                  onClose();
                }}
                variant="ghost"
                className="flex-1 h-12 rounded-2xl font-black text-sm bg-white/5 hover:bg-white/10 text-gray-900 dark:text-white border border-white/10 transition-all"
              >
                تراجع
              </Button>
              <Button
                onClick={() => {
                  playPop();
                  setStage('assessment');
                }}
                className="flex-1 h-12 rounded-2xl font-black text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
              >
                ابدأ الاختبار
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      {stage === 'assessment' && (
        <div className="relative z-10 flex items-center gap-6 p-6 md:p-10">
          {/* Navigation */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => {
                playPop();
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(prev => prev - 1);
                } else {
                  setStage('intro');
                }
              }} 
              variant="ghost"
              size="sm"
              className="p-3 hover:bg-white/5 rounded-2xl transition-all hover:scale-110 active:scale-90 group h-auto"
            >
              <ArrowRight size={28} className="text-gray-500 group-hover:text-white" />
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex justify-center items-center">
              <span className={`text-sm font-black uppercase tracking-[0.2em] text-${assessment.color}-400`}>
                {assessment.title}
              </span>
            </div>
            <div className="relative h-5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm flex items-center justify-center">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="absolute top-0 right-0 h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              />
              <span className="relative z-10 text-[11px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Close Button */}
          <Button 
            onClick={() => {
              playPop();
              onClose();
            }} 
            variant="ghost"
            size="sm"
            className="p-3 hover:bg-white/5 rounded-2xl transition-all hover:scale-110 active:scale-90 group h-auto"
          >
            <X size={28} className="text-gray-500 group-hover:text-white" />
          </Button>
        </div>
      )}

      {/* Content Area */}
      <div className="relative z-10 flex-1 flex flex-col w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 'assessment' && (
            <motion.div 
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col w-full h-full"
            >
              <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 max-w-4xl mx-auto w-full overflow-y-auto relative">
                <h2 className="text-2xl md:text-3xl font-black text-white text-center leading-relaxed px-8">
                  {question?.text}
                </h2>
              </div>

              <div className="w-full p-6 md:p-8 max-w-2xl mx-auto mt-auto">
                <div className="space-y-3 md:space-y-3 w-full">
                  {(Array.isArray(question?.options) ? question.options : []).map((option: any, idx: number) => {
                    const isSelected = answers[question.id] === option.value;
                    return (
                      <Button
                        key={idx}
                        onClick={() => handleAnswer(question.id, option.value)}
                        variant="ghost"
                        className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 text-right font-bold transition-all text-base md:text-lg flex justify-between items-center h-auto ${
                          isSelected
                            ? `bg-${assessment.color}-500/20 border-${assessment.color}-500/50 text-${assessment.color}-400`
                            : 'bg-[#181818] border-white/5 text-white hover:border-white/20 hover:bg-[#282828]'
                        }`}
                      >
                        <span>{option.text}</span>
                        {isSelected && <CheckCircle2 size={24} className={`text-${assessment.color}-400`} />}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'celebration' && (
            <motion.div 
              key="celebration"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex-1 flex flex-col w-full h-full"
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-8 max-w-4xl mx-auto w-full">
                <div className="relative mb-8">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 bg-${assessment.color}-500/20 blur-3xl rounded-full`}
                  />
                  <div className={`relative w-24 h-24 md:w-28 md:h-28 bg-${assessment.color}-500/20 rounded-3xl flex items-center justify-center border border-${assessment.color}-500/30`}>
                    <CheckCircle2 size={48} className={`text-${assessment.color}-400 md:w-12 md:h-12`} />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">اكتمل الاختبار!</h2>
                  <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto font-medium leading-relaxed">
                    لقد قمت بالإجابة على جميع الأسئلة بنجاح. نحن جاهزون الآن لعرض تحليلك.
                  </p>
                </div>
              </div>

              <div className="w-full p-6 md:p-8 max-w-2xl mx-auto mt-auto">
                <Button
                  onClick={handleFinish}
                  variant="primary"
                  size="xl"
                  fullWidth
                >
                  <span>عرض النتائج</span>
                  <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AssessmentFlow;
