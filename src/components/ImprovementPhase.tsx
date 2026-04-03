import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressPage } from './ProgressPage';
import { 
  Utensils, Droplets, Footprints, Flame, Check, 
  X, Trophy, Zap, Moon, BookOpen, ChevronDown, Circle, CheckCircle2,
  Wallet, TrendingUp, Target, Lightbulb, Heart, Smile, MonitorOff, MonitorPlay,
  Users, Phone, HeartHandshake, Shield, PenTool, Sun, Briefcase, Award,
  Sparkles, Wind, MessageCircle
} from 'lucide-react';
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';
import { playPop, playLevelUp } from '../utils/sounds';
import { playChildVoice } from '../utils/voice';
import { PrayerBenefitsPage } from './PrayerBenefitsPage';

interface HabitTask {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

interface HabitCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  target: number;
  current: number;
  unit: string;
  tasks: HabitTask[];
  rewardClaimed?: boolean;
}

interface Routine {
  id: string;
  title: string;
  description: string;
  categories: HabitCategory[];
}

const ROUTINES: Routine[] = [
  {
    id: 'mental_health',
    title: 'تعزيز صحتي النفسية',
    description: 'عادات يومية لتعزيز السلام الداخلي، التقدير الذاتي، والاستقرار النفسي',
    categories: [
      {
        id: 'positive_thinking',
        title: 'التفكير الإيجابي وحب الذات',
        icon: Sparkles,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        target: 4,
        current: 0,
        unit: 'ممارسة',
        tasks: [
          { id: 'pt1', title: 'كتابة 3 أشياء إيجابية', points: 1, completed: false },
          { id: 'pt2', title: 'استبدال فكرة سلبية', points: 1, completed: false },
          { id: 'sl1', title: 'كتابة 3 توكيدات', points: 1, completed: false },
          { id: 'sl2', title: 'تأمل ذاتي 5 دقائق', points: 1, completed: false },
        ]
      },
      {
        id: 'anxiety_management',
        title: 'إدارة القلق',
        icon: Wind,
        color: 'text-teal-500',
        bg: 'bg-teal-500/10',
        target: 2,
        current: 0,
        unit: 'تمرين',
        tasks: [
          { id: 'am1', title: 'تنفس عميق', points: 1, completed: false },
          { id: 'am2', title: 'الابتعاد عن الأخبار', points: 1, completed: false },
        ]
      },
      {
        id: 'emotional_expression',
        title: 'التعبير عن المشاعر',
        icon: MessageCircle,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
        target: 2,
        current: 0,
        unit: 'نشاط',
        tasks: [
          { id: 'ee1', title: 'التحدث مع شخص', points: 1, completed: false },
          { id: 'sl3', title: 'وقت لهواية تحبها', points: 1, completed: false },
        ]
      }
    ]
  },
  {
    id: 'faith',
    title: 'تعزيز إيماني',
    description: 'عادات للتقرب إلى الله وتعزيز الجانب الروحي',
    categories: [
      {
        id: 'prayers',
        title: 'الصلوات',
        icon: Moon,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        target: 5,
        current: 0,
        unit: 'صلاة',
        tasks: [
          { id: 'p1', title: 'الفجر', points: 1, completed: false },
          { id: 'p2', title: 'الظهر', points: 1, completed: false },
          { id: 'p3', title: 'العصر', points: 1, completed: false },
          { id: 'p4', title: 'المغرب', points: 1, completed: false },
          { id: 'p5', title: 'العشاء', points: 1, completed: false },
        ]
      },
      {
        id: 'quran',
        title: 'القرآن',
        icon: BookOpen,
        color: 'text-teal-500',
        bg: 'bg-teal-500/10',
        target: 1,
        current: 0,
        unit: 'ورد',
        tasks: [
          { id: 'q1', title: 'قراءة الورد اليومي', points: 5, completed: false },
        ]
      },
      {
        id: 'azkar',
        title: 'الأذكار',
        icon: Zap,
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        target: 2,
        current: 0,
        unit: 'مرة',
        tasks: [
          { id: 'az1', title: 'أذكار الصباح', points: 1, completed: false },
          { id: 'az2', title: 'أذكار المساء', points: 1, completed: false },
        ]
      }
    ]
  },
  {
    id: 'productivity',
    title: 'تعزيز الانتاجية',
    description: 'عادات لزيادة التركيز والإنجاز',
    categories: [
      {
        id: 'reading',
        title: 'القراءة',
        icon: BookOpen,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        target: 20,
        current: 0,
        unit: 'صفحة',
        tasks: [
          { id: 'r1', title: 'قراءة 20 صفحة', points: 20, completed: false },
        ]
      },
      {
        id: 'planning',
        title: 'التخطيط',
        icon: Check,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        target: 1,
        current: 0,
        unit: 'خطة',
        tasks: [
          { id: 'pl1', title: 'تخطيط مهام الغد', points: 1, completed: false },
        ]
      },
      {
        id: 'focus',
        title: 'التركيز',
        icon: Target,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        target: 2,
        current: 0,
        unit: 'جلسة',
        tasks: [
          { id: 'f1', title: 'تحديد أهم 3 مهام', points: 1, completed: false },
          { id: 'f2', title: 'عمل بتركيز (25 د)', points: 1, completed: false },
          { id: 'fo1', title: 'عمل عميق (45 د)', points: 1, completed: false },
          { id: 'fo2', title: 'عمل عميق (45 د)', points: 1, completed: false },
        ]
      },
      {
        id: 'achievements',
        title: 'الإنجازات',
        icon: Award,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        target: 1,
        current: 0,
        unit: 'إنجاز',
        tasks: [
          { id: 'ac1', title: 'توثيق إنجاز اليوم', points: 1, completed: false },
        ]
      }
    ]
  },
  {
    id: 'physical_health',
    title: 'تعزيز صحتي البدنية',
    description: 'عادات يومية لبناء جسد صحي ونشيط',
    categories: [
      {
        id: 'meals',
        title: 'التغذية',
        icon: Utensils,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        target: 3,
        current: 0,
        unit: 'وجبة',
        tasks: [
          { id: 'm1', title: 'إفطار غني بالبروتين', points: 1, completed: false },
          { id: 'm2', title: 'غداء متوازن', points: 1, completed: false },
          { id: 'm3', title: 'عشاء خفيف', points: 1, completed: false },
        ]
      },
      {
        id: 'water',
        title: 'شرب الماء',
        icon: Droplets,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        target: 8,
        current: 0,
        unit: 'كوب',
        tasks: [
          { id: 'w1', title: 'كوب عند الاستيقاظ', points: 1, completed: false },
          { id: 'w2', title: 'كوب قبل الوجبات', points: 3, completed: false },
          { id: 'w3', title: 'إكمال 2 لتر', points: 4, completed: false },
        ]
      },
      {
        id: 'steps',
        title: 'النشاط البدني',
        icon: Footprints,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        target: 5000,
        current: 0,
        unit: 'خطوة',
        tasks: [
          { id: 's1', title: 'مشي سريع 15 د', points: 1500, completed: false },
          { id: 's2', title: 'استخدام الدرج', points: 500, completed: false },
          { id: 's3', title: 'جولة مشي مسائية', points: 3000, completed: false },
        ]
      }
    ]
  },
  {
    id: 'relationships',
    title: 'تعزيز علاقاتي',
    description: 'عادات لتقوية الروابط مع العائلة والأصدقاء والمجتمع',
    categories: [
      {
        id: 'family',
        title: 'صلة الرحم',
        icon: Users,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        target: 1,
        current: 0,
        unit: 'اتصال',
        tasks: [
          { id: 'fam1', title: 'اتصال بالأهل', points: 1, completed: false },
        ]
      },
      {
        id: 'friends',
        title: 'الأصدقاء',
        icon: Phone,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        target: 1,
        current: 0,
        unit: 'تواصل',
        tasks: [
          { id: 'fr1', title: 'السؤال عن صديق', points: 1, completed: false },
        ]
      },
      {
        id: 'volunteering',
        title: 'العطاء',
        icon: HeartHandshake,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
        target: 1,
        current: 0,
        unit: 'عمل',
        tasks: [
          { id: 'vol1', title: 'مساعدة أو صدقة', points: 1, completed: false },
        ]
      }
    ]
  }
];

