import React from 'react';
import { motion } from 'motion/react';
import * as Lucide from 'lucide-react';
import { Button } from './ui/Button';
import { Switch } from './ui/Switch';

const { Volume2, VolumeX, ChevronRight, Moon, Sun } = Lucide;

interface SettingsPageProps {
  onBack: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  visibleTabs: string[];
  setVisibleTabs: (tabs: string[]) => void;
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
}

export const SettingsPage = ({ 
  onBack, 
  soundEnabled, 
  setSoundEnabled,
  visibleTabs,
  setVisibleTabs,
  darkMode,
  setDarkMode
}: SettingsPageProps) => {
  const toggleTab = (tabId: string) => {
    if (visibleTabs.includes(tabId)) {
      // Don't allow hiding all tabs
      if (visibleTabs.length > 1) {
        setVisibleTabs(visibleTabs.filter(id => id !== tabId));
      }
    } else {
      setVisibleTabs([...visibleTabs, tabId]);
    }
  };

  const pages = [
    { id: 'tasks', label: 'الرئيسية', icon: <Lucide.Home size={20} /> },
    { id: 'routine', label: 'روتيني', icon: <Lucide.Activity size={20} /> },
    { id: 'abilities', label: 'القدرات', icon: <Lucide.Brain size={20} /> },
    { id: 'mylife', label: 'حياتي', icon: <Lucide.Heart size={20} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="ghost" size="sm" className="w-10 h-10 rounded-full p-0">
          <ChevronRight size={24} />
        </Button>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">الإعدادات</h2>
      </div>

      {/* Theme Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-900 dark:text-white">
            {darkMode ? <Moon size={24} /> : <Sun size={24} />}
          </div>
          <div>
            <h4 className="text-lg font-black text-gray-900 dark:text-white">الوضع الليلي</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mt-1">
              {darkMode ? 'تم تفعيل الوضع الليلي' : 'تم تفعيل الوضع النهاري'}
            </p>
          </div>
        </div>
        <Switch 
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
      </motion.div>

      {/* Sound Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#181818] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-900 dark:text-white">
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </div>
          <div>
            <h4 className="text-lg font-black text-gray-900 dark:text-white">الصوت</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mt-1">
              {soundEnabled ? 'تم تفعيل المؤثرات الصوتية' : 'تم تعطيل المؤثرات الصوتية'}
            </p>
          </div>
        </div>
        <Switch 
          checked={soundEnabled}
          onCheckedChange={setSoundEnabled}
        />
      </motion.div>

      {/* Page Visibility */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-gray-900 dark:text-white px-2">إدارة الصفحات</h3>
        <div className="grid grid-cols-1 gap-3">
          {pages.map((page) => (
            <motion.div 
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#181818] p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-900 dark:text-white">
                  {page.icon}
                </div>
                <h4 className="text-base font-black text-gray-900 dark:text-white">{page.label}</h4>
              </div>
              <Switch 
                checked={visibleTabs.includes(page.id)}
                onCheckedChange={() => toggleTab(page.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
