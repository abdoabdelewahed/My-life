import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ProgressPage } from './ProgressPage';
import { 
  Utensils, Droplets, Footprints, Flame, Check, 
  X, Trophy, Zap, Moon, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Circle, CheckCircle2,
  Wallet, TrendingUp, Target, Lightbulb, Heart, Smile, MonitorOff, MonitorPlay,
  Users, Phone, HeartHandshake, Shield, PenTool, Sun, Briefcase, Award,
  Sparkles, Wind, MessageCircle, Plus, Edit2, Save, Trash2,
  Settings2, Volume2, VolumeX, Palette, User
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const AVAILABLE_ICONS = [
  'Sun', 'Moon', 'Star', 'Zap', 'Heart', 'Smile', 'Briefcase', 'Coffee', 'Book', 'Music', 
  'Activity', 'Anchor', 'Award', 'Bell', 'Camera', 'Cloud', 'Compass', 'Feather', 'Flag', 
  'Gift', 'Key', 'Leaf', 'Map', 'Target', 'Umbrella', 'Watch', 'Sparkles', 'Wind', 'MessageCircle',
  'Utensils', 'Droplets', 'Footprints', 'Users', 'Phone', 'HeartHandshake'
];
import { Button } from './ui/Button';
import confetti from 'canvas-confetti';
import { playPop, playLevelUp } from '../utils/sounds';
import { playWomanVoice } from '../utils/voice';
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
  iconName: string;
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
  iconName?: string;
  categories: HabitCategory[];
}

interface CharacterMessages {
  mental_health: string[];
  faith: string[];
  productivity: string[];
  default: string[];
  celebration: {
    generic: string;
    completed: string;
    partial: string;
  };
}

