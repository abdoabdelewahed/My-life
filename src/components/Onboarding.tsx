import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Brain, Zap, Target, Star } from 'lucide-react';

export const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: <Brain className="text-white w-10 h-10 md:w-14 md:h-14" />,
      title: "العادات والنمو",
      desc: "أنت مجموع عاداتك اليومية. فهم هذه العادات هو المفتاح الأول للتحكم في حياتك.",
      color: "from-[#1a3a5f] to-[#0d1b2a]",
      accent: "bg-blue-500"
    },
    {
      icon: <Target className="text-white w-10 h-10 md:w-14 md:h-14" />,
      title: "اكتشاف الذات",
      desc: "حلل قدراتك، افهم نقاط قوتك، وحدد مساراتك للنمو بوعي كامل.",
      color: "from-[#1a4d2e] to-[#0d2617]",
      accent: "bg-emerald-500"
    },
    {
      icon: <Zap className="text-white w-10 h-10 md:w-14 md:h-14" />,
      title: "التحسين المستمر",
      desc: "اجتز الاختبارات، وافتح مسارات التطوير الخاصة بك لتصل لنسختك الأفضل.",
      color: "from-[#4a1a4d] to-[#260d26]",
      accent: "bg-purple-500"
    }
  ];

  const nextStep = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#020408] z-[100] flex flex-col items-center overflow-hidden font-sans">
      {/* Ethereal Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            backgroundColor: step === 0 ? 'rgba(59, 130, 246, 0.5)' : step === 1 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(168, 85, 247, 0.5)'
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] rounded-full blur-[80px] md:blur-[150px] opacity-70"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
            backgroundColor: step === 0 ? 'rgba(30, 58, 138, 0.5)' : step === 1 ? 'rgba(6, 78, 59, 0.5)' : 'rgba(88, 28, 135, 0.5)'
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[10%] -left-[10%] w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] rounded-full blur-[80px] md:blur-[150px] opacity-70"
        />
      </div>

      {/* Card Carousel Area */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-[350px] md:max-w-[500px] aspect-[0.75] flex items-center justify-center">
          <AnimatePresence mode="popLayout">
            {slides.map((slide, index) => {
              const distance = index - step;
              const isActive = index === step;
              
              // Only show current and neighbors
              if (Math.abs(distance) > 1) return null;

              return (
                <motion.div
                  key={index}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50 && step < slides.length - 1) {
                      setStep(step + 1);
                    } else if (info.offset.x > 50 && step > 0) {
                      setStep(step - 1);
                    }
                  }}
                  initial={{ 
                    scale: 0.8,
                    x: distance > 0 ? 300 : -300,
                    opacity: 0,
                    rotateY: distance > 0 ? -25 : 25,
                  }}
                  animate={{ 
                    scale: isActive ? 1 : 0.85, 
                    x: distance * 340, // Offset for side cards
                    y: isActive ? [0, -10, 0] : 0,
                    opacity: isActive ? 1 : 0.4,
                    rotateY: isActive ? 0 : (distance > 0 ? -15 : 15),
                    zIndex: isActive ? 20 : 10,
                  }}
                  exit={{ 
                    scale: 0.8,
                    x: distance < 0 ? -300 : 300,
                    opacity: 0,
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 26,
                    y: isActive ? {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : undefined
                  }}
                  className={`absolute w-full h-full rounded-[48px] p-8 flex flex-col items-center text-center justify-center border border-white/10 shadow-2xl bg-gradient-to-b ${slide.color} overflow-hidden touch-none cursor-grab active:cursor-grabbing`}
                >
                  {/* Starry/Noise Texture Overlay */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" 
                       style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                  
                  {/* Icon Container with Rings */}
                  <div className="relative mb-12">
                    {/* Outer Glow Rings */}
                    <div className="absolute inset-[-20px] rounded-full border border-white/5 animate-pulse" />
                    <div className="absolute inset-[-10px] rounded-full border border-white/10" />
                    
                    <motion.div 
                      animate={isActive ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl relative z-10"
                    >
                      {slide.icon}
                      {/* Inner Glow */}
                      <motion.div 
                        animate={isActive ? { scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute inset-4 rounded-full ${slide.accent} opacity-20 blur-xl -z-10`} 
                      />
                    </motion.div>
                  </div>

                  <motion.h3 
                    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight"
                  >
                    {slide.title}
                  </motion.h3>
                  <motion.p 
                    animate={isActive ? { opacity: [0.6, 0.8, 0.6] } : {}}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-lg md:text-xl text-white/60 leading-relaxed font-medium px-4"
                  >
                    {slide.desc}
                  </motion.p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="w-full max-w-xl px-8 pb-12 flex flex-col items-center text-center">
        {/* CTA Button - White Pill */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <button
            onClick={nextStep}
            className="group relative w-full h-16 md:h-18 bg-white rounded-full flex items-center justify-center gap-3 overflow-hidden transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
          >
            <span className="text-black text-lg md:text-xl font-black tracking-tight z-10">
              {step < slides.length - 1 ? "لنكتشف المزيد" : "لنبدأ الرحلة الآن"}
            </span>
            <div className="flex items-center gap-0.5 z-10">
              <ChevronLeft className="text-black w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
              <ChevronLeft className="text-black/40 w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform delay-75" />
              <ChevronLeft className="text-black/20 w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform delay-150" />
            </div>

            {/* Subtle Shine Effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -skew-x-12 pointer-events-none"
            />
          </button>
        </motion.div>

        {/* Pagination Dots */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
