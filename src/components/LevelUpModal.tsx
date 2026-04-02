import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Sparkles, ArrowRight, X, Crown, Rocket, Terminal, Code, Brain, Telescope } from 'lucide-react';
import { playPop } from '../utils/sounds';
import { Button } from './ui/Button';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  character: {
    name: string;
    icon: string;
    description: string;
  };
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Telescope,
    Brain,
    Code,
    Terminal,
    Rocket,
    Crown
  };
  return icons[iconName] || Trophy;
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, level, character }) => {
  const CharacterIcon = getIconComponent(character.icon);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#181818] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-orange-500/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="p-8 md:p-12 text-center">
              {/* Celebration Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ type: "tween", duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.4)] relative"
              >
                <CharacterIcon size={48} className="text-white md:w-16 md:h-16" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-yellow-400 text-black w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg"
                >
                  {level}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">
                  تهانينا! لقد ارتقيت
                </h2>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="h-px w-8 bg-orange-500/50" />
                  <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs">مستوى جديد</span>
                  <span className="h-px w-8 bg-orange-500/50" />
                </div>

                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-2">{character.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {character.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-orange-500 mb-1 flex justify-center">
                      <Star size={20} fill="currentColor" />
                    </div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">مكافأة XP</div>
                    <div className="text-lg font-black text-white">+500</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="text-purple-500 mb-1 flex justify-center">
                      <Sparkles size={20} fill="currentColor" />
                    </div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">أدوات جديدة</div>
                    <div className="text-lg font-black text-white">مفتوحة</div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    playPop();
                    onClose();
                  }}
                  variant="primary"
                  size="xl"
                  fullWidth
                  className="py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-orange-50 transition-colors"
                >
                  استمر في الرحلة
                  <ArrowRight size={20} />
                </Button>
              </motion.div>
            </div>

            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors p-0"
            >
              <X size={24} />
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
