import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, AlertCircle, Trophy, Sparkles, Volume2, VolumeX, Target, Play, Brain, BookOpen, Star, Flame, Zap, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccess, playPop, playLevelUp, playError } from '../utils/sounds';
import { getOrGenerateAudio } from '../services/audioCache';
import { playBase64Audio } from '../utils/audio';
import { Button } from './ui/Button';
import { useAudioAvailability } from '../hooks/useAudioAvailability';

interface LessonFlowProps {
  step: any;
  onClose: () => void;
  onComplete: (xp: number) => void;
  color?: {
    bg: string;
    text: string;
    border: string;
    lightBg: string;
    shadow: string;
  };
}

const getIcon = (iconName: string, className: string) => {
  const getAnimation = () => {
    switch (iconName) {
      case 'Target': return { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] };
      case 'Play': return { scale: [1, 1.1, 1], x: [0, 5, 0] };
      case 'Brain': return { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] };
      case 'Star': return { rotate: [0, 180, 360], scale: [1, 1.2, 1] };
      case 'Trophy': return { y: [0, -10, 0], scale: [1, 1.1, 1] };
      case 'Flame': return { scale: [1, 1.2, 1], rotate: [-5, 5, -5] };
      case 'Zap': return { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] };
      default: return { y: [0, -5, 0] };
    }
  };

  const renderIcon = () => {
    switch (iconName) {
      case 'Target': return <Target className={className} />;
      case 'Play': return <Play className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Star': return <Star className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Zap': return <Zap className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {renderIcon()}
    </motion.div>
  );
};

