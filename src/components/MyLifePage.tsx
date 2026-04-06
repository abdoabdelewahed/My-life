import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, HeartPulse, Briefcase, Plus, Trash2, Save, Edit2, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import HealthAssessmentPage from './HealthAssessmentPage';
import RelationshipAssessmentPage from './RelationshipAssessmentPage';
import MentalHealthAssessmentPage from './MentalHealthAssessmentPage';
import WorkAssessmentPage from './WorkAssessmentPage';
import LearningAssessmentPage from './LearningAssessmentPage';
import AbilitiesPage from './AbilitiesPage';
import { Brain, Briefcase as WorkIcon, Target, GraduationCap, CheckCircle2, Sparkles } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  taskDetails: string;
}

interface RelationshipCategory {
  id: string;
  title: string;
  icon: string;
  color: string;
  people: Person[];
}

interface LifeData {
  relationships: {
    categories: RelationshipCategory[];
  };
  health: {
    bloodType: string;
    history: string;
    currentConditions: string;
    completedCheckups: string[];
    assessments: {
      [organ: string]: {
        score: number;
        lastDate: string;
      }
    };
  };
  work: {
    title: string;
    company: string;
    salary: string;
    experience: string;
    goals: string;
  };
  learning: {
    courses: { id: string; title: string; status: 'planned' | 'in-progress' | 'completed' }[];
    skills: string;
  };
}

