import React from 'react';
import { motion } from 'motion/react';
import { X, Heart, Star, BookOpen, Shield, Zap, Target, Award, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';

interface PrayerBenefitsPageProps {
  onClose: () => void;
}

export const PrayerBenefitsPage = ({ onClose }: PrayerBenefitsPageProps) => {
  const benefits = [
    {
      title: 'الراحة النفسية والسكينة',
      description: 'الصلاة هي صلة بين العبد وربه، تمنح القلب طمأنينة وتزيل الهموم والقلق.',
      icon: <Heart className="text-rose-400" size={24} />,
      bg: 'bg-rose-500/10'
    },
    {
      title: 'تنظيم الوقت والانضباط',
      description: 'توزيع الصلوات على مدار اليوم يساعد في تنظيم الجدول اليومي وزيادة الإنتاجية.',
      icon: <Target className="text-blue-400" size={24} />,
      bg: 'bg-blue-500/10'
    },
    {
      title: 'النشاط البدني والحركي',
      description: 'حركات الصلاة من قيام وركوع وسجود تنشط الدورة الدموية وتلين المفاصل.',
      icon: <Zap className="text-yellow-400" size={24} />,
      bg: 'bg-yellow-500/10'
    },
    {
      title: 'الوقاية من الفحشاء والمنكر',
      description: 'الصلاة تنهى عن الفحشاء والمنكر وتهذب الأخلاق وتزكي النفس.',
      icon: <Shield className="text-emerald-400" size={24} />,
      bg: 'bg-emerald-500/10'
    }
  ];

  const steps = [
    { title: 'النية والوضوء', desc: 'استحضار النية في القلب والوضوء للصلاة.' },
    { title: 'تكبيرة الإحرام', desc: 'استقبال القبلة ورفع اليدين والتكبير.' },
    { title: 'قراءة الفاتحة', desc: 'قراءة سورة الفاتحة وما تيسر من القرآن.' },
    { title: 'الركوع والسجود', desc: 'أداء الركوع والسجود بخشوع وطمأنينة.' },
    { title: 'التشهد والتسليم', desc: 'الجلوس للتشهد الأخير ثم التسليم عن اليمين واليسار.' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-[#0a0a0a] z-[200] overflow-y-auto text-white font-sans"
      dir="rtl"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onClose} variant="ghost" size="sm" className="w-10 h-10 rounded-full p-0">
            <ChevronRight size={24} />
          </Button>
          <h2 className="text-xl font-black">الأجر والفوائد</h2>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 rounded-[2.5rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-20" />
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
              <Star className="text-yellow-400" size={40} fill="currentColor" />
            </div>
            <h3 className="text-3xl font-black mb-4">فضل الصلاة</h3>
            <p className="text-white/80 font-bold leading-relaxed">
              "الصلاة عماد الدين، من أقامها فقد أقام الدين، ومن هدمها فقد هدم الدين"
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-4">
          <h4 className="text-xl font-black px-2">فوائد الصلاة</h4>
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#181818] p-6 rounded-[2rem] border border-white/5 flex items-start gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${benefit.bg}`}>
                  {benefit.icon}
                </div>
                <div>
                  <h5 className="font-black text-lg mb-1">{benefit.title}</h5>
                  <p className="text-gray-400 text-sm font-bold leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How to Pray Section */}
        <div className="space-y-4">
          <h4 className="text-xl font-black px-2">كيفية أداء الصلاة</h4>
          <div className="bg-[#181818] rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div className="p-6 space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 relative">
                  {index !== steps.length - 1 && (
                    <div className="absolute top-10 bottom-0 right-5 w-0.5 bg-white/5" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-black text-white shrink-0 z-10">
                    {index + 1}
                  </div>
                  <div className="pt-1">
                    <h5 className="font-black text-white mb-1">{step.title}</h5>
                    <p className="text-gray-400 text-sm font-bold">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Encouragement Card */}
        <div className="bg-emerald-500/10 p-8 rounded-[2.5rem] border border-emerald-500/20 text-center">
          <BookOpen className="text-emerald-500 mx-auto mb-4" size={32} />
          <h4 className="text-xl font-black text-emerald-500 mb-2">استمر في رحلتك</h4>
          <p className="text-gray-300 font-bold text-sm leading-relaxed">
            كل صلاة تؤديها هي خطوة نحو حياة أكثر توازناً وسعادة. نحن هنا لندعمك في كل خطوة.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
