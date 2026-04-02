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
  const [stage, setStage] = useState<'assessment' | 'celebration'>('assessment');
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

      {/* Header */}
      {stage === 'assessment' && (
        <div className="relative z-10 flex items-center gap-6 p-6 md:p-10">
          {/* Navigation */}
          <div className="flex items-center gap-4">
            {currentQuestionIndex > 0 ? (
              <Button 
                onClick={() => {
                  playPop();
                  setCurrentQuestionIndex(prev => prev - 1);
                }} 
                variant="ghost"
                size="sm"
                className="p-3 hover:bg-white/5 rounded-2xl transition-all hover:scale-110 active:scale-90 group h-auto"
              >
                <ArrowRight size={28} className="text-gray-500 group-hover:text-white" />
              </Button>
            ) : (
              <div className="w-[52px]" /> // Spacer to maintain layout
            )}
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
            onClick={onClose} 
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
                        {isSelected && <CheckCircle2 size={24} className={`text-${assessment.color}-400`} />}
                        <span>{option.text}</span>
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