export const LessonFlow: React.FC<LessonFlowProps> = ({ step, onClose, onComplete, color = { bg: 'bg-[#1DB954]', text: 'text-[#1DB954]', border: 'border-[#1DB954]', shadow: 'shadow-[0_0_15px_rgba(29,185,84,0.2)]', lightBg: 'bg-[#1DB954]/20' } }) => {
  const [stage, setStage] = useState<'content' | 'quiz' | 'celebration'>('content');
  const [contentPage, setContentPage] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem('lesson-font-size');
      const parsed = saved ? parseInt(saved, 10) : 20;
      return isNaN(parsed) ? 20 : parsed;
    } catch (e) {
      return 20;
    }
  });

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('lesson-font-size', fontSize.toString());
    } catch (e) {
      console.error('Failed to save font size', e);
    }
  }, [fontSize]);

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 14));

  // Split content by double newlines to create pages
  const contentPages = (step?.content || '').split('\n\n').filter((p: string) => p.trim().length > 0);
  const currentText = contentPages[contentPage];

  const isAudioAvailable = useAudioAvailability(currentText);

  const handleSpeakText = async (text: string) => {
    // Audio playback disabled per user request
  };

  const handleSpeak = () => {
    // Audio playback disabled per user request
  };

  const handleClose = () => {
    onClose();
  };

  const handleOptionClick = (index: number) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === step?.quiz?.correctIndex) {
      setIsCorrect(true);
      playSuccess();
    } else {
      setIsCorrect(false);
      playError();
    }
  };

  const handlePrevious = () => {
    playPop();
    if (stage === 'content' && contentPage > 0) {
      setContentPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    playPop();
    if (stage === 'content') {
      if (contentPage < contentPages.length - 1) {
        setContentPage(prev => prev + 1);
      } else {
        if (step.quiz) {
          setStage('quiz');
        } else {
          setStage('celebration');
          playLevelUp();
        }
      }
    }
    else if (stage === 'quiz' && isCorrect) {
      setStage('celebration');
      playLevelUp();
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1DB954', '#3b82f6', '#f59e0b', '#ec4899']
    });
    playLevelUp();
  };

  const renderInteractiveWidget = () => {
    // سيكولوجية الأصوات
    if (step.title === 'سيكولوجية الأصوات' && contentPage === 3) {
      return (
      <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center p-6 bg-white/5 rounded-2xl border border-white/10">
        <Button onClick={playSuccess} variant="ghost" className="flex items-center gap-2 px-6 py-3 bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/50 rounded-xl hover:bg-[#1DB954]/30 transition-all h-auto">
          <Volume2 size={20} /> صوت إجابة صحيحة
        </Button>
        <Button onClick={playError} variant="ghost" className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-500 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-all h-auto">
          <Volume2 size={20} /> صوت إجابة خاطئة
        </Button>
        <Button onClick={playLevelUp} variant="ghost" className="flex items-center gap-2 px-6 py-3 bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-xl hover:bg-amber-500/30 transition-all h-auto">
          <Volume2 size={20} /> صوت إنجاز
        </Button>
      </div>
      );
    }

    // الاحتفالات البصرية
    if ((step.title === 'الاحتفالات البصرية' && contentPage === 1) || (step.title === 'أنظمة النقاط والمكافآت' && contentPage === 2)) {
      return (
      <div className="mt-8 flex justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
        <Button onClick={triggerConfetti} variant="ghost" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-transform shadow-lg shadow-purple-500/25 font-bold text-lg h-auto">
          <Sparkles size={24} /> جرب الاحتفال الآن!
        </Button>
      </div>
      );
    }

    return null;
  };

  const totalSteps = contentPages.length + 2; // content pages + quiz + celebration
  const currentProgressStep = stage === 'content' ? contentPage + 1 : stage === 'quiz' ? contentPages.length + 1 : totalSteps;
  const progress = (currentProgressStep / totalSteps) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 bg-[#121212] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 md:p-6">
        <Button onClick={handleClose} variant="ghost" size="sm" className="p-2 hover:bg-[#282828] rounded-full transition-colors">
          <X size={24} className="text-[#b3b3b3] hover:text-white" />
        </Button>
        <div className="flex-1 h-3 bg-[#282828] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${color.bg} rounded-full`}
          />
        </div>
        
        {/* Font Size Controls */}
        <div className="flex items-center gap-2 bg-[#282828] rounded-full p-1 border border-white/5">
          <Button 
            onClick={decreaseFontSize}
            variant="ghost"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors p-0"
            title="تصغير الخط"
          >
            <span className="text-sm font-bold">-A</span>
          </Button>
          <div className="w-[1px] h-4 bg-white/10" />
          <Button 
            onClick={increaseFontSize}
            variant="ghost"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors p-0"
            title="تكبير الخط"
          >
            <span className="text-lg font-bold">+A</span>
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {stage === 'content' && (
            <motion.div 
              key={`content-${contentPage}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-lg md:text-2xl font-black text-white">{step?.title}</h2>
                <div className="flex items-center gap-2">
                  {isAudioAvailable && (
                    <Button 
                      onClick={handleSpeak}
                      variant="ghost"
                      disabled={isGeneratingAudio}
                      className={`p-2.5 rounded-full transition-all h-auto ${isPlaying ? `${color.bg} text-black` : 'bg-[#282828] text-white hover:bg-[#333]'}`}
                      title="استمع للنص"
                    >
                      {isGeneratingAudio ? <Loader2 size={20} className="animate-spin" /> : (isPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />)}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="bg-[#181818]/60 backdrop-blur-md p-4 md:p-7 rounded-2xl md:rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[55vh] relative">
                <p 
                  className="leading-relaxed text-gray-200 whitespace-pre-wrap transition-all duration-200"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {contentPages[contentPage]}
                </p>
                
                {renderInteractiveWidget()}
              </div>
            </motion.div>
          )}

          {stage === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col w-full h-full"
            >
              <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto relative">
                <h2 
                  className="font-black text-white text-center transition-all duration-200 px-8"
                  style={{ fontSize: `${Math.max(fontSize * 1.2, 20)}px`, lineHeight: 1.4 }}
                >
                  {step?.quiz?.question}
                </h2>
              </div>

              <div className="w-full mt-auto pt-6">
                <div className="space-y-3 md:space-y-4">
                  {(Array.isArray(step?.quiz?.options) ? step.quiz.options : []).map((option: string, idx: number) => {
                    const isSelected = selectedOption === idx;
                    const isRight = isSelected && isCorrect;
                    const isWrong = isSelected && isCorrect === false;

                    return (
                      <Button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        variant="ghost"
                        className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl text-right font-bold border-2 transition-all flex justify-between items-center h-auto ${
                          isRight ? `${color.lightBg} ${color.border} ${color.text}` :
                          isWrong ? 'bg-red-500/20 border-red-500 text-red-500' :
                          'bg-[#181818] border-white/5 text-white hover:border-white/20 hover:bg-[#282828]'
                        }`}
                        style={{ fontSize: `${Math.max(fontSize * 0.9, 14)}px` }}
                      >
                        <span>{option}</span>
                        {isRight && <Check size={20} className="md:w-6 md:h-6" />}
                        {isWrong && <AlertCircle size={20} className="md:w-6 md:h-6" />}
                      </Button>
                    );
                  })}
                </div>
                
                <AnimatePresence>
                  {isCorrect !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-6 md:mt-8 p-4 md:p-6 rounded-xl md:rounded-2xl ${isCorrect ? `${color.lightBg} ${color.text}` : 'bg-red-500/10 text-red-500'}`}
                    >
                      <p className="font-bold text-sm md:text-lg mb-1 md:mb-2">{isCorrect ? 'إجابة صحيحة!' : 'حاول مرة أخرى'}</p>
                      {isCorrect && <p className="text-xs md:text-sm opacity-90">{step?.quiz?.explanation}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {stage === 'celebration' && (
            <motion.div 
              key="celebration"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div 
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.2 }}
                className={`w-32 h-32 md:w-40 md:h-40 ${color.bg} rounded-full flex items-center justify-center mb-6 md:mb-8 ${color.shadow}`}
              >
                <Trophy size={64} className="md:w-20 md:h-20 text-black" />
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 text-white">أحسنت!</h2>
              <p className={`text-lg md:text-2xl ${color.text} font-bold flex items-center justify-center gap-2`}>
                <Sparkles size={20} className="md:w-6 md:h-6" />
                +{step?.xp || 0} نقطة خبرة
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Action */}
      <div className="p-4 md:p-8 border-t border-white/5 bg-[#121212]">
        <div className="max-w-3xl mx-auto">
          {stage === 'content' && (
            <div className="flex gap-3 md:gap-4">
              {contentPage > 0 && (
                <Button 
                  onClick={handlePrevious}
                  variant="secondary"
                  size="xl"
                  fullWidth
                >
                  السابق
                </Button>
              )}
              <Button 
                onClick={handleNext}
                variant="primary"
                size="xl"
                fullWidth
              >
                {contentPage < contentPages.length - 1 ? 'التالي' : (step?.quiz ? 'ابدأ الاختبار' : 'إنهاء الدرس')}
              </Button>
            </div>
          )}
          {stage === 'quiz' && isCorrect && (
            <Button 
              onClick={handleNext}
              variant="primary"
              size="xl"
              fullWidth
            >
              متابعة
            </Button>
          )}
          {stage === 'celebration' && (
            <Button 
              onClick={() => onComplete(step?.xp || 0)}
              variant="primary"
              size="xl"
              fullWidth
            >
              إنهاء
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
