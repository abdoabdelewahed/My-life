import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
const { 
  Brain, Target, Activity, ChevronRight, CheckCircle2, 
  ArrowRight, ArrowLeft, PlusCircle, Star, Shield, Zap, Users,
  BarChart3, Lightbulb, X, AlertTriangle
} = Lucide;
import { CircularProgress } from './CircularProgress';
import confetti from 'canvas-confetti';
import { playPop, playLevelUp } from '../utils/sounds';
import AssessmentFlow from './AssessmentFlow';
import { Button } from './ui/Button';
import { LessonFlow } from './LessonFlow';
import { PATH_COLORS } from '../constants';
import { generateLessonContent } from '../utils/lessonUtils';
import { getOrGenerateAudio } from '../services/audioCache';
import { HabitsPage } from './HabitsPage';

type ViewState = 'dashboard' | 'library' | 'assessment' | 'result_summary' | 'results' | 'improvement' | 'all_results' | 'habits';

import { ASSESSMENTS, Assessment, Question, SubCategoryDef } from '../data/abilitiesData';

interface SubCategory {
  id: string;
  name: string;
  score: number;
  type: 'positive' | 'negative';
  impact: string;
  steps: string[];
}

interface AssessmentResult {
  assessmentId: string;
  overallScore: number;
  subCategories: SubCategory[];
  date: string;
}

const getLevel = (score: number, type: 'positive' | 'negative' = 'positive') => {
  if (Number.isNaN(score)) return { label: 'غير مختبر', color: 'gray' };
  if (type === 'positive') {
    if (score >= 90) return { label: 'ممتاز', color: 'emerald' };
    if (score >= 75) return { label: 'جيد جداً', color: 'blue' };
    if (score >= 50) return { label: 'جيد', color: 'amber' };
    return { label: 'يحتاج تطوير', color: 'red' };
  } else {
    // Negative traits (Fear, Addiction, etc.) - High score is BAD
    if (score <= 20) return { label: 'منخفض جداً', color: 'emerald' };
    if (score <= 45) return { label: 'منخفض', color: 'blue' };
    if (score <= 70) return { label: 'متوسط', color: 'amber' };
    if (score <= 85) return { label: 'مرتفع', color: 'orange' };
    return { label: 'مرتفع جداً', color: 'red' };
  }
};

const AnimatedScore = ({ score, color, type }: { score: number, color: string, type?: 'positive' | 'negative' }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number.isNaN(score) ? 0 : score;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentScore = Math.floor(easeProgress * end);
      
      setDisplayScore(currentScore);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const level = getLevel(score, type);

  return (
    <div className="relative flex flex-col items-center justify-center py-6 md:py-8 mb-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className={`text-7xl md:text-9xl font-black tracking-tighter text-${color}-600 dark:text-${color}-400 drop-shadow-[0_0_30px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] leading-none flex items-baseline`}>
          {displayScore}
          <span className="text-2xl md:text-4xl ml-1 opacity-30 font-bold">%</span>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className={`px-6 py-2 rounded-2xl bg-${level.color}-500/10 border border-${level.color}-500/20 text-${level.color}-600 dark:text-${level.color}-400 text-sm md:text-base font-black tracking-widest mt-6 shadow-lg backdrop-blur-sm`}
      >
        {level.label}
      </motion.div>
    </div>
  );
};

interface AbilitiesPageProps {
  defaultView?: ViewState;
  onComplete?: () => void;
  onViewChange?: (view: string) => void;
  onActivityComplete?: (xp: number) => void;
}