interface ImprovementPhaseProps {
  onActivityComplete?: (xp: number) => void;
}

export const CharacterSVG = ({ isCelebrating, isSad }: { isCelebrating: boolean, isSad: boolean }) => {
  const color = isSad ? "#64748b" : "#8b5cf6";
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_50px_rgba(139,92,246,0.6)] overflow-visible">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes spinAndTilt {
            0%, 80%, 100% { transform: rotate(0deg); }
            82% { transform: rotate(10deg); }
            84% { transform: rotate(-10deg); }
            86% { transform: rotate(0deg); }
            95% { transform: rotate(360deg); }
          }
          @keyframes blink {
            0%, 46%, 48%, 100% { transform: scaleY(1); }
            47% { transform: scaleY(0); }
          }
          @keyframes look {
            0%, 20%, 100% { transform: translate(0, 0); }
            25%, 45% { transform: translate(-6px, 2px); }
            50%, 70% { transform: translate(6px, -2px); }
          }
          @keyframes earWiggle {
            0%, 70%, 100% { transform: rotate(0deg); }
            75% { transform: rotate(20deg); }
            80% { transform: rotate(-20deg); }
            85% { transform: rotate(15deg); }
          }
          @keyframes laugh {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .char-wrapper { animation: spinAndTilt 15s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
          .char-float { animation: float 3s ease-in-out infinite; }
          .char-blink { animation: blink 4s infinite; transform-origin: center; transform-box: fill-box; }
          .char-look { animation: look 8s infinite; }
          .char-ear-l { animation: earWiggle 5s infinite; transform-origin: center; transform-box: fill-box; }
          .char-ear-r { animation: earWiggle 5s infinite; animation-delay: 0.2s; transform-origin: center; transform-box: fill-box; }
          .char-laugh { animation: laugh 0.6s infinite alternate; transform-origin: center; transform-box: fill-box; }
        `}
      </style>
      <g className="char-float">
        <g className="char-wrapper">
          <circle cx="100" cy="110" r="70" fill={color} />
          <circle cx="50" cy="60" r="22" fill={color} className="char-ear-l" />
          <circle cx="150" cy="60" r="22" fill={color} className="char-ear-r" />
          <circle cx="30" cy="120" r="18" fill={color} className="char-ear-l" style={{ animationDelay: '0.5s' }} />
          <circle cx="170" cy="120" r="18" fill={color} className="char-ear-r" style={{ animationDelay: '0.7s' }} />
          
          {/* Eyes/Mouth */}
          {isSad ? (
            <>
              <path d="M 65 90 Q 75 100 85 90" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 115 90 Q 125 100 135 90" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 80 140 Q 100 120 120 140" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
            </>
          ) : isCelebrating ? (
            <>
              {/* Happy closed eyes */}
              <path d="M 65 100 Q 75 90 85 100" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d="M 115 100 Q 125 90 135 100" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
              {/* Big Laughing Mouth */}
              <g className="char-laugh">
                <path d="M 80 125 Q 100 150 120 125 Z" fill="white" />
              </g>
            </>
          ) : (
            <>
              <g className="char-blink">
                <circle cx="75" cy="100" r="14" fill="white" />
                <circle cx="75" cy="100" r="6" fill="black" className="char-look" />
              </g>
              <g className="char-blink">
                <circle cx="125" cy="100" r="14" fill="white" />
                <circle cx="125" cy="100" r="6" fill="black" className="char-look" />
              </g>
              {/* Normal Smile */}
              <path d="M 85 125 Q 100 135 115 125" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
};

export const ImprovementPhase = ({ onActivityComplete }: ImprovementPhaseProps) => {
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('improvement_routines');
    const lastReset = localStorage.getItem('improvement_last_reset');
    const today = new Date().toDateString();

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // If it's a new day, reset tasks and rewardClaimed
        const shouldReset = lastReset !== today;
        if (shouldReset) {
          localStorage.setItem('improvement_last_reset', today);
        }

        // Merge saved state with initial state to restore icons
        return ROUTINES.map(initRoutine => {
          const savedRoutine = parsed.find((r: any) => r.id === initRoutine.id);
          if (savedRoutine) {
            return {
              ...initRoutine,
              categories: initRoutine.categories.map(initCat => {
                const savedCat = savedRoutine.categories.find((c: any) => c.id === initCat.id);
                if (savedCat) {
                  return {
                    ...initCat,
                    current: shouldReset ? 0 : savedCat.current,
                    rewardClaimed: shouldReset ? false : savedCat.rewardClaimed,
                    tasks: initCat.tasks.map(initTask => {
                      const savedTask = savedCat.tasks.find((t: any) => t.id === initTask.id);
                      return savedTask ? { ...initTask, completed: shouldReset ? false : savedTask.completed } : initTask;
                    })
                  };
                }
                return initCat;
              })
            };
          }
          return initRoutine;
        });
      } catch (e) {
        console.error('Failed to parse saved routines', e);
      }
    }
    
    localStorage.setItem('improvement_last_reset', today);
    return ROUTINES;
  });

  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(() => {
    return localStorage.getItem('improvement_selected_routine') || ROUTINES[0].id;
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);

  useEffect(() => {
    // Save to localStorage without the icon components
    const toSave = routines.map(r => ({
      id: r.id,
      categories: r.categories.map(cat => ({
        id: cat.id,
        current: cat.current,
        rewardClaimed: cat.rewardClaimed,
        tasks: cat.tasks.map(t => ({ id: t.id, completed: t.completed }))
      }))
    }));
    localStorage.setItem('improvement_routines', JSON.stringify(toSave));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('improvement_selected_routine', selectedRoutineId);
  }, [selectedRoutineId]);

  const activeRoutine = routines.find(r => r.id === selectedRoutineId) || routines[0];
  const categories = activeRoutine.categories;

  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | null>(null);
  const [showTasks, setShowTasks] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isSad, setIsSad] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);
  const [idleMessage, setIdleMessage] = useState<string | null>(null);
  const celebrationTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [showBenefits, setShowBenefits] = useState(false);

  const [joinDate, setJoinDate] = useState(() => {
    const saved = localStorage.getItem('user_join_date');
    if (!saved) {
      const now = new Date().toISOString();
      localStorage.setItem('user_join_date', now);
      return now;
    }
    return saved;
  });

  const [monthlyPrayerCount, setMonthlyPrayerCount] = useState(() => {
    const saved = localStorage.getItem('monthly_prayer_count');
    const lastMonth = localStorage.getItem('monthly_prayer_month');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthKey = `${currentYear}-${currentMonth}`;
    
    if (lastMonth !== monthKey) {
      localStorage.setItem('monthly_prayer_month', monthKey);
      localStorage.setItem('monthly_prayer_count', '0');
      return 0;
    }
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('monthly_prayer_count', monthlyPrayerCount.toString());
  }, [monthlyPrayerCount]);

  // Idle messages logic
  useEffect(() => {
    const messages = [
      "ابدأ درس جديد يا بطل!",
      "أنا فخور بك جداً!",
      "يلا نتعلم حاجة جديدة اليوم!",
      "أنت بتعمل مجهود رائع!",
      "مستعد لتحدي جديد؟"
    ];

    const interval = setInterval(() => {
      if (!isCelebrating && !showTasks) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setIdleMessage(randomMsg);
        playChildVoice(randomMsg);
        
        setTimeout(() => {
          setIdleMessage(null);
        }, 4000);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [isCelebrating, showTasks]);

  const handleCloseTasks = (overrideDuration?: number) => {
    setShowTasks(false);
    if (overrideDuration && overrideDuration > 0) {
      const msg = "أنت رائع! انا فخور بك";
      setCelebrationMessage(msg);
      setIsCelebrating(true);
      playLevelUp();
      
      // Add confetti burst when closing the slide
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#eab308']
      });

      // Speak the exact message
      playChildVoice(msg);

      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }

      // Celebration effects for the specified duration
      celebrationTimeoutRef.current = setTimeout(() => {
        setIsCelebrating(false);
        setCelebrationMessage(null);
      }, overrideDuration);
    }
  };

  const handleClaimReward = (categoryId: string) => {
    setRoutines(prevRoutines => prevRoutines.map(routine => {
      if (routine.id !== selectedRoutineId) return routine;
      return {
        ...routine,
        categories: routine.categories.map(cat => 
          cat.id === categoryId ? { ...cat, rewardClaimed: true } : cat
        )
      };
    }));
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(prev => prev ? { ...prev, rewardClaimed: true } : prev);
    }
    
    playLevelUp();
    handleCloseTasks(3000);
    
    // Continuous confetti for 3 seconds
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#eab308', '#f59e0b', '#fbbf24', '#a855f7', '#ec4899']
      });
    }, 250);
  };

  const handleToggleTask = (categoryId: string, taskId: string) => {
    let justCompleted = false;
    let isFullyCompleted = false;
    let updatedCat: HabitCategory | null = null;

    const newRoutines = routines.map(routine => {
      if (routine.id !== selectedRoutineId) return routine;

      const newCategories = routine.categories.map(cat => {
        if (cat.id === categoryId) {
          const newTasks = cat.tasks.map(task => {
            if (task.id === taskId) {
              const willBeCompleted = !task.completed;
              if (willBeCompleted) {
                justCompleted = true;
                if (categoryId === 'prayers') {
                  setMonthlyPrayerCount(prev => prev + 1);
                  // Detailed tracking
                  const stats = JSON.parse(localStorage.getItem('prayer_stats') || '{"total":0, "monthly":0, "fajr":0, "dhuhr":0, "asr":0, "maghrib":0, "isha":0, "azkar_morning":0, "azkar_evening":0}');
                  stats.total += 1;
                  stats.monthly += 1;
                  if (taskId === 'p1') stats.fajr += 1;
                  if (taskId === 'p2') stats.dhuhr += 1;
                  if (taskId === 'p3') stats.asr += 1;
                  if (taskId === 'p4') stats.maghrib += 1;
                  if (taskId === 'p5') stats.isha += 1;
                  localStorage.setItem('prayer_stats', JSON.stringify(stats));
                }
                if (categoryId === 'azkar') {
                  const stats = JSON.parse(localStorage.getItem('prayer_stats') || '{"total":0, "monthly":0, "fajr":0, "dhuhr":0, "asr":0, "maghrib":0, "isha":0, "azkar_morning":0, "azkar_evening":0}');
                  if (taskId === 'az1') stats.azkar_morning += 1;
                  if (taskId === 'az2') stats.azkar_evening += 1;
                  localStorage.setItem('prayer_stats', JSON.stringify(stats));
                }
              } else {
                if (categoryId === 'prayers') {
                  setMonthlyPrayerCount(prev => Math.max(0, prev - 1));
                  const stats = JSON.parse(localStorage.getItem('prayer_stats') || '{"total":0, "monthly":0, "fajr":0, "dhuhr":0, "asr":0, "maghrib":0, "isha":0, "azkar_morning":0, "azkar_evening":0}');
                  stats.total = Math.max(0, stats.total - 1);
                  stats.monthly = Math.max(0, stats.monthly - 1);
                  if (taskId === 'p1') stats.fajr = Math.max(0, stats.fajr - 1);
                  if (taskId === 'p2') stats.dhuhr = Math.max(0, stats.dhuhr - 1);
                  if (taskId === 'p3') stats.asr = Math.max(0, stats.asr - 1);
                  if (taskId === 'p4') stats.maghrib = Math.max(0, stats.maghrib - 1);
                  if (taskId === 'p5') stats.isha = Math.max(0, stats.isha - 1);
                  localStorage.setItem('prayer_stats', JSON.stringify(stats));
                }
                if (categoryId === 'azkar') {
                  const stats = JSON.parse(localStorage.getItem('prayer_stats') || '{"total":0, "monthly":0, "fajr":0, "dhuhr":0, "asr":0, "maghrib":0, "isha":0, "azkar_morning":0, "azkar_evening":0}');
                  if (taskId === 'az1') stats.azkar_morning = Math.max(0, stats.azkar_morning - 1);
                  if (taskId === 'az2') stats.azkar_evening = Math.max(0, stats.azkar_evening - 1);
                  localStorage.setItem('prayer_stats', JSON.stringify(stats));
                }
              }
              return { ...task, completed: willBeCompleted };
            }
            return task;
          });
          
          const newCurrent = newTasks.reduce((acc, t) => t.completed ? acc + t.points : acc, 0);
          isFullyCompleted = newCurrent >= cat.target;
          
          const newCat = { ...cat, tasks: newTasks, current: Math.min(newCurrent, cat.target) };
          updatedCat = newCat;
          return newCat;
        }
        return cat;
      });

      return { ...routine, categories: newCategories };
    });

    setRoutines(newRoutines);

    if (justCompleted) {
      playPop();
      onActivityComplete?.(10); // Award 10 XP for completing a task
      
      const msg = isFullyCompleted ? "أنت بطل! لقد أنجزت كل المهام بنجاح" : "عمل رائع! استمر يا بطل";
      setCelebrationMessage(msg);
      setIsCelebrating(true);
      playChildVoice(msg);
      
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }

      celebrationTimeoutRef.current = setTimeout(() => {
        setIsCelebrating(false);
        setCelebrationMessage(null);
      }, 3000);
    }

    if (updatedCat && selectedCategory?.id === categoryId) {
      setSelectedCategory(updatedCat);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-0 md:py-4 px-0 md:px-6 space-y-6 md:space-y-8 overflow-visible">
      {/* Character Section */}
      <div className={`relative flex flex-col items-center w-full overflow-visible pt-0 transition-all duration-500 ${isCelebrating ? 'z-[130]' : 'z-10'}`}>
        <div className="absolute inset-0 flex items-center justify-center -z-10 overflow-visible">
          <div className="w-64 h-64 md:w-[600px] md:h-[600px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[150px] animate-pulse" />
        </div>
        
        <motion.div
          animate={{
            y: (isCelebrating || idleMessage) ? 0 : 40
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative mb-8 md:mb-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.02, 1],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 relative">
                <CharacterSVG isCelebrating={isCelebrating || !!idleMessage} isSad={isSad && !isCelebrating && !idleMessage} />
            </div>
          </motion.div>

          <AnimatePresence>
            {(isCelebrating || idleMessage) && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                className="absolute top-full mt-2 md:mt-3 left-1/2 -translate-x-1/2 bg-white dark:bg-purple-600 text-purple-600 dark:text-white px-4 py-2 md:px-5 md:py-2 rounded-2xl font-black text-sm md:text-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] z-50 whitespace-nowrap transition-colors duration-300"
              >
                {isCelebrating ? celebrationMessage : idleMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="mt-4 text-center">
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2 md:mb-3">مرحلة التطوير الذاتي</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-base max-w-xl mx-auto leading-relaxed mb-6">أنا مدربك الشخصي، سأساعدك في بناء عاداتك الجديدة خطوة بخطوة</p>
          
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => setIsDropdownOpen(true)}
              className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-6 py-3 rounded-full text-gray-900 dark:text-white transition-all"
            >
              <span className="font-bold">{activeRoutine.title}</span>
              <ChevronDown size={18} className="text-gray-400" />
            </button>
            <button 
              onClick={() => setIsProgressOpen(true)}
              className="inline-flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 px-4 py-3 rounded-full text-purple-600 dark:text-purple-300 transition-all"
            >
              <TrendingUp size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Habit Circles */}
      <div className="grid grid-cols-3 gap-2 md:gap-6 w-full max-w-5xl px-2 md:px-8">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory(cat);
              setShowTasks(true);
            }}
            className="flex flex-col items-center gap-3 md:gap-4 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-all group relative overflow-hidden shadow-sm dark:shadow-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 dark:from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-12 h-12 md:w-24 md:h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" viewBox="0 0 80 80">
                <circle
                  cx="40" cy="40" r="36"
                  className="stroke-gray-100 dark:stroke-white/5 fill-none"
                  strokeWidth="5"
                />
                <motion.circle
                  cx="40" cy="40" r="36"
                  className={`fill-none ${cat.color.replace('text', 'stroke')}`}
                  strokeWidth="5"
                  strokeDasharray="226"
                  initial={{ strokeDashoffset: 226 }}
                  animate={{ strokeDashoffset: 226 - (226 * (cat.current / cat.target)) }}
                  strokeLinecap="round"
                />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center ${cat.color}`}>
                <cat.icon className="w-5 h-5 md:w-10 md:h-10" />
              </div>
            </div>
            <div className="text-center overflow-hidden w-full relative z-10">
              <span className="text-[10px] md:text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-tighter md:tracking-[0.15em] block mb-1 md:mb-2 truncate">{cat.title}</span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm md:text-2xl font-black text-gray-900 dark:text-white">{cat.current}/{cat.target}</span>
                <span className="text-[10px] md:text-xs text-gray-400 dark:text-white/20 font-medium">{cat.unit}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Progress Page Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isProgressOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white dark:bg-[#121212] z-[130] p-6 overflow-y-auto transition-colors duration-300"
            >
              <div className="text-gray-900 dark:text-white">
                <ProgressPage routines={routines} onClose={() => setIsProgressOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Routine Selection Slide/Drawer */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isDropdownOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDropdownOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 rounded-t-[3rem] z-[120] p-6 max-h-[80vh] overflow-y-auto transition-colors duration-300"
              >
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-6" />
                
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-black text-gray-900 dark:text-white">اختر الروتين</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">اختر مجموعة العادات التي ترغب في التركيز عليها</p>
                  </div>
                  <button 
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center text-gray-900 dark:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {routines.map((routine) => {
                    const isSelected = routine.id === selectedRoutineId;
                    
                    // Calculate overall progress for the routine
                    const totalTasks = routine.categories.reduce((acc, cat) => acc + cat.target, 0);
                    const completedTasks = routine.categories.reduce((acc, cat) => acc + cat.current, 0);
                    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    return (
                      <motion.button
                        key={routine.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedRoutineId(routine.id);
                          setSelectedCategory(null);
                          setShowTasks(false);
                          setIsDropdownOpen(false);
                          playPop();
                        }}
                        className={`w-full p-4 rounded-2xl border transition-all text-right relative overflow-hidden ${
                          isSelected 
                            ? 'bg-purple-500/10 border-purple-500/30' 
                            : 'bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`mt-1 ml-4 flex-shrink-0 ${isSelected ? 'text-purple-500' : 'text-emerald-500'}`}>
                            {isSelected ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </div>
                          <div className="flex-1">
                            <h5 className={`font-bold text-lg ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-white'}`}>
                              {routine.title}
                            </h5>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">
                              {routine.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${isSelected ? 'bg-purple-500' : 'bg-emerald-500'}`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-emerald-600 dark:text-emerald-500'}`}>
                            {progressPercent}%
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Task Slide/Drawer */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showTasks && selectedCategory && (
            <>
              <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleCloseTasks()}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 rounded-t-[3rem] z-[120] p-6 max-h-[80vh] overflow-y-auto transition-colors duration-300"
            >
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${selectedCategory.bg} flex items-center justify-center ${selectedCategory.color}`}>
                    <selectedCategory.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 dark:text-white">{selectedCategory.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs text-right">أكمل المهام لزيادة تقدمك اليومي</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleCloseTasks()}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center text-gray-900 dark:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {selectedCategory.id === 'prayers' && (() => {
                const now = new Date();
                const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
                const currentDay = now.getDate();
                
                const joinDateObj = new Date(joinDate);
                const isFirstMonth = joinDateObj.getMonth() === now.getMonth() && joinDateObj.getFullYear() === now.getFullYear();
                
                let totalMonthlyPrayers;
                if (isFirstMonth) {
                  const remainingDays = (daysInMonth - joinDateObj.getDate()) + 1;
                  totalMonthlyPrayers = remainingDays * 5;
                } else {
                  totalMonthlyPrayers = daysInMonth * 5;
                }
                
                const monthlyProgress = Math.round((monthlyPrayerCount / totalMonthlyPrayers) * 100);
                const remainingDaysCount = daysInMonth - currentDay;
                
                return (
                  <div className="mb-6 bg-black/20 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 backdrop-blur-sm w-full">
                    <div className="flex items-center">
                      <div className="flex-1 text-center space-y-1">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-xl sm:text-2xl md:text-3xl font-black text-white">{monthlyProgress}%</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          إنجاز الشهر
                        </p>
                      </div>
                      
                      <div className="h-10 md:h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                      
                      <div className="flex-1 text-center space-y-1">
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span className="text-xl sm:text-2xl md:text-3xl font-black text-indigo-400">{monthlyPrayerCount}</span>
                          <span className="text-gray-500 text-sm sm:text-base font-bold">/ {totalMonthlyPrayers}</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          الصلوات
                        </p>
                      </div>

                      <div className="h-10 md:h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                      
                      <div className="flex-1 text-center space-y-1">
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-400">{remainingDaysCount}</span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          أيام متبقية
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-3">
                {selectedCategory.tasks.map((task) => (
                  <motion.button
                    key={task.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleToggleTask(selectedCategory.id, task.id)}
                    className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between text-right ${
                      task.completed 
                        ? 'bg-emerald-500/10 border-emerald-500/20' 
                        : 'bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 dark:border-white/10'
                      }`}>
                        {task.completed && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span className={`font-bold text-sm ${task.completed ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-900 dark:text-white'}`}>
                        {task.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {(() => {
                const progressPercent = Math.min(100, Math.round((selectedCategory.current / selectedCategory.target) * 100));
                const isCompleted = progressPercent >= 100;
                const isClaimed = selectedCategory.rewardClaimed;

                return (
                  <motion.div 
                    animate={isCompleted && !isClaimed ? { 
                      scale: [1, 1.02, 1], 
                      boxShadow: ["0px 0px 0px rgba(234,179,8,0)", "0px 0px 20px rgba(234,179,8,0.3)", "0px 0px 0px rgba(234,179,8,0)"] 
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`mt-4 p-4 rounded-[1.5rem] border relative overflow-hidden ${isCompleted ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' : 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-gray-200 dark:border-white/5'}`}
                  >
                    {/* Progress Bar Background */}
                    <div 
                      className="absolute top-0 right-0 bottom-0 bg-gray-900/5 dark:bg-white/5 transition-all duration-1000 ease-out" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          <Trophy size={20} />
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white font-bold text-sm">مكافأة الاستمرار</p>
                          <p className={`${isCompleted ? 'text-yellow-700 dark:text-yellow-200/80' : 'text-gray-500'} text-[10px]`}>
                            {isClaimed ? 'تم تحصيل المكافأة بنجاح!' : 'أكمل جميع المهام لتحصل على 50 نقطة XP'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {isClaimed ? (
                          <span className="text-sm font-black text-yellow-600 dark:text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-full">
                            <Check size={16} strokeWidth={3} /> تم
                          </span>
                        ) : isCompleted ? (
                          <button 
                            onClick={() => handleClaimReward(selectedCategory.id)} 
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs px-4 py-2 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all active:scale-95"
                          >
                            تحصيل
                          </button>
                        ) : (
                          <span className="text-xl font-black text-gray-900 dark:text-white">
                            {progressPercent}%
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Thin Progress line at the bottom */}
                    {!isCompleted && (
                      <div className="absolute bottom-0 right-0 left-0 h-1 bg-gray-900/5 dark:bg-white/5">
                        <div className="h-full bg-blue-500 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
                      </div>
                    )}
                  </motion.div>
                );
              })()}

              {selectedCategory.id === 'prayers' && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBenefits(true)}
                  className="mt-6 w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center gap-3 text-indigo-400 font-black hover:from-indigo-500/30 hover:to-purple-500/30 transition-all"
                >
                  <BookOpen size={20} />
                  <span>الأجر والفوائد</span>
                </motion.button>
              )}

              <AnimatePresence>
                {showBenefits && (
                  <PrayerBenefitsPage onClose={() => setShowBenefits(false)} />
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
};
