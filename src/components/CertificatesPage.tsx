import React, { useRef, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Download, Award, Edit2, Save, ShieldCheck, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { LEARNING_PATHS, PATH_COLORS } from '../constants';
import { Button } from './ui/Button';

interface CertificatesPageProps {
  pathProgress: Record<string, number>;
  userName: string;
  onUpdateName: (name: string) => void;
}

interface CertificateCardProps {
  id: string;
  certTitle: string;
  certType: 'path' | 'unit';
  color: any;
  userName: string;
  onDownload: (id: string, title: string) => void;
  setRef: (el: HTMLDivElement | null) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ 
  id, certTitle, certType, color, userName, onDownload, setRef 
}) => {
  const isGraduation = certType === 'path';
  
  // Stable ID based on user name and path/unit ID
  const stableHash = useMemo(() => {
    const str = `${userName}-${id}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).toUpperCase().slice(0, 6);
  }, [userName, id]);

  const certId = `KW-${id.toUpperCase().slice(0, 3)}-${stableHash}`;
  
  return (
    <div className="space-y-4 md:space-y-12 mb-8 md:mb-12">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${color.bg}`} />
          <h4 className="text-sm md:text-lg font-bold text-white max-w-[150px] md:max-w-none truncate">{certTitle}</h4>
          {isGraduation && (
            <span className="flex items-center gap-0.5 md:gap-1 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[8px] md:text-[10px] font-black text-amber-500 uppercase tracking-wider whitespace-nowrap">
              <ShieldCheck size={8} className="md:w-2.5 md:h-2.5" /> مسار معتمد
            </span>
          )}
        </div>
        <Button 
          onClick={() => onDownload(id, certTitle)}
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1 md:gap-2 font-bold ${color.text} hover:opacity-80 transition-colors cursor-pointer whitespace-nowrap p-0 h-auto`}
        >
          <Download size={12} className="md:w-3.5 md:h-3.5" /> تحميل
        </Button>
      </div>

      <div 
        className="relative aspect-[1.414/1] rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.5)] md:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
      >
        {/* Certificate Content */}
        <div 
          ref={setRef}
          className="absolute inset-0 bg-[#0f0f0f] p-4 md:p-12 flex flex-col items-center justify-between text-center overflow-hidden"
        >
          {/* Ethereal Background Effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute -bottom-16 -right-16 md:-bottom-32 md:-right-32 w-[200px] h-[200px] md:w-[400px] md:h-[400px] blur-[60px] md:blur-[120px] opacity-20 rounded-full"
              style={{ backgroundColor: color.main }}
            />
            <div 
              className="absolute -top-16 -left-16 md:-top-32 md:-left-32 w-[150px] h-[150px] md:w-[300px] md:h-[300px] blur-[50px] md:blur-[100px] opacity-10 rounded-full"
              style={{ backgroundColor: color.main }}
            />
            
            <div 
              className="absolute inset-0 opacity-[0.05]"
              style={{ 
                background: `radial-gradient(circle at 50% 100%, ${color.main} 0%, transparent 70%)` 
              }} 
            />

            {/* Double Border for Graduation */}
            <div className="absolute inset-3 md:inset-6 border border-white/5 rounded-xl md:rounded-[1.5rem]" />
            {isGraduation && (
              <>
                <div className="absolute inset-[0.9rem] md:inset-[1.85rem] border border-amber-500/20 rounded-lg md:rounded-[1.35rem]" />
                {/* Guilloche-style subtle pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(245, 158, 11, 0.5) 1px, transparent 0)`,
                    backgroundSize: '12px 12px'
                  }}
                />
              </>
            )}
            <div className="absolute inset-4 md:inset-8 border border-white/[0.03] rounded-lg md:rounded-[1.25rem]" />
            
            <div className={`absolute top-5 right-5 md:top-10 md:right-10 w-6 h-6 md:w-12 md:h-12 border-t md:border-t-2 border-r md:border-r-2 ${isGraduation ? 'border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : color.border + ' opacity-20'} rounded-tr-xl md:rounded-tr-2xl`} />
            <div className={`absolute top-5 left-5 md:top-10 md:left-10 w-6 h-6 md:w-12 md:h-12 border-t md:border-t-2 border-l md:border-l-2 ${isGraduation ? 'border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : color.border + ' opacity-20'} rounded-tl-xl md:rounded-tl-2xl`} />
            <div className={`absolute bottom-5 right-5 md:bottom-10 md:right-10 w-6 h-6 md:w-12 md:h-12 border-b md:border-b-2 border-r md:border-r-2 ${isGraduation ? 'border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : color.border + ' opacity-20'} rounded-br-xl md:rounded-br-2xl`} />
            <div className={`absolute bottom-5 left-5 md:bottom-10 md:left-10 w-6 h-6 md:w-12 md:h-12 border-b md:border-b-2 border-l md:border-l-2 ${isGraduation ? 'border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : color.border + ' opacity-20'} rounded-bl-xl md:rounded-bl-2xl`} />

            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>

          <div className="relative z-10 space-y-2 md:space-y-6 w-full mt-2 md:mt-4">
            <div className="space-y-1 md:space-y-3">
              <div className="flex flex-col items-center gap-0.5 md:gap-1">
                <span className={`text-[6px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] ${isGraduation ? 'text-amber-500' : color.text} opacity-60 mb-0.5 md:mb-1`}>منصة</span>
                <h1 className={`text-lg md:text-3xl font-black tracking-tighter ${isGraduation ? 'bg-gradient-to-b from-amber-200 via-amber-500 to-amber-700 bg-clip-text text-transparent' : 'text-white'}`}>
                  الثراء المعرفي
                </h1>
              </div>
              <div className={`h-px w-16 md:w-32 mx-auto ${isGraduation ? 'bg-gradient-to-r from-transparent via-amber-500/40 to-transparent' : ''}`} 
                   style={!isGraduation ? { backgroundColor: `${color.main}33` } : {}} />
              <h2 className={`text-[8px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.5em] font-black ${isGraduation ? 'text-amber-500/80' : 'text-gray-500'}`}>
                {isGraduation ? 'شهادة تخرج معتمدة' : 'شهادة إتمام وحدة تعليمية'}
              </h2>
            </div>

            <div className="space-y-0.5 md:space-y-1">
              <p className="text-[6px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">نقر بكل فخر واعتزاز بأن</p>
              <div className="py-1 md:py-2">
                <p className="text-xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] md:drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  {userName || 'اسمك هنا'}
                </p>
              </div>
            </div>

            <div className="space-y-1 md:space-y-4">
              <div className="text-[10px] md:text-base text-gray-400 leading-relaxed max-w-[200px] md:max-w-lg mx-auto font-medium">
                قد اجتاز بنجاح {isGraduation ? 'كافة متطلبات مسار' : 'متطلبات وحدة'} 
                <span className={`block text-sm md:text-2xl mt-1 md:mt-2 font-black ${isGraduation ? 'bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent' : color.text} drop-shadow-[0_0_5px_rgba(255,255,255,0.1)] md:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                  {certTitle}
                </span>
              </div>

              <p className="text-[6px] md:text-[10px] text-gray-500 italic opacity-80 hidden sm:block">
                {isGraduation 
                  ? 'مظهراً شغفاً بالمعرفة وتفوقاً في المهارات التقنية والذهنية المطلوبة للتخرج.'
                  : 'مظهراً التزاماً بالتعلم وإتقاناً للمهارات الأساسية لهذه الوحدة.'}
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full flex justify-between items-end pt-2 md:pt-6 px-2 md:px-4">
            <div className="text-right flex gap-2 md:gap-10 items-end">
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-[5px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 font-black">تاريخ المنح</p>
                <p className="text-[8px] md:text-sm font-black text-white">{new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                <p className="text-[5px] md:text-[8px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-gray-400 font-black">رقم الشهادة</p>
                <p className={`text-[6px] md:text-[10px] font-mono font-bold ${isGraduation ? 'text-amber-500/60' : 'text-gray-500/60'}`}>{certId}</p>
              </div>
            </div>

            <div className="text-center flex flex-col items-center relative">
              {isGraduation ? (
                <div className="flex items-center gap-2 md:gap-6">
                  {/* Premium Gold Seal */}
                  <div className="relative w-8 h-8 md:w-20 md:h-20 flex items-center justify-center">
                    {/* Ribbon effect - placed first to be behind circles */}
                    <div className="absolute -bottom-2 md:-bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5 md:gap-1">
                      <div className="w-1.5 h-4 md:w-3 md:h-8 bg-amber-600 rounded-b-sm transform -rotate-12 shadow-lg" />
                      <div className="w-1.5 h-4 md:w-3 md:h-8 bg-amber-700 rounded-b-sm transform rotate-12 shadow-lg" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.3)] md:shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse" />
                    <div className="absolute inset-0.5 md:inset-1 bg-[#0f0f0f] rounded-full" />
                    <div className="absolute inset-1 md:inset-2 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                      <Trophy size={12} className="text-amber-900 md:w-7 md:h-7" />
                    </div>
                  </div>

                  <div className="relative group hidden sm:block">
                    <div className="absolute -inset-2 md:-inset-4 bg-amber-500/20 blur-md md:blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-white p-1 md:p-1.5 rounded-md md:rounded-lg shadow-xl md:shadow-2xl">
                      <QRCodeSVG 
                        value={`https://knowledge-wealth.app/verify/${certId}`}
                        size={32}
                        level="H"
                        includeMargin={false}
                        fgColor="#0f0f0f"
                        className="md:w-[54px] md:h-[54px]"
                      />
                    </div>
                    <p className="text-[5px] md:text-[8px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-amber-600 font-black mt-1 md:mt-3">تحقق رقمي</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`w-8 h-8 md:w-16 md:h-16 rounded-full border border-dashed md:border-2 ${color.border} opacity-20 flex items-center justify-center mb-0.5 md:mb-1 relative`}>
                    <div className={`w-6 h-6 md:w-12 md:h-12 rounded-full ${color.bg} opacity-10`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Award className={`${color.text} opacity-60 w-4 h-4 md:w-6 md:h-6`} />
                    </div>
                  </div>
                  <p className="text-[5px] md:text-[8px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-gray-600 font-black">ختم الإتمام</p>
                </>
              )}
            </div>

            <div className="text-left">
              <div className="space-y-0.5 md:space-y-1">
                <p className={`text-[10px] md:text-xl font-bold leading-none mb-0.5 md:mb-1 font-script ${isGraduation ? 'text-amber-500' : 'text-white/95'}`}>
                  Abdulrahman
                </p>
                <div className={`h-[1px] md:h-[2px] w-full ${isGraduation ? 'bg-gradient-to-l from-amber-500/60 to-transparent' : `bg-gradient-to-l from-${color.main}/40 to-transparent`}`} 
                     style={!isGraduation ? { background: `linear-gradient(to left, ${color.main}66, transparent)` } : {}} />
                <p className="text-[5px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-600 font-black">المؤسس والمدير التنفيذي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CertificatesPage: React.FC<CertificatesPageProps> = ({ pathProgress, userName, onUpdateName }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [activeTab, setActiveTab] = useState<'all' | 'path' | 'unit'>('all');
  const certificateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const downloadCertificate = async (id: string, certTitle: string) => {
    const ref = certificateRefs.current[id];
    if (!ref) return;
    
    try {
      const dataUrl = await toPng(ref, {
        backgroundColor: '#0f0f0f',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `شهادة-${certTitle}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating certificate image:', error);
    }
  };

  const earnedCertificates = useMemo(() => {
    const earned: { id: string, title: string, type: 'path' | 'unit', color: any, units?: any[] }[] = [];
    
    LEARNING_PATHS.forEach((path, index) => {
      const color = PATH_COLORS[index % PATH_COLORS.length];
      const totalLessonsInPath = path.units.reduce((sum: number, u) => sum + u.lessons.length, 0);
      const progress = pathProgress[path.id] || 0;

      // Path certificate
      if (progress >= totalLessonsInPath) {
        earned.push({ id: path.id, title: path.title, type: 'path', color, units: path.units });
      }

      // Unit certificates
      let accumulated = 0;
      path.units.forEach(unit => {
        accumulated += unit.lessons.length;
        if (progress >= accumulated) {
          earned.push({ id: unit.id, title: unit.title, type: 'unit', color });
        }
      });
    });
    
    return earned.filter(cert => activeTab === 'all' || cert.type === activeTab);
  }, [pathProgress, activeTab, userName]);

  return (
    <div className="space-y-6 md:space-y-10 px-2 md:px-0" dir="rtl">
      <div className="sticky top-0 z-20 bg-[#121212] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10 pb-4 border-b border-white/5">
        <h2 className="text-2xl md:text-3xl font-black text-white">شهاداتك</h2>
        
        {/* Tabs */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'path', label: 'شهادات التخرج' },
            { id: 'unit', label: 'شهادات الوحدات' }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              variant={activeTab === tab.id ? "primary" : "ghost"}
              size="sm"
              className={`px-4 py-1.5 md:px-6 md:py-2 rounded-lg md:rounded-xl font-bold transition-all whitespace-nowrap flex-1 md:flex-none ${
                activeTab === tab.id 
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Name Editor */}
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto gap-3 md:gap-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-2 pr-4">
          {!isEditingName ? (
            <>
              <span className="text-sm md:text-lg font-bold text-white truncate max-w-[150px] md:max-w-none">{userName || 'اسمك هنا'}</span>
              <Button 
                onClick={() => setIsEditingName(true)}
                variant="success"
                size="sm"
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl shrink-0"
              >
                <Edit2 size={16} className="md:w-4 md:h-4" />
              </Button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg md:rounded-xl px-3 py-1 md:px-4 md:py-1.5 text-white font-bold focus:outline-none text-sm md:text-base w-full md:w-auto"
                autoFocus
              />
              <Button 
                onClick={handleSaveName}
                variant="success"
                size="sm"
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl shrink-0"
              >
                <Save size={16} className="md:w-4 md:h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {earnedCertificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] text-center p-4 md:p-6">
          <Trophy size={48} className="text-gray-600 mb-3 md:mb-4 md:w-16 md:h-16" />
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">لا توجد شهادات بعد</h2>
          <p className="text-sm md:text-base text-gray-400">أكمل الدروس والوحدات للحصول على شهادتك الأولى!</p>
        </div>
      ) : (
        <div className="space-y-8 md:space-y-12">
          {earnedCertificates.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CertificateCard 
                id={cert.id}
                certTitle={cert.title}
                certType={cert.type}
                color={cert.color}
                userName={userName}
                onDownload={downloadCertificate}
                setRef={el => certificateRefs.current[cert.id] = el}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
