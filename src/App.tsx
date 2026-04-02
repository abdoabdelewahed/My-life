import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
const { 
  Wallet, 
  Home, 
  Target, 
  Sparkles, 
  Trophy,
  CheckCircle2,
  MessageSquare,
  Zap,
  FileBadge,
  Menu,
  Play,
  ChevronDown,
  Flame,
  Star,
  User,
  Compass,
  Book,
  Activity,
  Globe,
  Brain,
  Rocket,
  Telescope,
  Code,
  Terminal,
  Crown,
  ArrowRightLeft,
  ArrowRight,
  ArrowLeft,
  X,
  Heart,
  Shield
} = Lucide;
import { Onboarding } from './components/Onboarding';
import { LearningPath } from './components/LearningPath';
import { LessonFlow } from './components/LessonFlow';
import { FullRoadmap } from './components/FullRoadmap';
import { MenuPage } from './components/MenuPage';
import { AboutPage } from './components/AboutPage';
import { CharactersModal } from './components/CharactersModal';
import { CertificateModal } from './components/CertificateModal';
import { CertificatesPage } from './components/CertificatesPage';
import { AchievementsModal } from './components/AchievementsModal';
import { LevelUpModal } from './components/LevelUpModal';
import { HabitsPage } from './components/HabitsPage';
import { StreakModal } from './components/StreakModal';
import { PointsModal } from './components/PointsModal';
import AbilitiesPage from './components/AbilitiesPage';
import { ImprovementPhase, CharacterSVG } from './components/ImprovementPhase';
import { playChildVoice } from './utils/voice';
import { LEARNING_PATHS, USER_CHARACTERS, PATH_COLORS } from './constants';
import { playPop, playLevelUp } from './utils/sounds';
import confetti from 'canvas-confetti';
import { Button } from './components/ui/Button';

