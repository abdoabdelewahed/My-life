import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import * as Lucide from 'lucide-react';
import { Button } from './ui/Button';
const { 
  Globe, 
  Target, 
  Sparkles, 
  Rocket, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight, 
  Heart, 
  Lightbulb, 
  TrendingUp,
  Award,
  Cpu,
  MousePointer2,
  Fingerprint
} = Lucide;

interface AboutPageProps {
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const FloatingElement = ({ children, delay = 0, duration = 4 }: { children: React.ReactNode, delay?: number, duration?: number }) => (
  <motion.div
    animate={{
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

export const AboutPage = ({ onBack }: AboutPageProps) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const values = [
      {
        title: 'تتبع العادات',
        description: 'ابنِ عاداتك الإيجابية وتخلص من العادات السلبية من خلال نظام تتبع ذكي ومحفز.',
        icon: <Sparkles className="text-emerald-400" size={28} />,
        bg: 'from-emerald-500/20 to-transparent'
      },
      {
        title: 'مسارات التعلم',
        description: 'تطور في مختلف مجالات الحياة عبر مسارات تعلم تفاعلية مصممة خصيصاً لك.',
        icon: <Target className="text-blue-400" size={28} />,
        bg: 'from-blue-500/20 to-transparent'
      },
      {
        title: 'بناء القدرات',
        description: 'اكتشف قدراتك الكامنة وطور مهاراتك الشخصية والعملية لتصل إلى أفضل نسخة من نفسك.',
        icon: <Zap className="text-purple-400" size={28} />,
        bg: 'from-purple-500/20 to-transparent'
      }
    ];

  return (
    <div className="relative min-h-screen pb-24 overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation Header */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="sticky top-0 z-50 py-4 md:py-6 mb-6 md:mb-8 flex items-center gap-3 md:gap-4 backdrop-blur-md px-4 max-w-full w-full mx-auto"
      >
        <Button 
          onClick={onBack}
          variant="secondary"
          size="md"
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl p-0"
        >
          <ArrowRight size={20} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
        </Button>
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">عن المنصة</h2>
          <p className="text-[10px] md:text-xs text-emerald-400 font-bold uppercase tracking-widest">الرؤية والرسالة</p>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative mb-16 md:mb-24 pt-8 md:pt-12 text-center"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4 opacity-10">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="h-10 md:h-20 border-l border-t border-white/20" />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-1.5 md:gap-2 px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs md:text-sm font-black mb-6 md:mb-8">
            <Sparkles size={14} className="md:w-4 md:h-4" />
            <span>مساحتك الآمنة للتطور</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-[1.2] md:leading-[1.1] mb-4 md:mb-6 tracking-tighter">
            منصة النمو الذاتي والوعي <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500">
              رحلتك نحو أفضل نسخة من نفسك
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-xl text-gray-400 font-medium leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto">
            منصة متكاملة لتطوير الذات، تتبع العادات، وبناء القدرات الشخصية من خلال مسارات تعلم تفاعلية مصممة خصيصاً لك.
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <div className="text-2xl md:text-4xl font-black text-white">2026</div>
              <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">عام التغيير الإيجابي</div>
            </div>
            <div className="w-px h-8 md:h-12 bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <div className="text-2xl md:text-4xl font-black text-white">+10</div>
              <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">مسارات تعلم وتطوير</div>
            </div>
            <div className="w-px h-8 md:h-12 bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <div className="text-2xl md:text-4xl font-black text-white">∞</div>
              <div className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">عادات إيجابية مستدامة</div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Core Values - Interactive Cards */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-16 md:mb-24 px-4 max-w-full w-full mx-auto"
      >
        {values.map((value, idx) => (
          <motion.div
            key={idx}
            variants={fadeInScale}
            whileHover={{ y: -5 }}
            className="relative group p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] bg-[#181818] border border-white/5 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${value.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-black/40 flex items-center justify-center mb-4 md:mb-8 border border-white/10 shadow-xl md:shadow-2xl group-hover:scale-110 transition-transform">
                {React.cloneElement(value.icon as React.ReactElement, { className: 'w-6 h-6 md:w-7 md:h-7 text-[color:inherit]' })}
              </div>
              <h3 className="text-lg md:text-2xl font-black text-white mb-2 md:mb-4 tracking-tight">{value.title}</h3>
              <p className="text-xs md:text-base text-gray-400 leading-relaxed font-medium">
                {value.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* The Vision Section - Split Layout */}
      <section className="mb-16 md:mb-24 px-4 max-w-full w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe size={24} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight">
              لماذا نحن؟ <br />
              <span className="text-blue-400">لأن التغيير يبدأ بخطوة.</span>
            </h2>
            <p className="text-sm md:text-lg text-gray-400 font-medium leading-relaxed">
              نحن نؤمن بأن التطور الشخصي ليس وجهة نصل إليها، بل رحلة مستمرة. من خلال تتبع العادات اليومية، وبناء القدرات عبر مسارات تعلم منهجية، نساعدك على تحقيق أهدافك بخطوات ثابتة ومستدامة.
            </p>
            <ul className="space-y-3 md:space-y-4">
              {[
                'تتبع ذكي للعادات اليومية',
                'مسارات تعلم مخصصة',
                'تقييم مستمر للقدرات',
                'بيئة محفزة وداعمة للتطور'
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-white font-bold"
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Zap size={12} className="md:w-3.5 md:h-3.5" />
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square mt-8 lg:mt-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-3xl md:rounded-[3rem] blur-2xl md:blur-3xl" />
            <div className="relative h-full w-full bg-[#181818] border border-white/10 rounded-3xl md:rounded-[3rem] p-6 md:p-12 flex flex-col items-center justify-center text-center overflow-hidden">
              <FloatingElement duration={5}>
                <div className="w-20 h-20 md:w-32 md:h-32 bg-emerald-500/20 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-emerald-400 mb-6 md:mb-8 shadow-xl md:shadow-2xl border border-emerald-500/30">
                  <Rocket size={40} className="md:w-16 md:h-16" />
                </div>
              </FloatingElement>
              <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-4">انطلق نحو التغيير</h3>
              <p className="text-xs md:text-base text-gray-400 font-medium">نحن نجهزك لتكون أفضل نسخة من نفسك في كل جوانب الحياة.</p>
              
              {/* Decorative Circles */}
              <div className="absolute -top-5 -right-5 md:-top-10 md:-right-10 w-20 h-20 md:w-40 md:h-40 border border-white/5 rounded-full" />
              <div className="absolute -bottom-5 -left-5 md:-bottom-10 md:-left-10 w-30 h-30 md:w-60 md:h-60 border border-white/5 rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action / Final Quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative p-8 md:p-16 mx-4 md:mx-auto max-w-full w-full rounded-3xl md:rounded-[3rem] bg-gradient-to-br from-emerald-600/20 via-blue-600/10 to-transparent border border-white/10 text-center overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Sparkles className="absolute top-5 left-5 md:top-10 md:left-10 text-white w-6 h-6 md:w-10 md:h-10" />
          <Zap className="absolute bottom-5 right-5 md:bottom-10 md:right-10 text-white w-6 h-6 md:w-10 md:h-10" />
          <Award className="absolute top-1/2 right-5 md:right-10 text-white w-6 h-6 md:w-10 md:h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-4 md:mb-8 tracking-tight">
          هل أنت مستعد لبدء <br /> <span className="text-emerald-400">رحلة التطور؟</span>
        </h2>
        <p className="text-sm md:text-xl text-gray-400 font-medium mb-6 md:mb-10 max-w-2xl mx-auto">
          انضم إلينا اليوم وابدأ رحلتك نحو بناء عادات إيجابية وتطوير قدراتك. التغيير يبدأ الآن.
        </p>
        
        <Button
          onClick={onBack}
          variant="success"
          size="xl"
          className="mx-auto"
        >
          ابدأ رحلتك الآن
          <ArrowRight size={20} className="md:w-6 md:h-6" />
        </Button>
      </motion.div>

      {/* Footer Signature */}
      <div className="mt-16 md:mt-24 text-center px-4 max-w-full w-full mx-auto">
        <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/5">
          <Heart size={16} className="md:w-5 md:h-5 text-red-500 animate-pulse" />
          <span className="text-gray-500 font-black text-[10px] md:text-sm uppercase tracking-widest">
            صُنع لتمكين العقل العربي • 2026
          </span>
        </div>
      </div>
    </div>
  );
};
