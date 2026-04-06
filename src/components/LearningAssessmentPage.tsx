import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Target, 
  CheckCircle2, 
  ChevronRight,
  BookOpen,
  GraduationCap,
  X,
  Activity,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/Button';
import AssessmentFlow from './AssessmentFlow';
import { LEARNING_ASSESSMENTS } from '../data/learningAssessmentsData';
import { Assessment } from '../data/workAssessmentsData';
import { playPop, playLevelUp } from '../utils/sounds';

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

const IconMap: Record<string, any> = {
  Brain,
  BookOpen,
  GraduationCap
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

export default function LearningAssessmentPage() {
  const [viewState, setViewState] = useState<'dashboard' | 'assessment' | 'results' | 'result_summary'>('dashboard');
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [resultStep, setResultStep] = useState(0);
  const [results, setResults] = useState<Record<string, AssessmentResult>>(() => {
    const saved = localStorage.getItem('learningAssessmentResults');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    localStorage.setItem('learningAssessmentResults', JSON.stringify(results));
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

    setResults(prev => ({ ...prev, [activeAssessment.id]: newResult }));
    setCurrentResult(newResult);
    if (subCategories.length > 1) {
      setViewState('result_summary');
    } else {
      setResultStep(0);
      setViewState('results');
    }
    playLevelUp();
  };

  const getCardColors = (score: number | null, type: 'positive' | 'negative' = 'positive') => {
    if (score === null) return { 
      border: 'border-gray-200 dark:border-white/10', 
      iconBg: 'bg-gray-100 dark:bg-white/5', 
      iconText: 'text-gray-500',
      cardBg: 'bg-white dark:bg-[#181818]'
    };
    
    const isGood = type === 'positive' ? score >= 75 : score <= 20;
    const isMid = type === 'positive' ? score >= 50 : score <= 70;

    if (isGood) return { 
      border: 'border-emerald-500/30', 
      iconBg: 'bg-emerald-500/20', 
      iconText: 'text-emerald-500',
      cardBg: 'bg-emerald-500/5 dark:bg-emerald-500/5'
    };
    if (isMid) return { 
      border: 'border-blue-500/30', 
      iconBg: 'bg-blue-500/20', 
      iconText: 'text-blue-500',
      cardBg: 'bg-blue-500/5 dark:bg-blue-500/5'
    };
    return { 
      border: 'border-orange-500/30', 
      iconBg: 'bg-orange-500/20', 
      iconText: 'text-orange-500',
      cardBg: 'bg-orange-500/5 dark:bg-orange-500/5'
    };
  };

  const renderResultSummary = () => {
    if (!currentResult || !activeAssessment) return null;
    const score = currentResult.score;
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
              setViewState('dashboard');
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
              <h3 className="text-lg font-black text-white text-right mb-3">تحليل التقييم</h3>
              {currentResult.subCategories.map((sub, i) => (
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
                setResultStep(0);
                setViewState('results');
              }}
              className={`flex-1 h-12 rounded-2xl font-black text-sm bg-${activeAssessment.color}-600 hover:bg-${activeAssessment.color}-500 text-white shadow-lg shadow-${activeAssessment.color}-500/20 transition-all`}
            >
              عرض النتيجة
            </Button>
            <Button
              onClick={() => {
                playPop();
                handleStartAssessment(activeAssessment);
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
    if (!currentResult || !activeAssessment) return null;
    const subCategories = currentResult.subCategories;
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
                  {sub.steps.map((step, i) => (
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
        <div className={`absolute inset-0 bg-${activeAssessment.color}-500/5 opacity-30 blur-[120px] pointer-events-none`} />
        <div className="absolute inset-0 bg-atmospheric opacity-40 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between p-4 md:p-6 gap-6">
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                playPop();
                setViewState('dashboard');
              }}
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/10 p-0"
            >
              <X size={20} />
            </Button>
          </div>
          
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

        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent backdrop-blur-sm border-t border-white/5">
            <div className="max-w-3xl mx-auto flex gap-4">
              {totalSteps === 1 ? (
                <Button
                  onClick={() => {
                    playPop();
                    handleStartAssessment(activeAssessment);
                  }}
                  variant="ghost"
                  className="flex-1 h-14 rounded-2xl font-black text-lg transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10"
                >
                  <Target size={20} className="ml-2" />
                  إعادة الاختبار
                </Button>
              ) : (
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
              )}
              
              {resultStep < totalSteps - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="primary"
                  className="flex-1 h-14 rounded-2xl font-black text-lg transition-all shadow-xl bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                >
                  التالي
                  <ArrowLeft size={20} className="mr-2" />
                </Button>
              ) : (
                <Button
                  onClick={() => setViewState('dashboard')}
                  variant="primary"
                  className={`flex-1 h-14 rounded-2xl font-black text-lg transition-all shadow-xl bg-${activeAssessment.color}-600 hover:bg-${activeAssessment.color}-500 text-white shadow-${activeAssessment.color}-500/20`}
                >
                  إنهاء
                  <CheckCircle2 size={20} className="mr-2" />
                </Button>
              )}
            </div>
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
        {LEARNING_ASSESSMENTS.map((assessment, idx) => {
          const result = results[assessment.id];
          const isCompleted = result != null;
          const score = result?.score;
          const colors = getCardColors(score ?? null, assessment.type);

          return (
            <div key={assessment.id} className="space-y-4">
              {isCompleted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    playPop();
                    const res = results[assessment.id];
                    setCurrentResult(res);
                    setActiveAssessment(assessment);
                    if (res.subCategories.length > 1) {
                      setViewState('result_summary');
                    } else {
                      setResultStep(0);
                      setViewState('results');
                    }
                  }}
                  className={`relative group cursor-pointer bg-white dark:bg-[#181818] p-4 md:p-6 rounded-3xl border-2 border-b-4 ${colors.border} transition-all hover:-translate-y-1 active:translate-y-0 active:border-b-2`}
                >
                  <div className={`absolute inset-0 bg-${assessment.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colors.iconBg} ${colors.iconText}`}>
                        {(() => {
                          const IconComponent = IconMap[assessment.iconName] || Brain;
                          return <IconComponent className="w-6 h-6" />;
                        })()}
                      </div>
                      <div>
                        <h3 className={`text-lg md:text-xl font-black ${colors.iconText} mb-1`}>{assessment.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-bold">
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
                  onClick={() => handleStartAssessment(assessment)}
                  className="relative group cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-${assessment.color}-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`relative bg-white dark:bg-[#181818] border-2 border-b-4 border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden hover:border-${assessment.color}-500/50 dark:hover:border-${assessment.color}-500/50 transition-colors active:border-b-2 active:translate-y-[2px]`}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-${assessment.color}-500/10 text-${assessment.color}-500`}>
                          {(() => {
                            const IconComponent = IconMap[assessment.iconName] || Brain;
                            return <IconComponent className="w-6 h-6" />;
                          })()}
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">{assessment.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">اكتشف صحتك في {assessment.title}</p>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartAssessment(assessment);
                        }}
                        className={`w-full md:w-auto h-10 px-6 rounded-xl font-black text-xs bg-${assessment.color}-600 hover:bg-${assessment.color}-500 text-white shadow-md shadow-${assessment.color}-500/20`}
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
        {viewState === 'results' && renderResults()}
      </AnimatePresence>
    </div>
  );
}