const ROUTINES: Routine[] = [
  {
    id: 'morning_routine',
    title: 'روتين صباحي',
    description: 'عادات لبداية يوم مشرق ومليء بالطاقة',
    iconName: 'Sun',
    categories: [
      {
        id: 'morning_wakeup',
        title: 'الاستيقاظ',
        iconName: 'Sun',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        target: 3,
        current: 0,
        unit: 'مهمة',
        tasks: [
          { id: 'mw1', title: 'ترتيب السرير', points: 1, completed: false },
          { id: 'mw2', title: 'شرب كوب ماء', points: 1, completed: false },
          { id: 'mw3', title: 'تأمل 5 دقائق', points: 1, completed: false },
        ]
      },
      {
        id: 'morning_activity',
        title: 'النشاط',
        iconName: 'Zap',
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        target: 2,
        current: 0,
        unit: 'مهمة',
        tasks: [
          { id: 'ma1', title: 'تمرين رياضي خفيف', points: 2, completed: false },
          { id: 'ma2', title: 'قراءة صفحتين', points: 1, completed: false },
        ]
      }
    ]
  },
  {
    id: 'evening_routine',
    title: 'روتين مسائي',
    description: 'عادات لختام اليوم باسترخاء واستعداد للغد',
    iconName: 'Moon',
    categories: [
      {
        id: 'evening_relax',
        title: 'الاسترخاء',
        iconName: 'Moon',
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        target: 3,
        current: 0,
        unit: 'مهمة',
        tasks: [
          { id: 'er1', title: 'إغلاق الشاشات', points: 1, completed: false },
          { id: 'er2', title: 'قراءة كتاب', points: 2, completed: false },
          { id: 'er3', title: 'كتابة يوميات', points: 1, completed: false },
        ]
      },
      {
        id: 'evening_prep',
        title: 'الاستعداد للنوم',
        iconName: 'Briefcase',
        color: 'text-teal-500',
        bg: 'bg-teal-500/10',
        target: 2,
        current: 0,
        unit: 'مهمة',
        tasks: [
          { id: 'ep1', title: 'تجهيز ملابس الغد', points: 1, completed: false },
          { id: 'ep2', title: 'العناية الشخصية', points: 1, completed: false },
        ]
      }
    ]
  },
  {
    id: 'mental_health',
    title: 'تعزيز صحتي النفسية',
    description: 'عادات يومية لتعزيز السلام الداخلي، التقدير الذاتي، والاستقرار النفسي',
    categories: [
      {
        id: 'positive_thinking',
        title: 'التفكير الإيجابي وحب الذات',
        iconName: 'Sparkles',
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
        iconName: 'Wind',
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
        iconName: 'MessageCircle',
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
        iconName: 'Moon',
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
        iconName: 'BookOpen',
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
        iconName: 'Zap',
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
        iconName: 'BookOpen',
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
        iconName: 'Check',
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
        iconName: 'Target',
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
        iconName: 'Award',
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
        iconName: 'Utensils',
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
        iconName: 'Droplets',
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
        iconName: 'Footprints',
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
        iconName: 'Users',
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
        iconName: 'Phone',
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
        iconName: 'HeartHandshake',
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
  },
  {
    id: 'financial_capability',
    title: 'تعزيز القدرة المالية',
    description: 'عادات لإدارة أموالك بذكاء، التوفير، والاستثمار في مستقبلك المالي',
    iconName: 'Wallet',
    categories: [
      {
        id: 'financial_habits',
        title: 'الإدارة المالية الذكية',
        iconName: 'Wallet',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        target: 4,
        current: 0,
        unit: 'مهمة',
        tasks: [
          { id: 'fh1', title: 'تسجيل المصاريف اليومية', points: 1, completed: false },
          { id: 'fh2', title: 'تخصيص مبلغ للادخار', points: 1, completed: false },
          { id: 'fh3', title: 'مراجعة الميزانية الأسبوعية', points: 1, completed: false },
          { id: 'fh4', title: 'قراءة مقال عن الاستثمار', points: 1, completed: false },
        ]
      }
    ]
  }
];

interface ImprovementPhaseProps {
  onActivityComplete?: (xp: number) => void;
}

import { SarahChar, CharacterState } from './SarahChar';
import { DuoChar } from './DuoChar';

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
        const merged = ROUTINES.map(initRoutine => {
          const savedRoutine = parsed.find((r: any) => r.id === initRoutine.id);
          if (savedRoutine) {
            // Get all categories from saved state that are not in initial state (custom categories)
            const customCategories = savedRoutine.categories.filter((sc: any) => 
              !initRoutine.categories.some(ic => ic.id === sc.id)
            );

            return {
              ...initRoutine,
              categories: [
                ...initRoutine.categories.map(initCat => {
                  const savedCat = savedRoutine.categories.find((c: any) => c.id === initCat.id);
                  if (savedCat) {
                    return {
                      ...initCat,
                      current: shouldReset ? 0 : (Number(savedCat.current) || 0),
                      target: Number(savedCat.target) || initCat.target || 0,
                      rewardClaimed: shouldReset ? false : !!savedCat.rewardClaimed,
                      tasks: (savedCat.tasks || []).map((t: any) => {
                        const initTask = initCat.tasks.find((it: any) => it.id === t.id);
                        return {
                          ...t,
                          title: t.title || (initTask ? initTask.title : 'مهمة بدون عنوان')
                        };
                      })
                    };
                  }
                  return initCat;
                }),
                ...customCategories.map((cc: any) => ({
                  ...cc,
                  current: shouldReset ? 0 : (Number(cc.current) || 0),
                  rewardClaimed: shouldReset ? false : !!cc.rewardClaimed,
                  tasks: (cc.tasks || []).map((t: any) => ({
                    ...t,
                    title: t.title || 'مهمة بدون عنوان'
                  }))
                }))
              ]
            };
          }
          return initRoutine;
        });

        // Add custom routines and ensure tasks have titles and valid numbers
        const customRoutines = parsed.filter((r: any) => !ROUTINES.some(init => init.id === r.id)).map((r: any) => ({
          ...r,
          categories: r.categories.map((c: any) => ({
            ...c,
            current: Number(c.current) || 0,
            target: Number(c.target) || (c.tasks ? c.tasks.length : 0),
            tasks: (c.tasks || []).map((t: any) => ({
              ...t,
              title: t.title || 'مهمة بدون عنوان'
            }))
          }))
        }));
        
        // Reset tasks in custom routines if needed
        if (shouldReset) {
          customRoutines.forEach((r: any) => {
            r.categories.forEach((c: any) => {
              c.current = 0;
              c.rewardClaimed = false;
              c.tasks.forEach((t: any) => t.completed = false);
            });
          });
        }

        return [...merged, ...customRoutines];
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

  const [isAddingRoutine, setIsAddingRoutine] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newRoutineTitle, setNewRoutineTitle] = useState('');
  const [newRoutineDesc, setNewRoutineDesc] = useState('');
  const [newRoutineIcon, setNewRoutineIcon] = useState('Star');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Star');
  const [newCategoryColor, setNewCategoryColor] = useState('text-purple-500');
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isCategoryIconPickerOpen, setIsCategoryIconPickerOpen] = useState(false);

  const [isTaskManagementOpen, setIsTaskManagementOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');
  const [selectedCharacter, setSelectedCharacter] = useState<'sarah' | 'duo'>(() => {
    return (localStorage.getItem('selected_character') as 'sarah' | 'duo') || 'sarah';
  });

  const [characterMessages, setCharacterMessages] = useState<CharacterMessages>(() => {
    const saved = localStorage.getItem('character_messages');
    if (saved) return JSON.parse(saved);
    return {
      mental_health: [
        "خذ نفساً عميقاً، أنت تستحق الهدوء.",
        "تذكر أن تبتسم، صحتك النفسية تهمنا.",
        "لا تنسَ أن تخصص وقتاً لنفسك اليوم.",
        "كل خطوة صغيرة تصنع فرقاً كبيراً في يومك.",
        "أنت أقوى مما تعتقد، استمر في العناية بنفسك."
      ],
      faith: [
        "هل صليت الفروض اليوم؟ تقبل الله منك.",
        "ألا بذكر الله تطمئن القلوب، اذكر الله.",
        "نور قلبك بقراءة آيات من القرآن الكريم.",
        "جدد نيتك واجعل يومك كله لله.",
        "الدعاء يغير الأقدار، لا تنسَ الدعاء اليوم."
      ],
      productivity: [
        "نظم وقتك، فالوقت هو أثمن ما تملك.",
        "ركز على المهام الأهم أولاً، أنت قادر على الإنجاز!",
        "قراءة بضع صفحات اليوم تبني عقلك للغد.",
        "خطوة بخطوة نحو أهدافك، استمر في العمل الرائع.",
        "العمل العميق يصنع النجاح، حافظ على تركيزك."
      ],
      default: [
        "أنا فخورة بك جداً!",
        "أنت تقوم بعمل رائع، استمر!",
        "مستعد لتحدي جديد؟"
      ],
      celebration: {
        generic: "أنت رائع! انا فخور بك",
        completed: "أنت بطل! لقد أنجزت كل المهام بنجاح",
        partial: "عمل رائع! استمر يا بطل"
      }
    };
  });

  const [isMessageCustomizationOpen, setIsMessageCustomizationOpen] = useState(false);

  const updateMessage = (category: keyof Omit<CharacterMessages, 'celebration'>, index: number, newValue: string) => {
    const newMessages = { ...characterMessages };
    newMessages[category][index] = newValue;
    setCharacterMessages(newMessages);
  };

  const addMessage = (category: keyof Omit<CharacterMessages, 'celebration'>) => {
    const newMessages = { ...characterMessages };
    newMessages[category].push("رسالة جديدة...");
    setCharacterMessages(newMessages);
  };

  const removeMessage = (category: keyof Omit<CharacterMessages, 'celebration'>, index: number) => {
    const newMessages = { ...characterMessages };
    newMessages[category].splice(index, 1);
    setCharacterMessages(newMessages);
  };

  const updateCelebrationMessage = (key: keyof CharacterMessages['celebration'], newValue: string) => {
    setCharacterMessages({
      ...characterMessages,
      celebration: {
        ...characterMessages.celebration,
        [key]: newValue
      }
    });
  };

  useEffect(() => {
    localStorage.setItem('character_messages', JSON.stringify(characterMessages));
  }, [characterMessages]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('selected_character', selectedCharacter);
  }, [selectedCharacter]);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  useEffect(() => {
    // Save to localStorage without the icon components
    const toSave = routines.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      iconName: r.iconName,
      categories: r.categories.map(cat => ({
        id: cat.id,
        title: cat.title,
        iconName: cat.iconName,
        color: cat.color,
        bg: cat.bg,
        target: cat.target,
        current: cat.current,
        unit: cat.unit,
        rewardClaimed: cat.rewardClaimed,
        tasks: cat.tasks.map(t => ({ id: t.id, title: t.title, completed: t.completed, points: t.points }))
      }))
    }));
    localStorage.setItem('improvement_routines', JSON.stringify(toSave));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('improvement_selected_routine', selectedRoutineId);
  }, [selectedRoutineId]);

  const handleAddRoutine = () => {
    if (!newRoutineTitle.trim()) return;
    const newRoutine: Routine = {
      id: `routine_${Date.now()}`,
      title: newRoutineTitle,
      description: newRoutineDesc || 'روتين جديد',
      iconName: newRoutineIcon,
      categories: [
        {
          id: `cat_${Date.now()}`,
          title: 'المهام',
          iconName: newRoutineIcon,
          color: 'text-purple-500',
          bg: 'bg-purple-500/10',
          target: 0,
          current: 0,
          unit: 'مهمة',
          tasks: [],
          rewardClaimed: false
        }
      ]
    };
    setRoutines([...routines, newRoutine]);
    setIsAddingRoutine(false);
    setNewRoutineTitle('');
    setNewRoutineDesc('');
    setNewRoutineIcon('Star');
    setSelectedRoutineId(newRoutine.id);
  };

  const handleAddCategory = () => {
    if (!newCategoryTitle.trim()) return;
    const newCategory: HabitCategory = {
      id: `cat_${Date.now()}`,
      title: newCategoryTitle,
      iconName: newCategoryIcon,
      color: newCategoryColor,
      bg: `${newCategoryColor.replace('text', 'bg')}/10`,
      target: 0,
      current: 0,
      unit: 'مهمة',
      tasks: [],
      rewardClaimed: false
    };

    setRoutines(prev => prev.map(routine => {
      if (routine.id !== selectedRoutineId) return routine;
      return {
        ...routine,
        categories: [...routine.categories, newCategory]
      };
    }));

    setIsAddingCategory(false);
    setNewCategoryTitle('');
    setNewCategoryIcon('Star');
    setNewCategoryColor('text-purple-500');
  };

  const handleAddTask = (categoryId: string, title?: string) => {
    const titleToUse = title || '';
    if (!titleToUse.trim()) return;
    const newTask: HabitTask = {
      id: `task_${Date.now()}`,
      title: titleToUse,
      points: 1,
      completed: false
    };
    setRoutines(prev => prev.map(routine => {
      if (routine.id !== selectedRoutineId) return routine;
      return {
        ...routine,
        categories: routine.categories.map(cat => {
          if (cat.id !== categoryId) return cat;
          return { ...cat, tasks: [...cat.tasks, newTask], target: cat.target + 1 };
        })
      };
    }));
    setSelectedCategory(prev => {
      if (!prev || prev.id !== categoryId) return prev;
      return { ...prev, tasks: [...prev.tasks, newTask], target: prev.target + 1 };
    });
  };

  const handleEditTask = (categoryId: string, taskId: string) => {
    if (!editTaskTitle.trim()) return;
    setRoutines(prev => prev.map(routine => {
      if (routine.id !== selectedRoutineId) return routine;
      return {
        ...routine,
        categories: routine.categories.map(cat => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            tasks: cat.tasks.map(t => t.id === taskId ? { ...t, title: editTaskTitle } : t)
          };
        })
      };
    }));
    setSelectedCategory(prev => {
      if (!prev || prev.id !== categoryId) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, title: editTaskTitle } : t)
      };
    });
    setEditingTaskId(null);
    setEditTaskTitle('');
  };

  const handleDeleteTask = (categoryId: string, taskId: string) => {
    setRoutines(prev => prev.map(routine => {
      if (routine.id !== selectedRoutineId) return routine;
      return {
        ...routine,
        categories: routine.categories.map(cat => {
          if (cat.id !== categoryId) return cat;
          const taskToDelete = cat.tasks.find(t => t.id === taskId);
          const isCompleted = taskToDelete?.completed;
          return {
            ...cat,
            tasks: cat.tasks.filter(t => t.id !== taskId),
            target: Math.max(0, cat.target - 1),
            current: isCompleted ? Math.max(0, cat.current - 1) : cat.current
          };
        })
      };
    }));
    setSelectedCategory(prev => {
      if (!prev || prev.id !== categoryId) return prev;
      const taskToDelete = prev.tasks.find(t => t.id === taskId);
      const isCompleted = taskToDelete?.completed;
      return {
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId),
        target: Math.max(0, prev.target - 1),
        current: isCompleted ? Math.max(0, prev.current - 1) : prev.current
      };
    });
  };

  const activeRoutine = routines.find(r => r.id === selectedRoutineId) || routines[0];
  const categories = activeRoutine.categories;

  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | null>(null);
  const [showTasks, setShowTasks] = useState(false);
  const [sessionHasCompletion, setSessionHasCompletion] = useState(false);
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
    let messages: string[] = [];
    
    if (selectedRoutineId === 'mental_health') {
      messages = characterMessages.mental_health;
    } else if (selectedRoutineId === 'faith') {
      messages = characterMessages.faith;
    } else if (selectedRoutineId === 'productivity') {
      messages = characterMessages.productivity;
    } else {
      messages = characterMessages.default;
    }

    const interval = setInterval(() => {
      if (!isCelebrating && !showTasks && messages.length > 0) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setIdleMessage(randomMsg);
        playWomanVoice(randomMsg);
        
        setTimeout(() => {
          setIdleMessage(null);
        }, 8000);
      }
    }, 20000); // Every 20 seconds

    return () => clearInterval(interval);
  }, [isCelebrating, showTasks, selectedRoutineId, characterMessages]);

  const handleCloseTasks = (overrideDuration?: number) => {
    setShowTasks(false);
    setEditingTaskId(null);
    
    const shouldCelebrate = overrideDuration || sessionHasCompletion;
    const duration = overrideDuration || 3000;

    if (shouldCelebrate) {
      let msg = characterMessages.celebration.generic;
      
      if (selectedCategory) {
        const isFullyCompleted = selectedCategory.current >= selectedCategory.target && selectedCategory.target > 0;
        if (isFullyCompleted) {
          msg = characterMessages.celebration.completed;
        } else if (sessionHasCompletion) {
          msg = characterMessages.celebration.partial;
        }
      }

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
      playWomanVoice(msg);

      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }

      // Celebration effects for the specified duration
      celebrationTimeoutRef.current = setTimeout(() => {
        setIsCelebrating(false);
        setCelebrationMessage(null);
      }, duration);
    }
    setSessionHasCompletion(false);
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
          
          const newCurrent = newTasks.filter(t => t.completed).length;
          isFullyCompleted = newCurrent >= cat.target;
          
          const newCat = { ...cat, tasks: newTasks, current: newCurrent };
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
      setSessionHasCompletion(true);
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
                {selectedCharacter === 'sarah' ? (
                  <SarahChar state={isCelebrating || !!idleMessage ? 'celebrate' : (isSad ? 'sad' : 'idle')} />
                ) : (
                  <DuoChar state={isCelebrating || !!idleMessage ? 'celebrate' : (isSad ? 'sad' : 'idle')} />
                )}
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
              onClick={() => setIsCustomizationOpen(true)}
              className="inline-flex items-center gap-2 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 px-4 py-3 rounded-full text-gray-600 dark:text-gray-300 transition-all"
              title="تخصيص الشخصية والإعدادات"
            >
              <Settings2 size={18} />
            </button>
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
              setSessionHasCompletion(false);
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
                {(() => {
                  const IconComponent = (LucideIcons as any)[cat.iconName] || Circle;
                  return <IconComponent className="w-5 h-5 md:w-10 md:h-10" />;
                })()}
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

        {/* Add Category Button */}
        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingCategory(true)}
          className="flex flex-col items-center justify-center gap-3 md:gap-4 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] bg-gray-50 dark:bg-white/[0.03] border border-dashed border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all group relative overflow-hidden shadow-sm dark:shadow-none"
        >
          <div className="w-12 h-12 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-white/40">
            <Plus size={32} className="md:w-12 md:h-12" />
          </div>
          <span className="text-[10px] md:text-xs font-black text-gray-400 dark:text-white/40 uppercase tracking-tighter md:tracking-[0.15em]">إضافة قائمة</span>
        </motion.button>
      </div>

      {/* Customization & Settings Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isCustomizationOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-white dark:bg-[#121212] z-[200] flex flex-col transition-colors duration-300"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">تخصيص الشخصية</h3>
                <button 
                  onClick={() => setIsCustomizationOpen(false)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Character Preview & Navigation */}
                <div className="flex flex-col items-center py-6 bg-gray-50 dark:bg-white/5 rounded-3xl space-y-6">
                  <div className="w-40 h-40 relative">
                    {selectedCharacter === 'sarah' ? (
                      <SarahChar state="happy" />
                    ) : (
                      <DuoChar state="happy" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => setSelectedCharacter(selectedCharacter === 'sarah' ? 'duo' : 'sarah')}
                      className="p-3 rounded-full bg-white dark:bg-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/20 transition-all border border-gray-100 dark:border-white/5"
                    >
                      <ChevronRight size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    
                    <div className="text-center min-w-[120px]">
                      <p className="font-black text-gray-900 dark:text-white text-lg">
                        {selectedCharacter === 'sarah' ? 'سارة' : 'دو'}
                      </p>
                      <p className="text-xs text-gray-500 font-bold">مدربك الشخصي</p>
                    </div>

                    <button 
                      onClick={() => setSelectedCharacter(selectedCharacter === 'sarah' ? 'duo' : 'sarah')}
                      className="p-3 rounded-full bg-white dark:bg-white/10 shadow-sm hover:bg-gray-100 dark:hover:bg-white/20 transition-all border border-gray-100 dark:border-white/5"
                    >
                      <ChevronLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* Message Customization Card */}
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <MessageCircle size={18} />
                    <h4 className="font-black text-base">تخصيص الرسائل</h4>
                  </div>
                  <button 
                    onClick={() => setIsMessageCustomizationOpen(true)}
                    className="w-full bg-gray-50 dark:bg-white/5 p-6 rounded-3xl flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-purple-500/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Edit2 size={24} />
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 dark:text-white">تعديل رسائل الشخصية</p>
                        <p className="text-xs text-gray-500 font-bold">تخصيص ما تقوله الشخصية في الفقاعة</p>
                      </div>
                    </div>
                    <ChevronLeft size={20} className="text-gray-400 group-hover:text-purple-500 transition-colors" />
                  </button>
                </section>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-white/5">
                <Button variant="primary" className="w-full py-2 text-base" onClick={() => setIsCustomizationOpen(false)}>
                  حفظ وإغلاق
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Message Customization Full Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMessageCustomizationOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white dark:bg-[#121212] z-[300] flex flex-col transition-colors duration-300"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center gap-4">
                <button 
                  onClick={() => setIsMessageCustomizationOpen(false)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">تخصيص رسائل الفقاعة</h3>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Mental Health Messages */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Sparkles size={18} />
                      <h4 className="font-black">رسائل الصحة النفسية</h4>
                    </div>
                    <button 
                      onClick={() => addMessage('mental_health')}
                      className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {characterMessages.mental_health.map((msg, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text"
                          value={msg}
                          onChange={(e) => updateMessage('mental_health', idx, e.target.value)}
                          className="flex-1 bg-gray-50 dark:bg-white/5 p-3 rounded-xl text-sm font-bold border border-transparent focus:border-yellow-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => removeMessage('mental_health', idx)}
                          className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Faith Messages */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-500">
                      <Moon size={18} />
                      <h4 className="font-black">رسائل الإيمان</h4>
                    </div>
                    <button 
                      onClick={() => addMessage('faith')}
                      className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {characterMessages.faith.map((msg, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text"
                          value={msg}
                          onChange={(e) => updateMessage('faith', idx, e.target.value)}
                          className="flex-1 bg-gray-50 dark:bg-white/5 p-3 rounded-xl text-sm font-bold border border-transparent focus:border-indigo-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => removeMessage('faith', idx)}
                          className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Productivity Messages */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-500">
                      <Zap size={18} />
                      <h4 className="font-black">رسائل الإنتاجية</h4>
                    </div>
                    <button 
                      onClick={() => addMessage('productivity')}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {characterMessages.productivity.map((msg, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text"
                          value={msg}
                          onChange={(e) => updateMessage('productivity', idx, e.target.value)}
                          className="flex-1 bg-gray-50 dark:bg-white/5 p-3 rounded-xl text-sm font-bold border border-transparent focus:border-blue-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => removeMessage('productivity', idx)}
                          className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Default Messages */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MessageCircle size={18} />
                      <h4 className="font-black">رسائل عامة</h4>
                    </div>
                    <button 
                      onClick={() => addMessage('default')}
                      className="p-2 rounded-lg bg-gray-500/10 text-gray-600 hover:bg-gray-500/20 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {characterMessages.default.map((msg, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text"
                          value={msg}
                          onChange={(e) => updateMessage('default', idx, e.target.value)}
                          className="flex-1 bg-gray-50 dark:bg-white/5 p-3 rounded-xl text-sm font-bold border border-transparent focus:border-gray-500 outline-none transition-all"
                        />
                        <button 
                          onClick={() => removeMessage('default', idx)}
                          className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Celebration Messages */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-purple-500">
                    <Trophy size={18} />
                    <h4 className="font-black">رسائل الاحتفال والإنجاز</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 mr-2">عند إنجاز مهمة (بشكل عام)</label>
                      <input 
                        type="text"
                        value={characterMessages.celebration.generic}
                        onChange={(e) => updateCelebrationMessage('generic', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-xl text-sm font-bold border border-transparent focus:border-purple-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 mr-2">عند إكمال فئة بالكامل</label>
                      <input 
                        type="text"
                        value={characterMessages.celebration.completed}
                        onChange={(e) => updateCelebrationMessage('completed', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-xl text-sm font-bold border border-transparent focus:border-purple-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 mr-2">عند إنجاز جزئي</label>
                      <input 
                        type="text"
                        value={characterMessages.celebration.partial}
                        onChange={(e) => updateCelebrationMessage('partial', e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-xl text-sm font-bold border border-transparent focus:border-purple-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-white/5">
                <button 
                  onClick={() => setIsMessageCustomizationOpen(false)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-purple-500/25"
                >
                  حفظ العبارات
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
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

      {/* Task Management Modal */}
      {isTaskManagementOpen && selectedCategory && (
        <div className="fixed inset-0 bg-white dark:bg-[#121212] z-[150] p-6 overflow-y-auto transition-colors duration-300">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">إدارة المهام</h4>
              <button onClick={() => {
                setIsTaskManagementOpen(false);
                setEditingTaskId(null);
                setEditTaskTitle('');
              }} className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
                <X size={24} />
              </button>
            </div>
            
            {/* Task List in Modal */}
            <div className="space-y-3">
              {selectedCategory.tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-2xl">
                  <span className="text-gray-900 dark:text-white font-bold">{task.title}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingTaskId(task.id); setEditTaskTitle(task.title); }} className="p-2 text-purple-500"><Edit2 size={18} /></button>
                    <button onClick={() => handleDeleteTask(selectedCategory.id, task.id)} className="p-2 text-red-500"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Task Form */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/10">
              <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{editingTaskId ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}</h5>
              <input
                type="text"
                placeholder="اسم المهمة"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-right text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 text-lg mb-4"
              />
              <Button 
                variant="primary" 
                className="w-full py-4 text-lg" 
                onClick={() => {
                  if (editingTaskId) {
                    handleEditTask(selectedCategory.id, editingTaskId);
                  } else {
                    handleAddTask(selectedCategory.id, editTaskTitle);
                  }
                  setEditingTaskId(null);
                  setEditTaskTitle('');
                }} 
                disabled={!editTaskTitle.trim()}
              >
                {editingTaskId ? 'حفظ التعديلات' : 'إضافة المهمة'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 bg-white dark:bg-[#121212] z-[160] p-6 overflow-y-auto transition-colors duration-300">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">إضافة قائمة مهام جديدة</h4>
              <button onClick={() => setIsAddingCategory(false)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <label className="block text-right font-bold text-gray-700 dark:text-gray-300">اسم القائمة</label>
              <input
                type="text"
                placeholder="مثال: القراءة، الرياضة، العمل..."
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-right text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 text-lg"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-right font-bold text-gray-700 dark:text-gray-300">الأيقونة</label>
              <button
                onClick={() => setIsCategoryIconPickerOpen(true)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white"
              >
                <span className="text-gray-500">تغيير الأيقونة</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{newCategoryIcon}</span>
                  {(() => {
                    const Icon = (LucideIcons as any)[newCategoryIcon] || Circle;
                    return <Icon size={24} />;
                  })()}
                </div>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-right font-bold text-gray-700 dark:text-gray-300">اللون</label>
              <div className="flex flex-wrap gap-3 justify-end">
                {[
                  { name: 'بنفسجي', text: 'text-purple-500', bg: 'bg-purple-500' },
                  { name: 'أزرق', text: 'text-blue-500', bg: 'bg-blue-500' },
                  { name: 'أخضر', text: 'text-emerald-500', bg: 'bg-emerald-500' },
                  { name: 'أصفر', text: 'text-amber-500', bg: 'bg-amber-500' },
                  { name: 'أحمر', text: 'text-rose-500', bg: 'bg-rose-500' },
                  { name: 'برتقالي', text: 'text-orange-500', bg: 'bg-orange-500' },
                ].map((color) => (
                  <button
                    key={color.text}
                    onClick={() => setNewCategoryColor(color.text)}
                    className={`w-10 h-10 rounded-full ${color.bg} transition-transform ${newCategoryColor === color.text ? 'scale-125 ring-4 ring-gray-200 dark:ring-white/20' : 'opacity-60 hover:opacity-100'}`}
                  />
                ))}
              </div>
            </div>

            <Button 
              variant="primary" 
              className="w-full py-4 text-lg mt-8" 
              onClick={handleAddCategory} 
              disabled={!newCategoryTitle.trim()}
            >
              إضافة القائمة
            </Button>
          </div>
        </div>
      )}

      {/* Category Icon Picker Modal */}
      {isCategoryIconPickerOpen && (
        <div className="fixed inset-0 bg-white dark:bg-[#121212] z-[170] p-6 overflow-y-auto transition-colors duration-300">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-2xl font-black text-gray-900 dark:text-white">اختر أيقونة</h4>
              <button onClick={() => setIsCategoryIconPickerOpen(false)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-3 justify-end p-4 border border-gray-200 dark:border-white/10 rounded-2xl">
              {AVAILABLE_ICONS.map(iconName => {
                const Icon = (LucideIcons as any)[iconName] || Circle;
                return (
                  <button
                    key={iconName}
                    onClick={() => {
                      setNewCategoryIcon(iconName);
                      setIsCategoryIconPickerOpen(false);
                    }}
                    className={`p-4 rounded-xl border transition-colors ${newCategoryIcon === iconName ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                  >
                    <Icon size={24} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
                  {isAddingRoutine ? (
                    <>
                      <div className="fixed inset-0 bg-white dark:bg-[#121212] z-[130] p-6 overflow-y-auto transition-colors duration-300">
                        <div className="max-w-2xl mx-auto space-y-6">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-2xl font-black text-gray-900 dark:text-white">إضافة روتين جديد</h4>
                            <button onClick={() => setIsAddingRoutine(false)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
                              <X size={24} />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="اسم الروتين (مثال: روتين العمل)"
                            value={newRoutineTitle}
                            onChange={(e) => setNewRoutineTitle(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-right text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 text-lg"
                          />
                          <input
                            type="text"
                            placeholder="وصف الروتين"
                            value={newRoutineDesc}
                            onChange={(e) => setNewRoutineDesc(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-right text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 text-lg"
                          />
                          <div>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 text-right font-bold">الأيقونة المختارة</p>
                            <button
                              onClick={() => setIsIconPickerOpen(true)}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl text-gray-900 dark:text-white"
                            >
                              <span className="text-gray-500">تغيير الأيقونة</span>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{newRoutineIcon}</span>
                                {(() => {
                                  const Icon = (LucideIcons as any)[newRoutineIcon];
                                  return <Icon size={24} />;
                                })()}
                              </div>
                            </button>
                          </div>
                          <Button variant="primary" className="w-full py-4 text-lg" onClick={handleAddRoutine} disabled={!newRoutineTitle.trim()}>
                            حفظ الروتين الجديد
                          </Button>
                        </div>
                      </div>
                      
                      {/* Icon Picker Slide */}
                      {isIconPickerOpen && (
                        <div className="fixed inset-0 bg-white dark:bg-[#121212] z-[140] p-6 overflow-y-auto transition-colors duration-300">
                          <div className="max-w-2xl mx-auto space-y-6">
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-2xl font-black text-gray-900 dark:text-white">اختر أيقونة</h4>
                              <button onClick={() => setIsIconPickerOpen(false)} className="p-2 rounded-full bg-gray-100 dark:bg-white/10">
                                <X size={24} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-end p-4 border border-gray-200 dark:border-white/10 rounded-2xl">
                              {AVAILABLE_ICONS.map(iconName => {
                                const Icon = (LucideIcons as any)[iconName];
                                return (
                                  <button
                                    key={iconName}
                                    onClick={() => {
                                      setNewRoutineIcon(iconName);
                                      setIsIconPickerOpen(false);
                                    }}
                                    className={`p-4 rounded-xl border transition-colors ${newRoutineIcon === iconName ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                  >
                                    <Icon size={28} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => setIsAddingRoutine(true)}
                      className="w-full p-4 rounded-2xl border border-dashed border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      <span className="font-bold">إضافة روتين جديد</span>
                    </button>
                  )}

                  {routines.map((routine) => {
                    const isSelected = routine.id === selectedRoutineId;
                    
                    // Calculate overall progress for the routine
                    const totalTasks = routine.categories.reduce((acc, cat) => acc + (cat.tasks ? cat.tasks.length : 0), 0);
                    const completedTasks = routine.categories.reduce((acc, cat) => acc + (cat.tasks ? cat.tasks.filter(t => t.completed).length : 0), 0);
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
                          <div className="flex-1 text-right">
                            <h5 className={`font-bold text-lg flex items-center gap-2 justify-start ${isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-white'}`}>
                              {routine.title}
                              {routine.iconName && (() => {
                                const Icon = (LucideIcons as any)[routine.iconName] || Circle;
                                return <Icon size={18} className="text-gray-400" />;
                              })()}
                            </h5>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-relaxed">
                              {routine.description}
                            </p>
                          </div>
                          <div className={`mt-1 mr-4 flex-shrink-0 ${isSelected ? 'text-purple-500' : 'text-emerald-500'}`}>
                            {isSelected ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                          </div>
                        </div>

                        <div className="relative w-full h-5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`absolute top-0 right-0 h-full rounded-full transition-all duration-1000 flex items-center justify-center ${isSelected ? 'bg-purple-500' : 'bg-emerald-500'}`}
                            style={{ width: `${progressPercent}%`, minWidth: progressPercent > 0 ? '2rem' : '0' }}
                          >
                            {progressPercent > 0 && (
                              <span className="text-[10px] font-bold text-white">
                                {progressPercent}%
                              </span>
                            )}
                          </div>
                          {progressPercent === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                0%
                              </span>
                            </div>
                          )}
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
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-white/10 rounded-t-[3rem] z-[120] flex flex-col max-h-[92vh] transition-colors duration-300"
            >
              <div className="p-6 pb-2">
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-4" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${selectedCategory.bg} flex items-center justify-center ${selectedCategory.color}`}>
                      {(() => {
                        const IconComponent = (LucideIcons as any)[selectedCategory.iconName] || Circle;
                        return <IconComponent size={20} />;
                      })()}
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
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
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
                    <div className="bg-black/20 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5 backdrop-blur-sm w-full">
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
                    <div key={task.id} className="relative group">
                      {editingTaskId === task.id ? (
                        <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl p-4 flex gap-2">
                          <input
                            type="text"
                            value={editTaskTitle}
                            onChange={(e) => setEditTaskTitle(e.target.value)}
                            className="flex-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-right text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                            autoFocus
                          />
                          <button onClick={() => handleEditTask(selectedCategory.id, task.id)} className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingTaskId(null)} className="p-2 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleToggleTask(selectedCategory.id, task.id)}
                            className={`flex-1 p-4 rounded-2xl border transition-all flex items-center justify-between text-right ${
                              task.completed 
                                ? 'bg-emerald-500/10 border-emerald-500/20' 
                                : 'bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/[0.05]'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={`font-bold text-sm ${task.completed ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-900 dark:text-gray-100'}`}>
                                {task.title}
                              </span>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 dark:border-white/10'
                              }`}>
                                {task.completed && <Check size={14} strokeWidth={3} />}
                              </div>
                            </div>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  ))}

                    <button
                      onClick={() => {
                        setEditingTaskId(null);
                        setEditTaskTitle('');
                        setIsTaskManagementOpen(true);
                      }}
                      className="w-full mt-4 p-4 rounded-2xl border border-dashed border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      <span className="font-bold">إدارة المهام</span>
                    </button>
                </div>
              </div>

              <div className="p-6 pt-2 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#121212]">
                {(() => {
                  const progressPercent = selectedCategory.target > 0 ? Math.min(100, Math.round((selectedCategory.current / selectedCategory.target) * 100)) : 0;
                  const isCompleted = selectedCategory.target > 0 && progressPercent >= 100;
                  const isClaimed = selectedCategory.rewardClaimed;

                  return (
                    <motion.div 
                      animate={isCompleted && !isClaimed ? { 
                        scale: [1, 1.02, 1], 
                        boxShadow: ["0px 0px 0px rgba(234,179,8,0)", "0px 0px 20px rgba(234,179,8,0.3)", "0px 0px 0px rgba(234,179,8,0)"] 
                      } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`p-4 rounded-[1.5rem] border relative overflow-hidden ${isCompleted ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' : 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-gray-200 dark:border-white/5'}`}
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
                    className="mt-3 w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center gap-3 text-indigo-400 font-black hover:from-indigo-500/30 hover:to-purple-500/30 transition-all"
                  >
                    <BookOpen size={20} />
                    <span>الأجر والفوائد</span>
                  </motion.button>
                )}
              </div>

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
