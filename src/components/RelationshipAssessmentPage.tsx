import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
const { 
  Heart, Users, ChevronRight, ArrowLeft, ArrowRight, RotateCcw, Brain, X, Target, Activity, CheckCircle2, MessageCircleHeart, ShieldCheck, Hand, Swords, Home
} = Lucide;
import { playPop, playLevelUp } from '../utils/sounds';
import AssessmentFlow from './AssessmentFlow';
import { Button } from './ui/Button';
import { RELATIONSHIP_ASSESSMENTS, Assessment, Question, SubCategoryDef } from '../data/relationshipAssessmentsData';

type ViewState = 'dashboard' | 'assessment' | 'results' | 'result_summary';

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
  score: number;
  subCategories: SubCategory[];
  date: string;
}

const IconMap: Record<string, React.ElementType> = {
  MessageCircleHeart,
  ShieldCheck,
  Hand,
  Swords,
  Home,
  Heart,
  Users
};

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

export default function RelationshipAssessmentPage() {
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [results, setResults] = useState<Record<string, AssessmentResult>>(() => {
    const saved = localStorage.getItem('relationshipAssessmentResults');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    localStorage.setItem('relationshipAssessmentResults', JSON.stringify(results));
  }, [results]);

  const handleStartAssessment = (assessment: Assessment) => {
    playPop();
    setActiveAssessment(assessment);
    setViewState('assessment');
  };

  const handleAssessmentComplete = (answers: Record<string, number>) => {
    if (!activeAssessment) return;

    let totalScore = 0;
    let maxTotalScore = 0;
    const subCategoryScores: Record<string, { score: number; max: number }> = {};

    activeAssessment.questions.forEach(q => {
      const answerValue = answers[q.id] || 0;
      totalScore += answerValue;
      maxTotalScore += 100;

      if (!subCategoryScores[q.subCategoryId]) {
        subCategoryScores[q.subCategoryId] = { score: 0, max: 0 };
      }
      subCategoryScores[q.subCategoryId].score += answerValue;
      subCategoryScores[q.subCategoryId].max += 100;
    });

    const finalScore = Math.round((totalScore / maxTotalScore) * 100);

    const subCategories: SubCategory[] = activeAssessment.subCategoriesDef.map(def => {
      const scData = subCategoryScores[def.id];
      const scScore = scData ? Math.round((scData.score / scData.max) * 100) : 0;
      
      const isHigh = scScore >= 60;
      
      return {
        id: def.id,
        name: def.name,
        score: scScore,
        type: def.type,
        impact: isHigh ? def.impactHigh : def.impactLow,
        steps: isHigh ? def.stepsHigh : def.stepsLow
      };
    });

    const newResult: AssessmentResult = {
      assessmentId: activeAssessment.id,
      score: finalScore,
      subCategories,
      date: new Date().toISOString()
    };

    setResults(prev => ({
      ...prev,
      [activeAssessment.id]: newResult
    }));
    
    setCurrentResult(newResult);
    setViewState('result_summary');
    playLevelUp();
  };

  const getCardColors = (score: number | undefined | null, type: 'positive' | 'negative' = 'positive') => {
    if (score == null) {
      return {
        border: 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 border-b-gray-300 dark:border-b-gray-800',
        iconBg: 'bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10',
        iconText: 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white',
        cardBg: 'bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#151515]'
      };
    }
    const isGood = type === 'positive' ? score >= 75 : score <= 20;
    const isMid = type === 'positive' ? score >= 50 : score <= 70;

    if (isGood) {
      return {
        border: 'border-emerald-500/30 hover:border-emerald-500/50 border-b-emerald-800',
        iconBg: 'bg-emerald-500/20',
        iconText: 'text-emerald-600 dark:text-emerald-400',
        cardBg: 'bg-white dark:bg-gradient-to-br dark:from-[#0a1a12] dark:to-[#050d09]'
      };
    } else if (isMid) {
      return {
        border: 'border-blue-500/30 hover:border-blue-500/50 border-b-blue-800',
        iconBg: 'bg-blue-500/20',
        iconText: 'text-blue-600 dark:text-blue-400',
        cardBg: 'bg-white dark:bg-gradient-to-br dark:from-[#0a121a] dark:to-[#05090d]'
      };
    } else {
      return {
        border: 'border-orange-500/30 hover:border-orange-500/50 border-b-orange-800',
        iconBg: 'bg-orange-500/20',
        iconText: 'text-orange-600 dark:text-orange-400',
        cardBg: 'bg-white dark:bg-gradient-to-br dark:from-[#1a120a] dark:to-[#0d0905]'
      };
    }
  };

  const renderResultSummary = () => {
    if (!currentResult || !activeAssessment) return null;
    const Icon = IconMap[activeAssessment.iconName] || Heart;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto space-y-8 pb-20"
      >
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center bg-${activeAssessment.color}-500/10 text-${activeAssessment.color}-500 mb-6`}
          >
            <Icon size={40} />
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            نتيجة تقييم {activeAssessment.title}
          </h2>
          
          <AnimatedScore 
            score={currentResult.score} 
            color={activeAssessment.color} 
            type={activeAssessment.type} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentResult.subCategories.map((sub, idx) => {
            const subLevel = getLevel(sub.score, sub.type);
            return (
              <motion.div 
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="p-6 md:p-8 rounded-[32px] bg-white dark:bg-[#181818] border border-gray-100 dark:border-white/5 shadow-xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{sub.name}</h3>
                  <div className={`px-4 py-1 rounded-xl text-sm font-black bg-${subLevel.color}-500/10 text-${subLevel.color}-600 dark:text-${subLevel.color}-400 border border-${subLevel.color}-500/20`}>
                    {sub.score}%
                  </div>
                </div>
                
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <p className="text-gray-600 dark:text-gray-400 font-bold leading-relaxed text-sm md:text-base">{sub.impact}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-2 text-sm md:text-base">
                    <Target size={20} className="text-blue-500" />
                    خطوات مقترحة:
                  </h4>
                  <div className="space-y-3">
                    {sub.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl group hover:bg-blue-500/5 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 font-black text-sm">
                          {sIdx + 1}
                        </div>
                        <span className="font-bold text-sm md:text-base leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <Button 
            onClick={() => setViewState('dashboard')}
            className="flex-1 h-16 text-lg rounded-2xl font-black bg-gray-900 dark:bg-white text-white dark:text-black"
          >
            العودة للتقييمات
          </Button>
          <Button 
            onClick={() => handleStartAssessment(activeAssessment)}
            variant="outline"
            className="flex-1 h-16 text-lg rounded-2xl font-black border-2"
          >
            إعادة التقييم
          </Button>
        </div>
      </motion.div>
    );
  };

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {RELATIONSHIP_ASSESSMENTS.map((assessment, idx) => {
          const Icon = IconMap[assessment.iconName] || Heart;
          const result = results[assessment.id];
          const score = result?.score;
          const colors = getCardColors(score ?? null, assessment.type);

          return (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => score != null ? (setCurrentResult(results[assessment.id]), setActiveAssessment(assessment), setViewState('result_summary')) : handleStartAssessment(assessment)}
              className={`group relative p-6 md:p-8 rounded-[32px] border-b-8 transition-all duration-300 flex flex-col justify-center overflow-hidden cursor-pointer ${colors.cardBg} ${colors.border} shadow-xl hover:shadow-2xl hover:-translate-y-1`}
            >
              {/* Ethereal background for completed assessments */}
              {score != null && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      x: [0, 30, 0],
                      y: [0, 20, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[60px] ${colors.iconBg}`}
                  />
                </div>
              )}

              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 ${colors.iconBg} ${colors.iconText}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                      {assessment.title}
                    </h3>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                      {score != null ? `${score}% - ${getLevel(score, assessment.type).label}` : 'ابدأ التقييم الآن'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {score == null ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartAssessment(assessment);
                      }}
                      className="flex-1 h-12 md:h-14 bg-gray-900 dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>ابدأ الاختبار</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentResult(results[assessment.id]);
                          setActiveAssessment(assessment);
                          setViewState('result_summary');
                        }}
                        className="flex-1 h-12 md:h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg"
                      >
                        عرض النتيجة
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartAssessment(assessment);
                        }}
                        variant="outline"
                        className="w-12 h-12 md:w-14 md:h-14 shrink-0 flex items-center justify-center rounded-2xl border-2"
                      >
                        <Target className="w-5 h-5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {viewState === 'dashboard' && renderDashboard()}
        {viewState === 'assessment' && activeAssessment && (
          <AssessmentFlow
            assessment={activeAssessment}
            onComplete={handleAssessmentComplete}
            onClose={() => setViewState('dashboard')}
          />
        )}
        {viewState === 'result_summary' && renderResultSummary()}
      </AnimatePresence>
    </div>
  );
}