const defaultLifeData: LifeData = {
  relationships: {
    categories: [
      { id: 'family', title: 'العائلة', icon: 'Heart', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', people: [] },
      { id: 'friends', title: 'الأصدقاء', icon: 'Users', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', people: [] },
      { id: 'clients', title: 'العملاء', icon: 'Briefcase', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', people: [] },
    ]
  },
  health: { bloodType: '', history: '', currentConditions: '', completedCheckups: [], assessments: {} },
  work: { title: '', company: '', salary: '', experience: '', goals: '' },
  learning: { courses: [], skills: '' }
};

export const MyLifePage: React.FC<{ 
  onSectionChange?: (isActive: boolean) => void;
  onActivityComplete?: (xp: number) => void;
  onAbilitiesViewChange?: (view: string) => void;
}> = ({ onSectionChange, onActivityComplete, onAbilitiesViewChange }) => {
  const [activeSection, setActiveSection] = useState<'relationships' | 'health' | 'work' | 'learning' | 'self-awareness' | null>(null);
  const [activeRelCategory, setActiveRelCategory] = useState<string | null>(null);
  const [activeHealthCategory, setActiveHealthCategory] = useState<'checkups' | 'info' | 'assessment' | 'assessment-quiz' | null>(null);
  const [activeWorkCategory, setActiveWorkCategory] = useState<'assessment' | 'info' | null>(null);
  const [activeLearningCategory, setActiveLearningCategory] = useState<'assessment' | 'info' | null>(null);
  const [activeOrgan, setActiveOrgan] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonTask, setNewPersonTask] = useState('');
  
  useEffect(() => {
    if (onSectionChange) {
      onSectionChange(activeSection !== null);
    }
  }, [activeSection, onSectionChange]);
  
  const [data, setData] = useState<LifeData>(() => {
    const saved = localStorage.getItem('myLifeData');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.relationships.categories) {
        parsed.relationships = {
          categories: [
            { id: 'family', title: 'العائلة', icon: 'Heart', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', people: (parsed.relationships.family || []).map((p: any) => ({ id: p.id, name: p.name, taskDetails: p.notes || '' })) },
            { id: 'friends', title: 'الأصدقاء', icon: 'Users', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', people: (parsed.relationships.friends || []).map((p: any) => ({ id: p.id, name: p.name, taskDetails: p.notes || '' })) },
            { id: 'clients', title: 'العملاء', icon: 'Briefcase', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', people: [] },
          ]
        };
      }
      return parsed;
    }
    return defaultLifeData;
  });

  useEffect(() => {
    localStorage.setItem('myLifeData', JSON.stringify(data));
  }, [data]);

  const updateData = (section: keyof LifeData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addCategory = () => {
    if (!newCategoryTitle.trim()) return;
    const newCategory: RelationshipCategory = {
      id: Date.now().toString(),
      title: newCategoryTitle,
      icon: 'Users',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      people: []
    };
    updateData('relationships', 'categories', [...data.relationships.categories, newCategory]);
    setNewCategoryTitle('');
    setShowAddCategoryModal(false);
  };

  const addPerson = () => {
    if (!newPersonName.trim() || !activeRelCategory) return;
    const newPerson: Person = {
      id: Date.now().toString(),
      name: newPersonName,
      taskDetails: newPersonTask
    };
    const updatedCategories = data.relationships.categories.map(cat => 
      cat.id === activeRelCategory ? { ...cat, people: [...cat.people, newPerson] } : cat
    );
    updateData('relationships', 'categories', updatedCategories);
    setNewPersonName('');
    setNewPersonTask('');
    setShowAddPersonModal(false);
  };

  const updatePerson = (categoryId: string, personId: string, field: string, value: string) => {
    const updatedCategories = data.relationships.categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          people: cat.people.map(p => p.id === personId ? { ...p, [field]: value } : p)
        };
      }
      return cat;
    });
    updateData('relationships', 'categories', updatedCategories);
  };

  const removePerson = (categoryId: string, personId: string) => {
    const updatedCategories = data.relationships.categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          people: cat.people.filter(p => p.id !== personId)
        };
      }
      return cat;
    });
    updateData('relationships', 'categories', updatedCategories);
  };

  const addCourse = () => {
    const newCourse = { id: Date.now().toString(), title: '', status: 'planned' as const };
    updateData('learning', 'courses', [...data.learning.courses, newCourse]);
  };

  const toggleCheckup = (title: string) => {
    const isCompleted = data.health.completedCheckups.includes(title);
    const newCompleted = isCompleted
      ? data.health.completedCheckups.filter(t => t !== title)
      : [...data.health.completedCheckups, title];
    updateData('health', 'completedCheckups', newCompleted);
  };

  const updateCourse = (id: string, field: string, value: string) => {
    const updated = data.learning.courses.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateData('learning', 'courses', updated);
  };

  const removeCourse = (id: string) => {
    const updated = data.learning.courses.filter(c => c.id !== id);
    updateData('learning', 'courses', updated);
  };

  const sections = [
    { id: 'relationships', label: 'العلاقات', description: 'إدارة العائلة والأصدقاء', icon: <Users size={32} />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { id: 'health', label: 'الصحة', description: 'السجل الطبي والحالة الصحية', icon: <HeartPulse size={32} />, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    { id: 'work', label: 'العمل', description: 'المسار المهني والأهداف', icon: <Briefcase size={32} />, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 'learning', label: 'التعلم', description: 'الدورات والمهارات', icon: <GraduationCap size={32} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { id: 'self-awareness', label: 'الوعي الذاتي', description: 'اكتشف قدراتك وثقتك بنفسك', icon: <Sparkles size={32} />, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  ] as const;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 md:space-y-8 pb-24">
      <AnimatePresence mode="wait">
        {!activeSection && (
          <motion.div 
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-app-text-primary">إدارة حياتي</h1>
                <p className="text-sm text-app-text-secondary mt-1">نظم تفاصيل حياتك، علاقاتك، صحتك، وعملك في مكان واحد.</p>
              </div>
            </div>

            {/* Cards Grid */}
            <motion.div 
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-3"
            >
              {sections.map(section => (
                <motion.div
                  key={section.id}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ x: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(section.id)}
                  className="p-4 rounded-2xl border border-app-border bg-app-surface cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl ${section.bg} ${section.color} flex items-center justify-center shrink-0`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-app-text-primary">{section.label}</h3>
                    <p className="text-sm text-app-text-secondary">{section.description}</p>
                  </div>
                  <ChevronRight className="text-app-text-secondary" size={20} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-app-bg z-[70] overflow-y-auto flex flex-col"
          >
            {/* App Bar */}
            <div className="sticky top-0 z-[80] bg-app-surface/80 backdrop-blur-xl border-b border-app-border px-4 py-4 flex items-center gap-4 shadow-sm">
              <Button onClick={() => activeRelCategory ? setActiveRelCategory(null) : activeHealthCategory ? setActiveHealthCategory(null) : activeWorkCategory ? setActiveWorkCategory(null) : activeLearningCategory ? setActiveLearningCategory(null) : setActiveSection(null)} variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-app-bg hover:bg-app-bg/80 flex items-center justify-center text-app-text-primary transition-colors border border-app-border p-0 shrink-0">
                <ChevronRight size={24} />
              </Button>
              {activeRelCategory === 'assessment' ? (
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <Heart size={20} />
                </div>
              ) : activeHealthCategory === 'mental_health' ? (
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Brain size={20} />
                </div>
              ) : activeWorkCategory === 'assessment' ? (
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <WorkIcon size={20} />
                </div>
              ) : activeWorkCategory === 'info' ? (
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <WorkIcon size={20} />
                </div>
              ) : activeLearningCategory === 'assessment' ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} />
                </div>
              ) : activeLearningCategory === 'info' ? (
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} />
                </div>
              ) : activeSection === 'self-awareness' ? (
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
              ) : activeRelCategory ? (
                <div className={`w-10 h-10 rounded-xl ${data.relationships.categories.find(c => c.id === activeRelCategory)?.color.split(' ').slice(0, 2).join(' ')} flex items-center justify-center shrink-0`}>
                  {data.relationships.categories.find(c => c.id === activeRelCategory)?.icon === 'Heart' ? <Heart size={20} /> :
                   data.relationships.categories.find(c => c.id === activeRelCategory)?.icon === 'Users' ? <Users size={20} /> :
                   <Briefcase size={20} />}
                </div>
              ) : (
                <div className={`w-10 h-10 rounded-xl ${sections.find(s => s.id === activeSection)?.bg + ' ' + sections.find(s => s.id === activeSection)?.color} flex items-center justify-center shrink-0`}>
                  {sections.find(s => s.id === activeSection)?.icon && React.cloneElement(sections.find(s => s.id === activeSection)?.icon as React.ReactElement, { size: 20 })}
                </div>
              )}
              <div>
                <h2 className="text-xl font-black text-app-text-primary">
                  {activeRelCategory === 'assessment' ? 'اختبر علاقاتك' : activeHealthCategory === 'mental_health' ? 'صحتك النفسية' : activeWorkCategory === 'assessment' ? 'اختبارات العمل' : activeWorkCategory === 'info' ? 'المعلومات المهنية' : activeLearningCategory === 'assessment' ? 'اختبارات التعلم' : activeLearningCategory === 'info' ? 'الدورات والتعلم' : activeSection === 'self-awareness' ? 'الوعي الذاتي' : activeRelCategory ? data.relationships.categories.find(c => c.id === activeRelCategory)?.title : sections.find(s => s.id === activeSection)?.label}
                </h2>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-8 max-w-4xl mx-auto w-full flex-1 pb-24">
              <AnimatePresence mode="wait">
                {activeSection === 'self-awareness' && (
                  <motion.div
                    key="self-awareness"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <AbilitiesPage 
                      onComplete={() => setActiveSection(null)}
                      onViewChange={onAbilitiesViewChange}
                      onActivityComplete={onActivityComplete}
                    />
                  </motion.div>
                )}

                {/* Relationships Tab */}
                {activeSection === 'relationships' && !activeRelCategory && (
                  <motion.div 
                    key="rel-main"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-3">
                      {data.relationships.categories.map(cat => (
                        <motion.div
                          key={cat.id}
                          whileHover={{ x: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveRelCategory(cat.id)}
                          className="p-4 rounded-2xl border border-app-border bg-app-surface cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                        >
                          <div className={`w-10 h-10 rounded-xl ${cat.color.split(' ').slice(0, 2).join(' ')} flex items-center justify-center shrink-0`}>
                            {cat.icon === 'Heart' && <Heart size={20} />}
                            {cat.icon === 'Users' && <Users size={20} />}
                            {cat.icon === 'Briefcase' && <Briefcase size={20} />}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-black text-app-text-primary">{cat.title}</h3>
                            <p className="text-sm text-app-text-secondary">{cat.people.length} أشخاص</p>
                          </div>
                          <ChevronRight className="text-app-text-secondary" size={20} />
                        </motion.div>
                      ))}
                      
                      <motion.div
                        whileHover={{ x: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveRelCategory('assessment')}
                        className="p-4 rounded-2xl border border-app-border bg-app-surface cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-4 mt-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                          <Heart size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-app-text-primary">اختبر علاقاتك</h3>
                          <p className="text-sm text-app-text-secondary">تقييم شامل لجودة علاقاتك</p>
                        </div>
                        <ChevronRight className="text-app-text-secondary" size={20} />
                      </motion.div>
                    </div>
                    
                    {/* FAB for Categories */}
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAddCategoryModal(true)}
                      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-600 z-50"
                    >
                      <Plus size={24} />
                    </motion.button>
                  </motion.div>
                )}

                {activeSection === 'relationships' && activeRelCategory === 'assessment' && (
                  <motion.div
                    key="rel-assessment"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <RelationshipAssessmentPage />
                  </motion.div>
                )}

                {activeSection === 'relationships' && activeRelCategory && activeRelCategory !== 'assessment' && (
                  <motion.div 
                    key={`rel-cat-${activeRelCategory}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* People List */}
                    <div className="space-y-3">
                      {data.relationships.categories.find(c => c.id === activeRelCategory)?.people.map(person => (
                        <div key={person.id} className="p-4 rounded-2xl bg-app-surface border border-app-border flex flex-col gap-2 shadow-sm">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={person.name}
                              onChange={(e) => updatePerson(activeRelCategory, person.id, 'name', e.target.value)}
                              className="text-base font-bold bg-transparent border-none outline-none text-app-text-primary placeholder:text-app-text-secondary focus:ring-0 w-full"
                              placeholder="اسم الشخص"
                            />
                            <button onClick={() => removePerson(activeRelCategory, person.id)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <textarea
                            value={person.taskDetails}
                            onChange={(e) => updatePerson(activeRelCategory, person.id, 'taskDetails', e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-app-text-secondary placeholder:text-app-text-secondary/50 focus:ring-0 resize-none text-xs"
                            placeholder="تفاصيل المهمة أو الملاحظات..."
                            rows={2}
                          />
                        </div>
                      ))}
                      {data.relationships.categories.find(c => c.id === activeRelCategory)?.people.length === 0 && (
                        <div className="text-center py-12 text-app-text-secondary">
                          <Users size={40} className="mx-auto mb-3 opacity-20" />
                          <p className="text-sm">لم تقم بإضافة أي أشخاص هنا بعد.</p>
                        </div>
                      )}
                    </div>

                    {/* FAB for Person */}
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowAddPersonModal(true)}
                      className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-600 z-50"
                    >
                      <Plus size={24} />
                    </motion.button>
                  </motion.div>
                )}

              {/* Health Tab */}
              {activeSection === 'health' && !activeHealthCategory && (
                <motion.div 
                  key="health-main"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveHealthCategory('info')}
                      className="bg-app-surface p-6 rounded-2xl border border-app-border flex items-center gap-4 cursor-pointer hover:border-app-text-secondary transition-all"
                    >
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                        <HeartPulse size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-app-text-primary">المعلومات الصحية</h3>
                        <p className="text-sm text-app-text-secondary">فصيلة الدم، التاريخ المرضي، والحالة</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveHealthCategory('checkups')}
                      className="bg-app-surface p-6 rounded-2xl border border-app-border flex items-center gap-4 cursor-pointer hover:border-app-text-secondary transition-all"
                    >
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Heart size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-app-text-primary">الفحوصات الدورية</h3>
                        <p className="text-sm text-app-text-secondary">تابع فحوصاتك وتحاليلك الدورية</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveHealthCategory('assessment')}
                      className="bg-app-surface p-6 rounded-2xl border border-app-border flex items-center gap-4 cursor-pointer hover:border-app-text-secondary transition-all"
                    >
                      <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500">
                        <HeartPulse size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-app-text-primary">اختبر صحتك</h3>
                        <p className="text-sm text-app-text-secondary">تقييم شامل لأعضاء جسمك</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveHealthCategory('mental_health')}
                      className="bg-app-surface p-6 rounded-2xl border border-app-border flex items-center gap-4 cursor-pointer hover:border-app-text-secondary transition-all"
                    >
                      <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                        <Brain size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-app-text-primary">صحتك النفسية</h3>
                        <p className="text-sm text-app-text-secondary">تقييم الصحة النفسية والمزاج</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* Health Info Page */}
              {activeSection === 'health' && activeHealthCategory === 'info' && (
                <motion.div 
                  key="health-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black text-app-text-primary mb-2">المعلومات الصحية</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-app-text-secondary mb-2">فصيلة الدم</label>
                      <input
                        type="text"
                        value={data.health.bloodType}
                        onChange={(e) => updateData('health', 'bloodType', e.target.value)}
                        placeholder="مثال: O+"
                        className="w-full p-4 rounded-xl bg-app-surface border border-app-border text-app-text-primary outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-app-text-secondary mb-2">التاريخ المرضي (الأمراض السابقة، العمليات...)</label>
                      <textarea
                        value={data.health.history}
                        onChange={(e) => updateData('health', 'history', e.target.value)}
                        placeholder="سجل تاريخك المرضي هنا..."
                        rows={4}
                        className="w-full p-4 rounded-xl bg-app-surface border border-app-border text-app-text-primary outline-none focus:border-rose-500 transition-colors resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-app-text-secondary mb-2">الحالة الصحية الحالية (أدوية، حساسية...)</label>
                      <textarea
                        value={data.health.currentConditions}
                        onChange={(e) => updateData('health', 'currentConditions', e.target.value)}
                        placeholder="سجل حالتك الصحية الحالية والأدوية..."
                        rows={4}
                        className="w-full p-4 rounded-xl bg-app-surface border border-app-border text-app-text-primary outline-none focus:border-rose-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Health Assessment Page */}
              {activeSection === 'health' && activeHealthCategory === 'assessment' && (
                <motion.div
                  key="health-assessment"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <HealthAssessmentPage />
                </motion.div>
              )}

              {/* Mental Health Assessment Page */}
              {activeSection === 'health' && activeHealthCategory === 'mental_health' && (
                <motion.div
                  key="health-mental"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <MentalHealthAssessmentPage />
                </motion.div>
              )}

              {activeSection === 'work' && activeWorkCategory === 'assessment' && (
                <motion.div
                  key="work-assessment"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <WorkAssessmentPage />
                </motion.div>
              )}

              {/* Checkups Full Page */}
              {activeSection === 'health' && activeHealthCategory === 'checkups' && (
                <motion.div 
                  key="health-checkups"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black text-app-text-primary mb-2">جدول الفحوصات الدورية</h3>
                  <p className="text-sm text-app-text-secondary mb-6">قائمة بأهم الفحوصات والتحاليل الدورية الموصى بها للحفاظ على صحتك.</p>
                  
                  <div className="space-y-3">
                    {[
                      { title: 'فحص شامل (تحاليل دم، سكر، كوليسترول)', frequency: 'سنوي', priority: 'عالية' },
                      { title: 'فحص ضغط الدم', frequency: 'كل 6 أشهر', priority: 'عالية' },
                      { title: 'فحص الأسنان', frequency: 'كل 6 أشهر', priority: 'متوسطة' },
                      { title: 'فحص النظر', frequency: 'سنوي', priority: 'متوسطة' },
                      { title: 'فحص الجلد (شامات)', frequency: 'سنوي', priority: 'منخفضة' },
                    ].map((item, index) => {
                      const isCompleted = (data.health.completedCheckups || []).includes(item.title);
                      return (
                        <div 
                          key={index} 
                          onClick={() => toggleCheckup(item.title)}
                          className={`flex items-center gap-4 p-4 rounded-xl border border-app-border cursor-pointer transition-all ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-app-surface'}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-emerald-500' : item.priority === 'عالية' ? 'bg-rose-500' : item.priority === 'متوسطة' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                          <div className="flex-1">
                            <h4 className={`font-bold text-app-text-primary ${isCompleted ? 'line-through text-app-text-secondary' : ''}`}>{item.title}</h4>
                            <p className="text-xs text-app-text-secondary">{item.frequency}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCompleted ? 'bg-emerald-500/10 text-emerald-500' : item.priority === 'عالية' ? 'bg-rose-500/10 text-rose-500' : item.priority === 'متوسطة' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {isCompleted ? 'مكتمل' : item.priority}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Work Tab */}
              {activeSection === 'work' && !activeWorkCategory && (
                <motion.div 
                  key="work-main"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Work Info Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveWorkCategory('info')}
                      className="p-6 rounded-3xl bg-blue-500/5 border-2 border-blue-500/20 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <WorkIcon size={28} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-app-text-primary">المعلومات المهنية</h4>
                          <p className="text-sm text-app-text-secondary">المسمى، الشركة، والخبرة</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Work Assessments Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveWorkCategory('assessment')}
                      className="p-6 rounded-3xl bg-amber-500/5 border-2 border-amber-500/20 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Target size={28} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-app-text-primary">اختبارات العمل</h4>
                          <p className="text-sm text-app-text-secondary">قس رضاك وتوازنك المهني</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'work' && activeWorkCategory === 'info' && (
                <motion.div 
                  key="work-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-app-text-secondary mb-2">المسمى الوظيفي</label>
                      <input
                        type="text"
                        value={data.work.title}
                        onChange={(e) => updateData('work', 'title', e.target.value)}
                        placeholder="مثال: مهندس برمجيات"
                        className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-app-text-secondary mb-2">جهة العمل / الشركة</label>
                      <input
                        type="text"
                        value={data.work.company}
                        onChange={(e) => updateData('work', 'company', e.target.value)}
                        placeholder="اسم الشركة"
                        className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-app-text-secondary mb-2">سنوات الخبرة</label>
                      <input
                        type="text"
                        value={data.work.experience}
                        onChange={(e) => updateData('work', 'experience', e.target.value)}
                        placeholder="مثال: 5 سنوات"
                        className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-app-text-secondary mb-2">الراتب (اختياري)</label>
                      <input
                        type="text"
                        value={data.work.salary}
                        onChange={(e) => updateData('work', 'salary', e.target.value)}
                        placeholder="الراتب الحالي"
                        className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-app-text-secondary mb-2">الطموحات والأهداف المهنية</label>
                    <textarea
                      value={data.work.goals}
                      onChange={(e) => updateData('work', 'goals', e.target.value)}
                      placeholder="ماذا تطمح لتحقيقه في مسيرتك المهنية؟"
                      rows={4}
                      className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-amber-500 transition-colors resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Learning Tab */}
              {activeSection === 'learning' && !activeLearningCategory && (
                <motion.div 
                  key="learning-main"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Learning Info Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveLearningCategory('info')}
                      className="p-6 rounded-3xl bg-blue-500/5 border-2 border-blue-500/20 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <GraduationCap size={28} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-app-text-primary">الدورات والتعلم</h4>
                          <p className="text-sm text-app-text-secondary">سجل مهاراتك ودوراتك</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Learning Assessments Card */}
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveLearningCategory('assessment')}
                      className="p-6 rounded-3xl bg-emerald-500/5 border-2 border-emerald-500/20 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Target size={28} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-app-text-primary">اختبارات التعلم</h4>
                          <p className="text-sm text-app-text-secondary">اكتشف نمط تعلمك</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeSection === 'learning' && activeLearningCategory === 'assessment' && (
                <motion.div
                  key="learning-assessment"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <LearningAssessmentPage />
                </motion.div>
              )}

              {activeSection === 'learning' && activeLearningCategory === 'info' && (
                <motion.div 
                  key="learning-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-black text-app-text-primary flex items-center gap-2">
                        <GraduationCap size={20} className="text-emerald-500" /> الدورات والتعلم
                      </h3>
                      <Button onClick={addCourse} variant="ghost" size="sm" className="text-emerald-500 hover:bg-emerald-500/10">
                        <Plus size={16} className="ml-1" /> إضافة دورة
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {data.learning.courses.map(course => (
                        <div key={course.id} className="flex flex-col md:flex-row gap-3 p-4 rounded-2xl bg-app-bg border border-app-border">
                          <input
                            type="text"
                            placeholder="اسم الدورة أو الموضوع"
                            value={course.title}
                            onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-app-text-primary placeholder:text-app-text-secondary focus:ring-0"
                          />
                          <select
                            value={course.status}
                            onChange={(e) => updateCourse(course.id, 'status', e.target.value)}
                            className="bg-app-surface border border-app-border text-app-text-primary rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                          >
                            <option value="planned">مخطط لها</option>
                            <option value="in-progress">قيد التعلم</option>
                            <option value="completed">مكتملة</option>
                          </select>
                          <button onClick={() => removeCourse(course.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      {data.learning.courses.length === 0 && (
                        <p className="text-app-text-secondary text-sm text-center py-4">لم تقم بإضافة أي دورات بعد.</p>
                      )}
                    </div>
                  </div>

                  <div className="h-px w-full bg-app-border" />

                  <div>
                    <label className="block text-sm font-bold text-app-text-secondary mb-2">أدوات ومهارات أود تعلمها</label>
                    <textarea
                      value={data.learning.skills}
                      onChange={(e) => updateData('learning', 'skills', e.target.value)}
                      placeholder="سجل المهارات والأدوات التي ترغب في اكتسابها مستقبلاً..."
                      rows={4}
                      className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-app-surface border border-app-border rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-black text-app-text-primary mb-4">إضافة فئة جديدة</h3>
              <input
                type="text"
                value={newCategoryTitle}
                onChange={(e) => setNewCategoryTitle(e.target.value)}
                placeholder="اسم الفئة (مثال: زملاء العمل)"
                className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-blue-500 transition-colors mb-6"
                autoFocus
              />
              <div className="flex gap-3">
                <Button onClick={addCategory} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">إضافة</Button>
                <Button onClick={() => setShowAddCategoryModal(false)} variant="outline" className="flex-1">إلغاء</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Person Modal */}
      <AnimatePresence>
        {showAddPersonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-app-surface border border-app-border rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-black text-app-text-primary mb-4">إضافة شخص جديد</h3>
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  placeholder="الاسم"
                  className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-emerald-500 transition-colors"
                  autoFocus
                />
                <textarea
                  value={newPersonTask}
                  onChange={(e) => setNewPersonTask(e.target.value)}
                  placeholder="تفاصيل المهمة أو الملاحظات..."
                  rows={3}
                  className="w-full p-4 rounded-xl bg-app-bg border border-app-border text-app-text-primary outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={addPerson} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">إضافة</Button>
                <Button onClick={() => setShowAddPersonModal(false)} variant="outline" className="flex-1">إلغاء</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