type TabType = 'tasks' | 'tools' | 'roadmap' | 'certificates' | 'menu' | 'about' | 'habits' | 'abilities';
type PostOnboardingStep = 'none' | 'habits_intro' | 'habits_test' | 'results';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('onboardingCompleted'));
  const [postOnboardingStep, setPostOnboardingStep] = useState<PostOnboardingStep>(() => {
    const completed = localStorage.getItem('onboardingCompleted');
    if (completed === 'true') return 'none';
    return (localStorage.getItem('postOnboardingStep') as PostOnboardingStep) || 'none';
  });
  const [activeTab, setActiveTab] = useState<TabType>('habits');
  const [activePathId, setActivePathId] = useState<string>(() => localStorage.getItem('activePathId') || LEARNING_PATHS[0].id);
  const [expandedPathId, setExpandedPathId] = useState<string | null>(LEARNING_PATHS[0].id);
  const [pathProgress, setPathProgress] = useState<Record<string, number>>(() => JSON.parse(localStorage.getItem('pathProgress') || '{}'));



  const handleLogout = () => {
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('postOnboardingStep');
    localStorage.removeItem('activePathId');
    localStorage.removeItem('pathProgress');
    localStorage.removeItem('level');
    localStorage.removeItem('xp');
    localStorage.removeItem('userStats');
    localStorage.removeItem('userName');
    setShowOnboarding(true);
    setPostOnboardingStep('none');
    setActiveTab('habits');
  };

  const handleOnboardingComplete = () => {
    handlePostOnboardingComplete();
    setShowOnboarding(false);
    triggerConfetti('#10b981'); // Emerald color for completion
    playLevelUp();
  };

  const handlePostOnboardingComplete = () => {
    setPostOnboardingStep('none');
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.removeItem('postOnboardingStep');
  };

  const handleHabitsResultsComplete = () => {
    console.log('handleHabitsResultsComplete called');
    handlePostOnboardingComplete();
  };

  useEffect(() => {
    localStorage.setItem('activePathId', activePathId);
  }, [activePathId]);
  const [selectedStep, setSelectedStep] = useState<any>(null);
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const [showCharactersModal, setShowCharactersModal] = useState(false);
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem('level') || '1'));
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('xp') || '0'));
  const [ownedCharacters, setOwnedCharacters] = useState<string[]>(() => {
    const saved = localStorage.getItem('ownedCharacters');
    if (saved) return JSON.parse(saved);
    // Default owned characters are the ones unlocked by level
    return USER_CHARACTERS.filter(c => c.level > 0 && c.level <= level).map(c => c.id);
  });
  const [activeCharacterId, setActiveCharacterId] = useState(() => {
    return localStorage.getItem('activeCharacterId') || (USER_CHARACTERS.find(c => c.level === level)?.id || 'c1');
  });
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedPathName, setCompletedPathName] = useState('');
  const [showUnitCelebration, setShowUnitCelebration] = useState(false);
  const [completedUnitName, setCompletedUnitName] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('userStats') || '{"lessonsCompleted": 0, "perfectQuizzes": 0, "currentStreak": 0, "pathsCompleted": 0, "totalXP": 0, "lastActiveDate": "", "forgivenessDays": 3}'));
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const currentPathIndex = LEARNING_PATHS.findIndex(p => p.id === activePathId);
  const currentPath = LEARNING_PATHS[currentPathIndex !== -1 ? currentPathIndex : 0];
  const pathColor = PATH_COLORS[currentPathIndex !== -1 ? currentPathIndex % PATH_COLORS.length : 0];
  const currentPathProg = pathProgress[currentPath.id] || 0;
  
  // Find the active unit based on progress
  let activeUnit = currentPath.units[0];
  let lessonsBeforeActiveUnit = 0;
  let accumulatedLessons = 0;
  
  const totalLessons = currentPath.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  
  for (const unit of currentPath.units) {
    if (currentPathProg < accumulatedLessons + unit.lessons.length) {
      activeUnit = unit;
      lessonsBeforeActiveUnit = accumulatedLessons;
      break;
    }
    accumulatedLessons += unit.lessons.length;
  }

  // If all units are completed, show the last unit
  if (currentPathProg >= totalLessons && currentPath.units.length > 0) {
    activeUnit = currentPath.units[currentPath.units.length - 1];
    lessonsBeforeActiveUnit = totalLessons - activeUnit.lessons.length;
  } else if (currentPathProg === accumulatedLessons && currentPathProg > 0 && currentPathProg < totalLessons) {
    // If exactly at the end of a unit, but not the end of the path, move to the next unit
    const nextUnitIndex = currentPath.units.findIndex(u => u.id === activeUnit.id) + 1;
    if (nextUnitIndex < currentPath.units.length) {
      activeUnit = currentPath.units[nextUnitIndex];
      lessonsBeforeActiveUnit = accumulatedLessons;
    }
  }

  const unitProg = Math.min(Math.max(currentPathProg - lessonsBeforeActiveUnit, 0), activeUnit.lessons.length);
  const isUnitCompleted = unitProg === activeUnit.lessons.length;
  const unitIndex = currentPath.units.findIndex(u => u.id === activeUnit.id) + 1;

  useEffect(() => {
    localStorage.setItem('pathProgress', JSON.stringify(pathProgress));
    localStorage.setItem('level', level.toString());
    localStorage.setItem('xp', xp.toString());
    localStorage.setItem('userStats', JSON.stringify({ ...stats, totalXP: xp }));
    localStorage.setItem('userName', userName);
    localStorage.setItem('ownedCharacters', JSON.stringify(ownedCharacters));
    localStorage.setItem('activeCharacterId', activeCharacterId);
  }, [pathProgress, level, xp, stats, userName, ownedCharacters, activeCharacterId]);

  const currentCharacter = USER_CHARACTERS.find(c => c.id === activeCharacterId) || USER_CHARACTERS[0];
  
  // Map icon string to actual Lucide component
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Zap,
      Shield,
      Brain,
      Target,
      Heart,
      Crown
    };
    return icons[iconName] || Trophy;
  };

  const CharacterIcon = getIconComponent(currentCharacter.icon);

  const handleTabChange = (tabId: TabType) => {
    playPop();
    setActiveTab(tabId);
  };

  const handleActivityComplete = (xpGained: number) => {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const y = new Date(d);
    y.setDate(y.getDate() - 1);
    const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;

    setXp(prev => {
      const newXp = prev + xpGained;
      // Check for level up and unlock characters
      const newLevel = Math.floor(1 + Math.sqrt(newXp / 100)); // Simple level formula
      if (newLevel > level) {
        setLevel(newLevel);
        // Automatically unlock level-based characters
        const newlyUnlocked = USER_CHARACTERS.filter(c => c.level > 0 && c.level <= newLevel && !ownedCharacters.includes(c.id));
        if (newlyUnlocked.length > 0) {
          setOwnedCharacters(prevOwned => [...prevOwned, ...newlyUnlocked.map(c => c.id)]);
        }
      }
      return newXp;
    });
    
    setStats(prev => {
      let newStreak = prev.currentStreak || 0;
      let newForgivenessDays = prev.forgivenessDays || 3;
      
      if (prev.lastActiveDate === yesterday) {
        newStreak += 1;
      } else if (prev.lastActiveDate !== today && prev.lastActiveDate !== "") {
        // Streak broken!
        if (newForgivenessDays > 0) {
          newForgivenessDays -= 1;
          // Streak stays the same
        } else {
          newStreak = 1;
        }
      } else if (prev.lastActiveDate === "") {
        newStreak = 1;
      }
      // If prev.lastActiveDate === today, do nothing (already incremented today)

      return {
        ...prev,
        currentStreak: newStreak,
        forgivenessDays: newForgivenessDays,
        lastActiveDate: today,
      };
    });
  };

  const handleStepComplete = (xpGained: number, pathId: string) => {
    handleActivityComplete(xpGained);
    
    setStats(prev => ({
      ...prev,
      lessonsCompleted: (prev.lessonsCompleted || 0) + 1,
      perfectQuizzes: (prev.perfectQuizzes || 0) + 1,
    }));
    
    setPathProgress(prev => {
      const newProgress = {
        ...prev,
        [pathId]: (prev[pathId] || 0) + 1
      };
      
      // Check if path or unit is completed
      const path = LEARNING_PATHS.find(p => p.id === pathId);
      if (path) {
        const totalLessonsInPath = path.units.reduce((sum, u) => sum + u.lessons.length, 0);
        if (newProgress[pathId] === totalLessonsInPath) {
          setCompletedPathName(path.title);
          setShowCertificate(true);
          setStats(s => ({ ...s, pathsCompleted: (s.pathsCompleted || 0) + 1 }));
        } else {
          // Check for unit completion
          let accumulated = 0;
          for (const unit of path.units) {
            accumulated += unit.lessons.length;
            if (newProgress[pathId] === accumulated) {
              setCompletedUnitName(unit.title);
              setShowUnitCelebration(true);
              break;
            }
          }
        }
      }
      
      return newProgress;
    });
    
    setSelectedStep(null);
    playPop();
  };

  const purchaseCharacter = (characterId: string, price: number) => {
    if (xp >= price) {
      setXp(prev => prev - price);
      setOwnedCharacters(prev => [...prev, characterId]);
      triggerConfetti('#FFD700');
      playLevelUp();
      return true;
    }
    return false;
  };

  const equipCharacter = (characterId: string) => {
    setActiveCharacterId(characterId);
    playPop();
  };

  const totalSteps = LEARNING_PATHS.reduce((acc, path) => acc + path.units.flatMap(u => u.lessons).length, 0);
  const completedCount = LEARNING_PATHS.reduce((acc, path) => acc + (pathProgress[path.id] || 0), 0);
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;
  
  // Calculate progress within the current level based on requirements
  const levelProgress = useMemo(() => {
    const nextLevel = level + 1;
    const nextChar = USER_CHARACTERS.find(c => c.level === nextLevel);
    if (!nextChar || !nextChar.requirements) return 0;

    const req = nextChar.requirements;
    const xpProgress = Math.min(1, xp / req.xp);
    const lessonsProgress = Math.min(1, (stats.lessonsCompleted || 0) / req.lessons);
    const pathsProgress = req.paths > 0 
      ? Math.min(1, (stats.pathsCompleted || 0) / req.paths)
      : 1;

    const totalReqs = req.paths > 0 ? 3 : 2;
    const progressSum = xpProgress + lessonsProgress + (req.paths > 0 ? pathsProgress : 0);
    return progressSum / totalReqs;
  }, [level, xp, stats]);

  // Dynamic character style based on progress
  const characterStyle = {
    opacity: 0.5 + levelProgress * 0.5,
    scale: 0.9 + levelProgress * 0.1,
    filter: `hue-rotate(${levelProgress * 40}deg)`
  };

  const triggerConfetti = (color?: string) => {
    const duration = 1.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000, colors: color ? [color, '#ffffff'] : undefined };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  useEffect(() => {
    // Gamification logic: Level up when levelProgress reaches 100%
    if (levelProgress >= 1 && level < USER_CHARACTERS.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      playLevelUp();
      triggerConfetti('#f97316'); // Orange for level up
      setShowLevelUpModal(true);
      // Add bonus XP for leveling up
      setXp(prev => prev + 500);
    }
  }, [levelProgress, level]);

  useEffect(() => {
    if (showUnitCelebration || showCertificate) {
      const activePathIndex = LEARNING_PATHS.findIndex(p => p.id === activePathId);
      const color = PATH_COLORS[activePathIndex !== -1 ? activePathIndex % PATH_COLORS.length : 0].main;
      triggerConfetti(color);
    }
  }, [showUnitCelebration, showCertificate, activePathId]);

  const tabs = [
    { id: 'habits', label: 'عاداتي', icon: <Activity size={20} /> },
    { id: 'tasks', label: 'الرئيسية', icon: <Home size={20} /> },
    { id: 'abilities', label: 'قدراتي', icon: <Brain size={20} /> },
    { id: 'menu', label: 'القائمة', icon: <Menu size={20} /> },
  ] as const;

  const earnedAchievementsCount = [
    (stats.lessonsCompleted || 0) >= 1,
    (stats.currentStreak || 0) >= 3,
    (stats.perfectQuizzes || 0) >= 5,
    xp >= 1000,
    (stats.lessonsCompleted || 0) >= 10,
    (stats.pathsCompleted || 0) >= 1
  ].filter(Boolean).length;

  const activePathIndex = LEARNING_PATHS.findIndex(p => p.id === activePathId);
  const activePathColor = PATH_COLORS[activePathIndex !== -1 ? activePathIndex % PATH_COLORS.length : 0];

  useEffect(() => {
    console.log('postOnboardingStep changed to:', postOnboardingStep);
    localStorage.setItem('postOnboardingStep', postOnboardingStep);
  }, [postOnboardingStep]);

  const [habitsView, setHabitsView] = useState<string>('test_selection');
  const [abilitiesView, setAbilitiesView] = useState<string>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('soundEnabled') !== 'false');

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  return (
    <div className={`min-h-screen bg-[#121212] font-sans text-white ${activePathColor.selection} pb-24 md:pb-0 overflow-x-hidden`}>
      <AnimatePresence mode="wait">
        {showOnboarding ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : postOnboardingStep !== 'none' ? (
          <motion.div 
            key="post-onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#121212] z-[100] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {postOnboardingStep === 'habits_intro' && (
                <motion.div 
                  key="habits_intro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="fixed inset-0 flex flex-col bg-[#121212] z-[110]"
                >
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-6 md:mb-8">
                      <Activity className="w-10 h-10 md:w-12 md:h-12" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">اختبار العادات</h2>
                    <p className="text-base md:text-xl text-gray-400 mb-8 md:mb-12 leading-relaxed px-2">
                      قبل أن نبدأ رحلتك، نحتاج لفهم عاداتك الحالية. هذا الاختبار سيساعدنا على رسم خريطة طريق مخصصة لك.
                    </p>
                  </div>
                  <div className="p-6 border-t border-white/10 bg-[#121212] flex flex-col items-center gap-4 w-full">
                    <Button 
                      onClick={() => setPostOnboardingStep('habits_test')}
                      variant="success"
                      size="xl"
                      fullWidth
                      className="max-w-sm"
                    >
                      ابدأ الاختبار <ArrowLeft size={24} />
                    </Button>
                  </div>
                </motion.div>
              )}
              {postOnboardingStep === 'habits_test' && (
                <motion.div 
                  key="habits_test"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="fixed inset-0 overflow-y-auto bg-[#0a0a0a]"
                >
                  <HabitsPage 
                    onComplete={() => setPostOnboardingStep('results')} 
                    initialView="test_selection"
                  />
                </motion.div>
              )}
              {postOnboardingStep === 'results' && (
                <motion.div 
                  key="habits_results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="fixed inset-0 overflow-y-auto bg-[#0a0a0a]"
                >
                  <HabitsPage 
                    onComplete={handleHabitsResultsComplete} 
                    initialView="results"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
          {/* Animated Spotify-like Header Gradient with Ethereal Blobs */}
          <div className={`absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b ${activePathColor.gradientFrom} via-[#121212]/80 to-[#121212] -z-10 pointer-events-none overflow-hidden`}>
            <motion.div
              animate={{
                x: [0, 50, -50, 0],
                y: [0, 30, -30, 0],
                scale: [1, 1.2, 0.8, 1],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className={`absolute top-[-10%] right-[-10%] w-[60%] h-[60%] ${activePathColor.bg} opacity-10 blur-[120px] rounded-full ether-blob`}
            />
            <motion.div
              animate={{
                x: [0, -40, 40, 0],
                y: [0, -20, 20, 0],
                scale: [1, 0.9, 1.1, 1],
                rotate: [360, 270, 180, 90, 0]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className={`absolute bottom-[20%] left-[-10%] w-[50%] h-[50%] ${activePathColor.bg} opacity-5 blur-[100px] rounded-full ether-blob`}
            />
          </div>
          
          {/* Header */}
          {(activeTab !== 'habits' || habitsView === 'test_selection' || habitsView === 'results') && 
           (activeTab !== 'abilities' || abilitiesView === 'dashboard' || abilitiesView === 'library') &&
           activeTab !== 'about' && (
            <header className="sticky top-0 z-40 bg-[#121212]/40 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
              <div className="max-w-6xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowCharactersModal(true);
                    playPop();
                  }}
                >
                  <div className={`w-8 h-8 md:w-9 md:h-9 ${activePathColor.bg} rounded-lg flex items-center justify-center text-black shadow-2xl relative overflow-hidden transition-transform group-hover:rotate-3`}>
                    <div className={`absolute inset-0 opacity-40 ${activePathColor.gradientFrom}`} />
                    <CharacterIcon size={16} className="md:w-4 md:h-4 relative z-10" />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <div className="flex items-center gap-1.5">
                      <h1 className="font-black text-xs md:text-sm tracking-tight text-white">{currentCharacter.name}</h1>
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400">مستوى {level}</span>
                      <div className="w-10 h-0.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${levelProgress * 100}%` }}
                          className={`h-full ${activePathColor.bg}`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Stats in App Bar */}
                <div className="flex items-center gap-3 md:gap-4 pb-0 pt-[3px] pr-4">
                  <div 
                    className="hidden sm:flex items-center gap-3 bg-white/[0.03] px-3 py-1.5 rounded-2xl border border-white/5 backdrop-blur-md cursor-pointer hover:bg-white/[0.08] transition-all"
                    onClick={() => {
                      setShowStreakModal(true);
                      playPop();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="text-orange-500 w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" />
                      <span className="font-black text-xs md:text-sm text-white">{stats.currentStreak || 0}<span className="text-white/30 text-[9px] ml-0.5">/30</span></span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPointsModal(true);
                        playPop();
                      }}
                    >
                      <Star className="text-yellow-500 w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" />
                      <span className="font-black text-xs md:text-sm text-white">{xp}</span>
                    </div>
                  </div>
              
              <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl backdrop-blur-xl border border-white/5">
                {tabs.map((tab) => (
                  <Button 
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as TabType)}
                    variant={activeTab === tab.id ? "primary" : "ghost"}
                    size="sm"
                    className={`relative rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer h-8 px-4 ${
                      activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabDesktop" 
                        className="absolute inset-0 bg-white shadow-2xl rounded-xl"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {React.cloneElement(tab.icon as React.ReactElement, { size: 16 })}
                      {tab.label}
                    </span>
                  </Button>
                ))}
              </nav>

              {/* Mobile Stats Only */}
              <div className="flex sm:hidden items-center gap-2">
                <div 
                  className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 cursor-pointer active:scale-95 transition-all"
                  onClick={() => {
                    setShowStreakModal(true);
                    playPop();
                  }}
                >
                  <Flame className="text-orange-500 w-4 h-4" fill="currentColor" />
                  <span className="font-black text-xs text-white">{stats.currentStreak || 0}<span className="text-white/30 text-[8px] ml-0.5">/30</span></span>
                </div>
                <div 
                  className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 pr-3 rounded-full border border-white/10 cursor-pointer active:scale-95 transition-all"
                  onClick={() => {
                    setShowPointsModal(true);
                    playPop();
                  }}
                >
                  <Star className="text-yellow-500 w-4 h-4" fill="currentColor" />
                  <span className="font-black text-xs text-white">{xp}</span>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={(activeTab === 'about' || activeTab === 'habits' || (activeTab === 'abilities' && abilitiesView === 'results')) ? 'w-full' : 'max-w-6xl mx-auto px-4 py-6 md:py-8'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'tasks' && (
              <LearningPath 
                activePathId={activePathId}
                pathProgress={pathProgress}
                onStepClick={setSelectedStep}
                onShowFullRoadmap={() => setShowFullRoadmap(true)}
                onViewCertificate={(title, type) => {
                  if (type === 'path') {
                    setCompletedPathName(title);
                    setShowCertificate(true);
                  } else {
                    setCompletedUnitName(title);
                    setShowUnitCelebration(true);
                  }
                }}
              />
            )}
            {activeTab === 'habits' && (
              <HabitsPage 
                onViewChange={setHabitsView}
                onActivityComplete={handleActivityComplete}
              />
            )}
            {activeTab === 'abilities' && (
              <AbilitiesPage 
                onComplete={() => setActiveTab('tasks')}
                onViewChange={setAbilitiesView}
                onActivityComplete={handleActivityComplete}
              />
            )}
            {activeTab === 'menu' && (
              <MenuPage 
                onNavigate={(tab) => setActiveTab(tab as TabType)}
                completedCount={completedCount}
                stats={stats}
                onUpdateStats={setStats}
                onLogout={handleLogout}
                isInstallable={isInstallable}
                onInstall={handleInstallClick}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
              />
            )}
            {activeTab === 'about' && (
              <AboutPage onBack={() => setActiveTab('menu')} />
            )}
            {activeTab === 'certificates' && (
              <CertificatesPage 
                pathProgress={pathProgress}
                userName={userName}
                onUpdateName={setUserName}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {activeTab !== 'about' && (
        <footer className="hidden md:block bg-[#121212] border-t border-white/5 py-10 mt-12 ether-gradient">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-200 text-sm font-bold tracking-wide">
              منصة النمو الذاتي والوعي 2026 &copy; مساحتك الآمنة للتطور.
            </p>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation Bar - Matching Web Style */}
      {(!showOnboarding && 
        postOnboardingStep === 'none' && 
        (activeTab !== 'habits' || habitsView === 'test_selection' || habitsView === 'results') && 
        (activeTab !== 'abilities' || abilitiesView === 'dashboard' || abilitiesView === 'library') &&
        activeTab !== 'about') && (
        <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[450px] bg-[#1a2e26] backdrop-blur-3xl border border-white/10 z-50 p-2 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabType)}
                variant={isActive ? "primary" : "ghost"}
                size="sm"
                className={`relative flex items-center justify-center gap-1 rounded-2xl transition-all cursor-pointer flex-1 h-10 ${
                  isActive ? 'bg-white text-black' : 'text-gray-300 hover:text-white'
                }`}
              >
                <div className="relative z-10 flex items-center gap-2">
                  {React.cloneElement(tab.icon as React.ReactElement, { size: 22 })}
                  <span className={`text-xs font-black transition-all tracking-tight ${isActive ? 'block' : 'hidden'}`}>
                    {tab.label}
                  </span>
                </div>
              </Button>
            );
          })}
        </nav>
      )}

      <AnimatePresence>
        {selectedStep && (
          <LessonFlow 
            step={selectedStep} 
            onClose={() => setSelectedStep(null)} 
            onComplete={(xpGained) => handleStepComplete(xpGained, selectedStep.pathId)} 
            color={PATH_COLORS[LEARNING_PATHS.findIndex(p => p.id === selectedStep.pathId) !== -1 ? LEARNING_PATHS.findIndex(p => p.id === selectedStep.pathId) % PATH_COLORS.length : 0]}
          />
        )}
      </AnimatePresence>

      <CharactersModal 
        isOpen={showCharactersModal} 
        onClose={() => setShowCharactersModal(false)} 
        currentLevel={level + levelProgress} 
        xp={xp}
        stats={stats}
        ownedCharacters={ownedCharacters}
        activeCharacterId={activeCharacterId}
        onPurchase={purchaseCharacter}
        onEquip={equipCharacter}
      />

      <AnimatePresence>
        {showFullRoadmap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-[#121212] z-[70] overflow-y-auto flex flex-col"
          >
            {/* App Bar */}
            <div className="sticky top-0 z-[80] bg-[#121212]/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center gap-4">
              <Button 
                onClick={() => setShowFullRoadmap(false)}
                variant="ghost"
                size="sm"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/10 p-0"
              >
                <X size={20} />
              </Button>
              <h2 className="text-xl font-black text-white">استكشف المسارات</h2>
            </div>
            
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
              <FullRoadmap 
                pathProgress={pathProgress}
                onStepClick={(step) => {
                  setSelectedStep(step);
                  setShowFullRoadmap(false);
                }}
                onClose={() => setShowFullRoadmap(false)}
                activePathId={activePathId}
                initialPathId={null}
                onSelectPath={(pathId) => {
                  setActivePathId(pathId);
                  setShowFullRoadmap(false);
                }}
                onViewCertificate={(title, type, color) => {
                  setShowFullRoadmap(false);
                  if (type === 'path') {
                    setCompletedPathName(title);
                    setShowCertificate(true);
                  } else {
                    setCompletedUnitName(title);
                    setShowUnitCelebration(true);
                  }
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showCertificate && (
        <CertificateModal 
          title={completedPathName} 
          type="path"
          userName={userName}
          onUpdateName={setUserName}
          onClose={() => setShowCertificate(false)} 
          pathProgress={pathProgress}
        />
      )}

      {showUnitCelebration && (
        <CertificateModal 
          title={completedUnitName} 
          type="unit"
          userName={userName}
          onUpdateName={setUserName}
          onClose={() => setShowUnitCelebration(false)} 
          pathProgress={pathProgress}
        />
      )}

      {showAchievements && (
        <AchievementsModal 
          stats={{ ...stats, totalXP: xp }} 
          onClose={() => setShowAchievements(false)} 
        />
      )}

      <StreakModal 
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        stats={stats}
        level={level}
      />

      <PointsModal 
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        xp={xp}
        level={level}
        stats={stats}
      />

      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={() => setShowLevelUpModal(false)}
        level={level}
        character={USER_CHARACTERS.find(c => c.level === level) || USER_CHARACTERS[0]}
      />
          </motion.div>
        )}
      </AnimatePresence>
      {isInstallable && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleInstallClick}
          className="fixed bottom-24 right-4 z-[100] bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/20"
        >
          <Lucide.Download size={24} />
        </motion.button>
      )}
    </div>
  );
}