export default function AbilitiesPage({ defaultView = 'dashboard', onComplete, onViewChange, onActivityComplete }: AbilitiesPageProps) {
  const [view, setView] = useState<ViewState>(defaultView);
  
  useEffect(() => {
    if (onViewChange) {
      onViewChange(view);
    }
  }, [view, onViewChange]);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [resultStep, setResultStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Record<string, AssessmentResult>>(() => {
    try {
      const saved = localStorage.getItem('abilitiesResults');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('abilitiesResults', JSON.stringify(results));
  }, [results]);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  
  const excludedIds = [];
  const abilitiesAssessments = ASSESSMENTS.filter(a => !excludedIds.includes(a.id));
  const challengesAssessments = ASSESSMENTS.filter(a => excludedIds.includes(a.id));
  
  const abilitiesCompleted = abilitiesAssessments.every(a => results[a.id] != null);
  const challengesCompleted = challengesAssessments.every(a => results[a.id] != null);
  const allCompleted = abilitiesCompleted && challengesCompleted;
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [showRetakeConfirm, setShowRetakeConfirm] = useState<Assessment | null>(null);

  // Load results on mount
  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('abilitiesResults');
      if (savedResults) {
        const parsed = JSON.parse(savedResults);
        if (typeof parsed === 'object' && !Array.isArray(parsed) && parsed !== null) {
          // Validate structure to prevent rendering invalid objects (e.g. stripped React elements)
          let isValid = true;
          for (const key in parsed) {
            const result = parsed[key];
            if (typeof result !== 'object' || result === null) {
              isValid = false;
              break;
            }
            if (typeof result.overallScore !== 'number') {
              isValid = false;
              break;
            }
            if (!Array.isArray(result.subCategories)) {
              isValid = false;
              break;
            }
            for (const sub of result.subCategories) {
              if (typeof sub.name !== 'string' || typeof sub.score !== 'number') {
                isValid = false;
                break;
              }
            }
          }
          
          if (isValid) {
            setResults(parsed);
          } else {
            console.warn('Invalid abilities results found in localStorage, clearing...');
            localStorage.removeItem('abilitiesResults');
          }
        } else {
          localStorage.removeItem('abilitiesResults');
        }
      }
    } catch (e) {
      console.error('Failed to load abilities results', e);
      localStorage.removeItem('abilitiesResults');
    }
  }, []);

  const calculateAwarenessIndex = () => {
    const resultValues = (Object.values(results) as AssessmentResult[])
      .filter(r => !excludedIds.includes(r.assessmentId));
      
    if (resultValues.length === 0) return 0;
    const total = resultValues.reduce((acc: number, curr: AssessmentResult) => acc + (Number.isNaN(curr.overallScore) ? 0 : curr.overallScore), 0);
    return Math.round(total / resultValues.length);
  };

  const getPersonalityType = () => {
    const resultValues = (Object.values(results) as AssessmentResult[])
      .filter(r => !excludedIds.includes(r.assessmentId));
      
    if (resultValues.length === 0) return 'غير محدد';
    
    // Simple logic based on highest scoring assessment
    const highestAssessment = resultValues.sort((a, b) => (Number.isNaN(b.overallScore) ? 0 : b.overallScore) - (Number.isNaN(a.overallScore) ? 0 : a.overallScore))[0];
    
    switch (highestAssessment.assessmentId) {
      case 'traits': return 'المفكر التحليلي';
      case 'confidence': return 'القائد الواثق';
      case 'skills': return 'المنفذ العملي';
      default: return 'المتوازن';
    }
  };

  const startAssessment = (assessment: Assessment) => {
    playPop();
    setActiveAssessment(assessment);
    setView('assessment');
  };

  const finishAssessment = (finalAnswers: Record<string, number>) => {
    if (!activeAssessment) return;

    // Calculate sub-category scores
    const subScores: Record<string, { total: number; count: number }> = {};
    
    activeAssessment.questions.forEach(q => {
      if (!subScores[q.subCategoryId]) {
        subScores[q.subCategoryId] = { total: 0, count: 0 };
      }
      const answerValue = finalAnswers[q.id];
      if (answerValue !== undefined) {
        subScores[q.subCategoryId].total += answerValue;
        subScores[q.subCategoryId].count += 1;
      }
    });

    const subCategories: SubCategory[] = (Array.isArray(activeAssessment.subCategoriesDef) ? activeAssessment.subCategoriesDef : []).map(def => {
      const stats = subScores[def.id] || { total: 0, count: 0 };
      const score = stats.count > 0 ? Math.round(stats.total / stats.count) : 0;
      return {
        id: def.id,
        name: def.name,
        score,
        type: def.type,
        impact: score >= 75 ? def.impactHigh : def.impactLow,
        steps: score >= 75 ? def.stepsHigh : def.stepsLow
      };
    });

    const overallScore = subCategories.length > 0 ? Math.round(
      subCategories.reduce((acc, curr) => acc + curr.score, 0) / subCategories.length
    ) : 0;

    const newResult: AssessmentResult = {
      assessmentId: activeAssessment.id,
      overallScore,
      subCategories,
      date: new Date().toISOString()
    };

    const newResults = { ...results, [activeAssessment.id]: newResult };
    setResults(newResults);
    localStorage.setItem('abilitiesResults', JSON.stringify(newResults));
    
    onActivityComplete?.(50); // Award 50 XP for completing an assessment
    
    playLevelUp();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#10b981']
    });

    setSelectedSubCategory(null);
    setResultStep(0);
    setView('results');
  };



  const getDynamicResultText = (assessment: Assessment, score: number) => {
    const type = assessment.type || 'positive';
    let levelText = '';
    
    if (type === 'positive') {
      if (score >= 90) levelText = 'ممتازة جداً';
      else if (score >= 75) levelText = 'مرتفعة';
      else if (score >= 50) levelText = 'متوسطة';
      else levelText = 'منخفضة';
    } else {
      if (score <= 20) levelText = 'منخفض جداً';
      else if (score <= 45) levelText = 'منخفض';
      else if (score <= 70) levelText = 'متوسط';
      else if (score <= 85) levelText = 'مرتفع';
      else levelText = 'مرتفع جداً';
    }

    if (assessment.id === 'confidence') return `ثقتك بنفسك ${levelText}`;
    if (assessment.id === 'skills') return `مستوى مهاراتك ${levelText}`;
    if (assessment.id === 'traits') return `مستوى صفاتك الإيجابية ${levelText}`;
    if (assessment.id === 'physical_health') return `مستوى صحتك البدنية ${levelText}`;
    
    return `النتيجة: ${levelText}`;
  };

  const getCardColors = (score: number | undefined | null, type: 'positive' | 'negative' = 'positive') => {
    if (score == null) {
      return {
        border: 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 border-b-gray-300 dark:border-b-gray-800',
        iconBg: 'bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10',
        iconText: 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
        badge: '',
        progressBg: '',
        progressFill: '',
        buttonBg: 'bg-gray-100 dark:bg-white/5',
        buttonHover: 'hover:bg-gray-200 dark:hover:bg-white/10',
        buttonBorder: 'border-gray-200 dark:border-white/10',
        cardBg: 'bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#151515]',
        scoreText: 'text-gray-900 dark:text-white',
        dynamicText: 'text-gray-900 dark:text-white'
      };
    }
    
    const isGood = type === 'positive' ? score >= 75 : score <= 20;
    const isMid = type === 'positive' ? score >= 50 : score <= 70;
    const isBad = type === 'positive' ? score < 50 : score > 70;

    if (isGood) {
      return {
        border: 'border-emerald-500/30 hover:border-emerald-500/50 border-b-emerald-800',
        iconBg: 'bg-emerald-500/20',
        iconText: 'text-emerald-400',
        badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        progressBg: 'bg-emerald-500/20',
        progressFill: 'bg-emerald-500',
        buttonBg: 'bg-emerald-500/20',
        buttonHover: 'hover:bg-emerald-500/30',
        buttonBorder: 'border-emerald-500/30',
        cardBg: 'bg-gradient-to-br from-[#0a1a12] to-[#050d09]',
        scoreText: 'text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-200',
        dynamicText: 'text-emerald-400'
      };
    } else if (isMid) {
      return {
        border: 'border-blue-500/30 hover:border-blue-500/50 border-b-blue-800',
        iconBg: 'bg-blue-500/20',
        iconText: 'text-blue-400',
        badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        progressBg: 'bg-blue-500/20',
        progressFill: 'bg-blue-500',
        buttonBg: 'bg-blue-500/20',
        buttonHover: 'hover:bg-blue-500/30',
        buttonBorder: 'border-blue-500/30',
        cardBg: 'bg-gradient-to-br from-[#0a121a] to-[#05090d]',
        scoreText: 'text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-200',
        dynamicText: 'text-blue-400'
      };
    } else {
      return {
        border: 'border-orange-500/30 hover:border-orange-500/50 border-b-orange-800',
        iconBg: 'bg-orange-500/20',
        iconText: 'text-orange-400',
        badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
        progressBg: 'bg-orange-500/20',
        progressFill: 'bg-orange-500',
        buttonBg: 'bg-orange-500/20',
        buttonHover: 'hover:bg-orange-500/30',
        buttonBorder: 'border-orange-500/30',
        cardBg: 'bg-gradient-to-br from-[#1a120a] to-[#0d0905]',
        scoreText: 'text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-200',
        dynamicText: 'text-orange-400'
      };
    }
  };

  const renderLibrary = () => {
    const awarenessIndex = calculateAwarenessIndex();
    const isLocked = false;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-6xl mx-auto space-y-12 md:space-y-20 w-full py-10 md:py-20"
      >
        {/* Ethereal Background Blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 80, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.3, 1, 1.3],
              x: [0, -80, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-15%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[140px]" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-right">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest"
            >
              <Lucide.Sparkles size={14} />
              مقياس القدرات الذهنية
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tighter transition-colors duration-300"
            >
              اكتشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">قواك الخفية</span> وطور مهاراتك
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {(Array.isArray(ASSESSMENTS) ? ASSESSMENTS : []).map((assessment, idx) => {
              const result = results[assessment.id];
              const score = result?.overallScore;
              const colors = getCardColors(score, assessment.type);
              
              return (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={!isLocked ? { y: -8, scale: 1.01 } : {}}
                  whileTap={!isLocked ? { y: -2, scale: 0.99 } : {}}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => !isLocked && score == null && startAssessment(assessment)}
                  className={`group relative text-right p-4 md:p-8 rounded-[24px] md:rounded-[40px] border-b-8 transition-all duration-300 flex flex-col justify-center overflow-hidden cursor-pointer ${
                    isLocked ? 'bg-gray-100 dark:bg-[#121212] border-gray-200 dark:border-white/5 cursor-not-allowed opacity-60' :
                    `${colors.cardBg} ${colors.border}`
                  } shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]`}
                >
                  {/* Ethereal background for completed assessments */}
                  {score != null && !isLocked && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 group-hover:opacity-30 transition-opacity duration-700">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          x: [0, 30, 0],
                          y: [0, 20, 0],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[60px] ${colors.iconBg}`}
                      />
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          x: [0, -30, 0],
                          y: [0, -20, 0],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                        className={`absolute -bottom-12 -right-12 w-48 h-48 rounded-full blur-[60px] ${colors.iconBg}`}
                      />
                    </div>
                  )}
                  {/* Lock Icon */}
                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <Lucide.Lock className="text-gray-500" size={32} />
                    </div>
                  )}

                  {score == null ? (
                    <div className="flex flex-col gap-4 relative z-10 w-full">
                      <div className="flex flex-row items-center gap-4">
                        <div className={`w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-[16px] md:rounded-[24px] flex items-center justify-center bg-gray-50 dark:bg-white/5 text-gray-400 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                          {(() => {
                            const IconComponent = (Lucide as any)[assessment.iconName] || Brain;
                            return <IconComponent className="w-6 h-6 md:w-10 md:h-10" /> ;
                          })()}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg md:text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
                            {assessment.title}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2 w-full">
                        <Button
                          onClick={() => !isLocked && startAssessment(assessment)}
                          className="w-full h-12 md:h-16 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-black rounded-[16px] md:rounded-[24px] shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center gap-3 text-sm md:text-base"
                        >
                          <span>{isLocked ? 'مغلق' : 'ابدأ الاختبار'}</span>
                          {!isLocked && <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 group-hover:-translate-x-2 transition-transform" />}
                          {isLocked && <Lucide.Lock className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 relative z-10">
                      <div className="flex flex-row items-center gap-3 md:gap-6">
                        <div className={`w-14 h-14 md:w-20 md:h-20 shrink-0 rounded-[16px] md:rounded-[24px] flex items-center justify-center shadow-xl ${colors.iconBg} ${colors.iconText}`}>
                          {(() => {
                            const IconComponent = (Lucide as any)[assessment.iconName] || Brain;
                            return <IconComponent className="w-6 h-6 md:w-10 md:h-10" />;
                          })()}
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-lg md:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1 transition-colors duration-300">
                            {assessment.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2 w-full">
                        <Button
                          onClick={() => {
                            playPop();
                            setActiveAssessment(assessment);
                            setResultStep(0);
                            setView('results');
                          }}
                          className="flex-1 px-6 py-3 md:px-8 md:py-4 rounded-[12px] md:rounded-[20px] text-sm md:text-base font-black bg-green-600 hover:bg-green-700 text-white border-none transition-all hover:scale-[1.02]"
                        >
                          عرض النتيجة
                        </Button>
                        <Button
                          onClick={() => {
                            playPop();
                            setShowRetakeConfirm(assessment);
                          }}
                          className="w-12 h-12 md:w-16 md:h-16 shrink-0 flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-[12px] md:rounded-[20px] border border-gray-200 dark:border-white/10 transition-all hover:scale-[1.02]"
                          title="إعادة الاختبار"
                        >
                          <Lucide.RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderDashboard = () => {
    const awarenessIndex = calculateAwarenessIndex();

    const allAbilities = abilitiesAssessments.flatMap(a => 
      (Array.isArray(a.subCategoriesDef) ? a.subCategoriesDef : []).map(sub => ({
        ...sub,
        assessmentId: a.id,
        assessmentTitle: a.title,
        color: a.color,
        iconName: sub.iconName,
        type: a.type
      }))
    );

    const allSubResults = (Object.values(results) as AssessmentResult[]).flatMap(r => r.subCategories);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-6xl mx-auto space-y-6 md:space-y-8"
      >
        {!abilitiesCompleted && (
          <div className="text-center mb-6 md:mb-10 relative">
            <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 mb-3 md:mb-4 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300">
              اكتشف ذاتك
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2 md:mb-4 tracking-tighter leading-tight transition-colors duration-300">
              مرآة <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-500">قدراتي</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-base font-medium max-w-xl mx-auto leading-relaxed px-4 md:px-0 transition-colors duration-300">
              قس قدراتك، افهم نقاط قوتك، وحول الوعي الذاتي إلى خطوات عملية للتطوير.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {/* Habits Assessment Card */}
          <div className="space-y-4">
            {localStorage.getItem('habits_test_finished') === 'true' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  playPop();
                  setView('habits');
                }}
                className={`relative group cursor-pointer bg-white dark:bg-[#181818] p-6 md:p-8 rounded-3xl border-2 border-b-4 border-indigo-500/30 dark:border-indigo-500/20 transition-all hover:-translate-y-1 active:translate-y-0 active:border-b-2`}
              >
                <div className={`absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-indigo-500/10 text-indigo-500`}>
                      <Activity className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className={`text-xl md:text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-2`}>اختبار العادات</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold">
                        مكتمل - اضغط لعرض النتيجة
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => {
                  playPop();
                  setView('habits');
                }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white dark:bg-[#181818] border-2 border-b-4 border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-colors active:border-b-2 active:translate-y-[2px]">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/10 text-indigo-500`}>
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">اختبار العادات</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">اكتشف عاداتك الإيجابية والسلبية وكيف تؤثر على حياتك.</p>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPop();
                        setView('habits');
                      }}
                      className="w-full md:w-auto h-10 px-6 rounded-xl font-black text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                    >
                      ابدأ الاختبار
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {abilitiesAssessments.map((assessment, idx) => {
                  const result = results[assessment.id];
                  const isCompleted = result != null;
                  const score = result?.overallScore;
                  const colors = getCardColors(score, assessment.type);
                  
                  return (
                    <div key={assessment.id} className="space-y-4">
                      {isCompleted ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => {
                            playPop();
                            setActiveAssessment(assessment);
                            setResultStep(0);
                            setView('result_summary');
                          }}
                          className={`relative group cursor-pointer bg-white dark:bg-[#181818] p-6 md:p-8 rounded-3xl border-2 border-b-4 ${colors.border} transition-all hover:-translate-y-1 active:translate-y-0 active:border-b-2`}
                        >
                          <div className={`absolute inset-0 bg-${assessment.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${colors.iconBg} ${colors.iconText}`}>
                                {(() => {
                                  const IconComponent = (Lucide as any)[assessment.iconName] || Brain;
                                  return <IconComponent className="w-8 h-8" />;
                                })()}
                              </div>
                              <div>
                                <h3 className={`text-xl md:text-2xl font-black ${colors.iconText} mb-2`}>{assessment.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold">
                                  {score}% - {getLevel(score || 0, assessment.type).label}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          onClick={() => startAssessment(assessment)}
                          className="relative group cursor-pointer"
                        >
                          <div className={`absolute inset-0 bg-${assessment.color}-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                          <div className={`relative bg-white dark:bg-[#181818] border-2 border-b-4 border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden hover:border-${assessment.color}-500/50 dark:hover:border-${assessment.color}-500/50 transition-colors active:border-b-2 active:translate-y-[2px]`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-${assessment.color}-500/10 text-${assessment.color}-500`}>
                                  {(() => {
                                    const IconComponent = (Lucide as any)[assessment.iconName] || Brain;
                                    return <IconComponent className="w-8 h-8" />;
                                  })()}
                                </div>
                                <div>
                                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">{assessment.title}</h3>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">اكتشف قدراتك في {assessment.title}</p>
                                </div>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startAssessment(assessment);
                                }}
                                className={`w-full md:w-auto h-12 px-8 rounded-2xl font-black text-sm bg-${assessment.color}-600 hover:bg-${assessment.color}-500 text-white shadow-lg shadow-${assessment.color}-500/20`}
                              >
                                ابدأ الاختبار
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-8 mt-12">
                {challengesAssessments.map((assessment, idx) => {
                  const result = results[assessment.id];
                  const isCompleted = result != null;
                  const score = result?.overallScore;
                  const colors = getCardColors(score, assessment.type);
                  
                  return (
                    <div key={assessment.id} className="space-y-4">
                      {isCompleted ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => {
                            playPop();
                            setActiveAssessment(assessment);
                            setResultStep(0);
                            setView('result_summary');
                          }}
                          className={`relative group cursor-pointer bg-white dark:bg-[#181818] p-6 md:p-8 rounded-3xl border-2 border-b-4 ${colors.border} transition-all hover:-translate-y-1 active:translate-y-0 active:border-b-2`}
                        >
                          <div className={`absolute inset-0 bg-${assessment.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${colors.iconBg} ${colors.iconText}`}>
                                {(() => {
                                  const IconComponent = (Lucide as any)[assessment.iconName] || Brain;
                                  return <IconComponent className="w-8 h-8" />;
                                })()}
                              </div>
                              <div>
                                <h3 className={`text-xl md:text-2xl font-black ${colors.iconText} mb-2`}>{assessment.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold">
                                  {score}% - {getLevel(score || 0, assessment.type).label}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          onClick={() => startAssessment(assessment)}
                          className="relative group cursor-pointer"
                        >
                          <div className={`absolute inset-0 bg-${assessment.color}-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                          <div className={`relative bg-white dark:bg-[#181818] border-2 border-b-4 border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden hover:border-${assessment.color}-500/50 dark:hover:border-${assessment.color}-500/50 transition-colors active:border-b-2 active:translate-y-[2px]`}>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-${assessment.color}-500/10 text-${assessment.color}-500`}>
                                  {(() => {
                                    const IconComponent = (Lucide as any)[assessment.iconName] || Brain;
                                    return <IconComponent className="w-8 h-8" />;
                                  })()}
                                </div>
                                <div>
                                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">{assessment.title}</h3>
                                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">اكتشف قدراتك في {assessment.title}</p>
                                </div>
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startAssessment(assessment);
                                }}
                                className={`w-full md:w-auto h-12 px-8 rounded-2xl font-black text-sm bg-${assessment.color}-600 hover:bg-${assessment.color}-500 text-white shadow-lg shadow-${assessment.color}-500/20`}
                              >
                                ابدأ الاختبار
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
      </motion.div>
    );
  };

  const getNextAssessment = () => {
    if (!activeAssessment) return null;
    const currentIndex = ASSESSMENTS.findIndex(a => a.id === activeAssessment.id);
    if (currentIndex < ASSESSMENTS.length - 1) {
      return ASSESSMENTS[currentIndex + 1];
    }
    return null;
  };

  const renderResultSummary = () => {
    if (!activeAssessment) return null;
    const result = results[activeAssessment.id];
    if (!result) return null;

    const score = result.overallScore;
    const level = getLevel(score || 0, activeAssessment.type);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex flex-col bg-[#0a0a0a]"
      >
        <div className={`absolute inset-0 bg-${activeAssessment.color}-500/5 opacity-30 blur-[120px] pointer-events-none`} />
        <div className="absolute inset-0 bg-atmospheric opacity-40 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between p-4 md:p-6 gap-6">
          <Button 
            onClick={() => {
              playPop();
              setView('dashboard');
            }}
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/10 p-0"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10">
          <div className="w-full max-w-lg mx-auto text-center">
            
            <h2 className="text-2xl font-black text-white mb-6">
              {activeAssessment.title}
            </h2>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8">
              <div className={`text-5xl font-black text-${activeAssessment.color}-400 mb-2`}>
                {score}%
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${activeAssessment.color}-500/20 text-${activeAssessment.color}-300 font-bold text-sm`}>
                {level.label}
              </div>
            </div>

            <div className="w-full space-y-3 mb-8">
              <h3 className="text-lg font-black text-white text-right mb-3">تحليل القدرات</h3>
              {result.subCategories.map((sub, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 font-bold text-sm">{sub.name}</span>
                  </div>
                  <div className="h-4 bg-white/10 rounded-full overflow-hidden flex items-center relative">
                    <div 
                      className={`h-full ${sub.score >= 70 ? 'bg-emerald-500' : sub.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${sub.score}%` }}
                    />
                    <span className="absolute right-2 text-[10px] font-black text-white">
                      {sub.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 border-t border-white/10 bg-[#0a0a0a] z-20">
          <div className="w-full max-w-lg mx-auto flex gap-4">
            <Button
              onClick={() => {
                playPop();
                setView('results');
              }}
              className={`flex-1 h-12 rounded-2xl font-black text-sm bg-${activeAssessment.color}-600 hover:bg-${activeAssessment.color}-500 text-white shadow-lg shadow-${activeAssessment.color}-500/20 transition-all`}
            >
              عرض النتيجة
            </Button>
            <Button
              onClick={() => {
                playPop();
                setShowRetakeConfirm(activeAssessment);
              }}
              variant="ghost"
              className="flex-1 h-12 rounded-2xl font-black text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
            >
              إعادة الاختبار
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderResults = () => {
    if (!activeAssessment) return null;
    const result = results[activeAssessment.id];
    if (!result) return null;

    const subCategories = Array.isArray(result.subCategories) ? result.subCategories : [];
    const totalSteps = subCategories.length;

    const handleNext = () => {
      playPop();
      if (resultStep < totalSteps - 1) {
        setResultStep(prev => prev + 1);
      }
    };

    const handlePrev = () => {
      playPop();
      if (resultStep > 0) {
        setResultStep(prev => prev - 1);
      }
    };

    const renderStepContent = () => {
      // Subcategory Detail View
      const sub = subCategories[resultStep];
      if (!sub) return null;

      return (
        <AnimatePresence mode="wait">
          <motion.div 
            key={resultStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex-1 overflow-y-auto p-4 md:p-8 flex flex-col w-full"
          >
            <div className="mb-6 text-right">
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-1">
                {sub.name}
              </h2>
              <p className="text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">
                تحليل القسم الحالي
              </p>
            </div>

            <AnimatedScore score={sub.score} color={activeAssessment.color} type={sub.type} />

            <div className="space-y-6 mb-32">
              <div className="bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl md:rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Activity size={24} />
                  </div>
                  <h5 className="text-blue-400 font-black text-xl md:text-2xl tracking-tight">النتيجة</h5>
                </div>
                <p className="text-base md:text-xl text-gray-300 leading-relaxed font-medium">
                  {sub.impact}
                </p>
              </div>
              
              <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl md:rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Target size={24} />
                  </div>
                  <h5 className="text-emerald-400 font-black text-xl md:text-2xl tracking-tight">خطوات عملية للتحسين</h5>
                </div>
                <ul className="space-y-4">
                  {(Array.isArray(sub.steps) ? sub.steps : []).map((step, i) => (
                    <li key={i} className="flex items-start gap-4 text-base md:text-xl text-gray-300 leading-relaxed font-medium bg-black/20 p-6 rounded-2xl border border-white/5">
                      <span className="text-emerald-500 font-black text-xl">{i + 1}.</span>
                      <span className="flex-1">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-[#0a0a0a]"
      >
        {/* Atmospheric Background */}
        <div className={`absolute inset-0 bg-${activeAssessment.color}-500/5 opacity-30 blur-[120px] pointer-events-none`} />
        <div className="absolute inset-0 bg-atmospheric opacity-40 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between p-4 md:p-6 gap-6">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                playPop();
                setView('dashboard');
              }}
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/10 p-0"
            >
              <X size={20} />
            </Button>
          </div>
          
          {/* Progress Indicator like Habits page */}
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((resultStep + 1) / totalSteps) * 100}%` }}
              className={`h-full bg-${activeAssessment.color}-500 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
            />
          </div>

          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">
            {resultStep + 1} / {totalSteps}
          </div>
        </div>

        {renderStepContent()}

        {/* Fixed Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent backdrop-blur-sm border-t border-white/5">
            <div className="max-w-3xl mx-auto flex gap-4">
              <Button
                onClick={handlePrev}
                disabled={resultStep === 0}
                variant="ghost"
                className={`flex-1 h-14 rounded-2xl font-black text-lg transition-all ${
                  resultStep === 0 ? 'opacity-30 grayscale cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                }`}
              >
                <ArrowRight size={20} className="ml-2" />
                السابق
              </Button>
              
              {resultStep < totalSteps - 1 && (
                <Button
                  onClick={handleNext}
                  variant="primary"
                  className="flex-1 h-14 rounded-2xl font-black text-lg transition-all shadow-xl bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                >
                  التالي
                  <ArrowLeft size={20} className="mr-2" />
                </Button>
              )}
            </div>
          </div>
      </motion.div>
    );
  };

  const handleViewLesson = (node: any) => {
    const step = generateLessonContent(node);
    setActiveLesson(step);
  };

  const handleViewAbilityResult = (abilityId: string) => {
    const assessment = ASSESSMENTS.find(a => a.subCategoriesDef.some(s => s.id === abilityId));
    if (assessment && results[assessment.id]) {
      const index = assessment.subCategoriesDef.findIndex(s => s.id === abilityId);
      if (index !== -1) {
        setActiveAssessment(assessment);
        setResultStep(index);
        setView('results');
      }
    }
  };

  const handleStartAssessment = (abilityId: string) => {
    const assessment = ASSESSMENTS.find(a => a.subCategoriesDef.some(s => s.id === abilityId));
    if (assessment) {
      startAssessment(assessment);
    }
  };

  if (view === 'habits') {
    const isFinished = localStorage.getItem('habits_test_finished') === 'true';
    return (
      <HabitsPage
        onViewChange={() => {}}
        onBack={() => setView('dashboard')}
        onComplete={() => {}}
        initialView={isFinished ? "result_summary" : "intro"}
        onActivityComplete={() => {}}
      />
    );
  }

  return (
    <div className="pb-24 pt-4 md:pt-8 px-2 md:px-4">
      <AnimatePresence>
        {activeLesson && (
          <div className="fixed inset-0 z-[300]">
            <LessonFlow 
              step={activeLesson}
              onClose={() => setActiveLesson(null)}
              onComplete={(xp) => {
                onActivityComplete?.(xp);
                setActiveLesson(null);
              }}
              color={PATH_COLORS[0]}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'dashboard' && <div key="dashboard">{renderDashboard()}</div>}
        {view === 'library' && (
          <div key="library" className="relative">
            {renderLibrary()}
          </div>
        )}
        {view === 'assessment' && activeAssessment && (
          <AssessmentFlow 
            key="assessment"
            assessment={activeAssessment}
            onClose={() => setView('dashboard')}
            onComplete={finishAssessment}
          />
        )}
        {view === 'result_summary' && <div key="result_summary">{renderResultSummary()}</div>}
        {view === 'results' && <div key="results">{renderResults()}</div>}
        {view === 'improvement' && <div key="improvement">مرحلة التحسين (قريباً)</div>}
      </AnimatePresence>

      {/* Retake Confirmation Modal */}
      <AnimatePresence>
        {showRetakeConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-[32px] max-w-md w-full text-right shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6 mx-auto">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">إعادة الاختبار؟</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                هل أنت متأكد من رغبتك في إعادة اختبار "{showRetakeConfirm.title}"؟ سيتم استبدال نتيجتك الحالية بالنتيجة الجديدة.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    playPop();
                    setShowRetakeConfirm(null);
                  }}
                  className="flex-1 h-12 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold border border-gray-200 dark:border-white/10"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={() => {
                    startAssessment(showRetakeConfirm);
                    setShowRetakeConfirm(null);
                  }}
                  className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20"
                >
                  تأكيد الإعادة
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
