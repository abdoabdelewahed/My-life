import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Download, X, Edit2, Lock, Save, Trophy, Award, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { LEARNING_PATHS, PATH_COLORS } from '../constants';
import { Button } from './ui/Button';

export const CertificateModal = ({ 
  title, 
  type = 'path',
  userName,
  onUpdateName,
  onClose,
  pathProgress = {}
}: { 
  title: string, 
  type?: 'path' | 'unit',
  userName: string,
  onUpdateName: (name: string) => void,
  onClose: () => void,
  pathProgress?: Record<string, any>
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
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

  // Find the specific path or unit data
  const targetPath = LEARNING_PATHS.find(p => p.title === title || p.id === title);
  const targetUnit = LEARNING_PATHS.flatMap(p => p.units).find(u => u.title === title || u.id === title);
  const parentPath = targetUnit ? LEARNING_PATHS.find(p => p.units.some(u => u.id === targetUnit.id)) : null;

  const renderCertificate = (id: string, certTitle: string, certType: 'path' | 'unit', color: any, units?: any[]) => {
    const isGraduation = certType === 'path';
    
    return (
      <div key={id} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${color.bg}`} />
            <h4 className="text-lg font-bold text-white">{certTitle}</h4>
          </div>
          <Button 
            onClick={() => downloadCertificate(id, certTitle)}
            variant="ghost"
            size="sm"
            className={`flex items-center gap-2 text-xs font-bold ${color.text} hover:opacity-80 transition-colors cursor-pointer p-0 h-auto`}
          >
            <Download size={14} /> تحميل الشهادة
          </Button>
        </div>

        <div 
          className="relative aspect-[1.414/1] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] transition-all duration-700"
        >
          {/* Certificate Content */}
          <div 
            ref={el => certificateRefs.current[id] = el}
            className="absolute inset-0 bg-[#0f0f0f] p-4 sm:p-8 md:p-12 flex flex-col items-center justify-between text-center overflow-hidden"
          >
            {/* Ethereal Background Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div 
                className="absolute -bottom-32 -right-32 w-[400px] h-[400px] blur-[120px] opacity-20 rounded-full"
                style={{ backgroundColor: color.main }}
              />
              <div 
                className="absolute -top-32 -left-32 w-[300px] h-[300px] blur-[100px] opacity-10 rounded-full"
                style={{ backgroundColor: color.main }}
              />
              
              <div 
                className="absolute inset-0 opacity-[0.05]"
                style={{ 
                  background: `radial-gradient(circle at 50% 100%, ${color.main} 0%, transparent 70%)` 
                }} 
              />

              <div className="absolute inset-6 border border-white/5 rounded-[1.5rem]" />
              <div className="absolute inset-8 border border-white/[0.03] rounded-[1.25rem]" />
              
              <div className={`absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 ${color.border} opacity-20 rounded-tr-2xl`} />
              <div className={`absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 ${color.border} opacity-20 rounded-tl-2xl`} />
              <div className={`absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 ${color.border} opacity-20 rounded-br-2xl`} />
              <div className={`absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 ${color.border} opacity-20 rounded-bl-2xl`} />

              <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 space-y-6 w-full mt-4">
              <div className="space-y-3">
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-black uppercase tracking-[0.6em] ${color.text} opacity-60 mb-1`}>منصة</span>
                  <h1 className="text-xl font-black text-white tracking-tighter">الثراء المعرفي</h1>
                </div>
                <div className={`h-px w-32 bg-gradient-to-r from-transparent via-${color.main}/30 to-transparent mx-auto`} 
                     style={{ backgroundColor: `${color.main}33` }} />
                <h2 className="text-[12px] uppercase tracking-[0.5em] text-gray-500 font-black">
                  {isGraduation ? 'شهادة تخرج معتمدة' : 'شهادة إتمام وحدة تعليمية'}
                </h2>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">نقر بكل فخر واعتزاز بأن</p>
                <div className="py-2">
                  <p className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    {userName || 'اسمك هنا'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-lg mx-auto font-medium">
                  قد اجتاز بنجاح {isGraduation ? 'كافة متطلبات مسار' : 'متطلبات وحدة'} 
                  <span className={`block text-lg sm:text-xl md:text-2xl mt-2 font-black ${color.text} drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
                    {certTitle}
                  </span>
                </div>

                <p className="text-[10px] text-gray-500 italic opacity-80">
                  {isGraduation 
                    ? 'مظهراً شغفاً بالمعرفة وتفوقاً في المهارات التقنية والذهنية المطلوبة للتخرج.'
                    : 'مظهراً التزاماً بالتعلم وإتقاناً للمهارات الأساسية لهذه الوحدة.'}
                </p>
              </div>
            </div>

            <div className="relative z-10 w-full flex justify-between items-end pt-6 px-4">
              <div className="text-right flex gap-4 sm:gap-10 items-end">
                <div className="space-y-1">
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-gray-600 font-black">تاريخ المنح</p>
                  <p className="text-xs sm:text-sm font-black text-white/90">{new Date().toLocaleDateString('ar-SA')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.3em] text-gray-600 font-black">رقم الشهادة</p>
                  <p className={`text-[8px] sm:text-[10px] font-mono font-bold ${isGraduation ? 'text-amber-500/60' : 'text-gray-500/60'}`}>KW-{id.toUpperCase().slice(0, 3)}-{Math.random().toString(36).toUpperCase().slice(2, 8)}</p>
                </div>
              </div>

              <div className="text-center flex flex-col items-center relative">
                {isGraduation ? (
                  <div className="flex items-center gap-2 sm:gap-6">
                    {/* Premium Gold Seal */}
                    <div className="relative w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center">
                      {/* Ribbon effect */}
                      <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        <div className="w-2 sm:w-3 h-4 sm:h-8 bg-amber-600 rounded-b-sm transform -rotate-12 shadow-lg" />
                        <div className="w-2 sm:w-3 h-4 sm:h-8 bg-amber-700 rounded-b-sm transform rotate-12 shadow-lg" />
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse" />
                      <div className="absolute inset-1 bg-[#0f0f0f] rounded-full" />
                      <div className="absolute inset-2 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                        <Trophy size={18} className="text-amber-900 sm:hidden" />
                        <Trophy size={28} className="text-amber-900 hidden sm:block" />
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute -inset-4 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-white p-1 rounded-lg shadow-2xl">
                        <QRCodeSVG 
                          value={`https://knowledge-wealth.app/verify/KW-${id.toUpperCase().slice(0, 3)}-${Math.random().toString(36).toUpperCase().slice(2, 8)}`}
                          size={32}
                          level="H"
                          includeMargin={false}
                          fgColor="#0f0f0f"
                          className="sm:hidden"
                        />
                        <QRCodeSVG 
                          value={`https://knowledge-wealth.app/verify/KW-${id.toUpperCase().slice(0, 3)}-${Math.random().toString(36).toUpperCase().slice(2, 8)}`}
                          size={54}
                          level="H"
                          includeMargin={false}
                          fgColor="#0f0f0f"
                          className="hidden sm:block"
                        />
                      </div>
                      <p className="text-[6px] sm:text-[8px] uppercase tracking-[0.4em] text-amber-600 font-black mt-2 sm:mt-3">تحقق رقمي</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`w-16 h-16 rounded-full border-2 border-dashed ${color.border} opacity-20 flex items-center justify-center mb-1 relative`}>
                      <div className={`w-12 h-12 rounded-full ${color.bg} opacity-10`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Award className={`${color.text} opacity-60`} size={24} />
                      </div>
                    </div>
                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black">ختم الإتمام</p>
                  </>
                )}
              </div>

              <div className="text-left">
                <div className="space-y-1">
                  <p className={`text-xl font-bold leading-none mb-1 font-script ${isGraduation ? 'text-amber-500' : 'text-white/95'}`}>
                    Abdulrahman
                  </p>
                  <div className={`h-[2px] w-full ${isGraduation ? 'bg-gradient-to-l from-amber-500/60 to-transparent' : `bg-gradient-to-l from-${color.main}/40 to-transparent`}`} 
                       style={!isGraduation ? { background: `linear-gradient(to left, ${color.main}66, transparent)` } : {}} />
                  <p className="text-[9px] uppercase tracking-[0.3em] text-gray-600 font-black">المؤسس والمدير التنفيذي</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-[100] flex flex-col overflow-y-auto font-sans" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-[101] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={onClose} 
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/10 p-0"
          >
            <X size={20} />
          </Button>
          <h2 className="text-xl font-black text-white tracking-tight">
            {type === 'path' ? 'شهادة التخرج' : 'شهادة الوحدة'}
          </h2>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-6 py-10 space-y-12">
        {/* Unified Name Input Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right space-y-2">
              <h3 className="text-2xl font-black text-white">الاسم على الشهادة</h3>
              <p className="text-gray-400 text-sm">سيظهر هذا الاسم في جميع الشهادات التي تحصل عليها.</p>
            </div>

            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              {!isEditingName ? (
                <div className="flex items-center gap-6">
                  <div className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl min-w-[240px] text-center">
                    <span className="text-2xl font-black text-white tracking-wide">{userName || 'اسمك هنا'}</span>
                  </div>
                  <Button 
                    onClick={() => setIsEditingName(true)}
                    variant="success"
                    className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all shadow-lg shadow-emerald-500/20 active:scale-95 p-0"
                  >
                    <Edit2 size={24} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 w-full max-w-md">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="أدخل اسمك الكامل..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    autoFocus
                  />
                  <Button 
                    onClick={handleSaveName}
                    variant="success"
                    className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition-all shadow-lg shadow-emerald-500/20 active:scale-95 p-0"
                  >
                    <Save size={24} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Focused Certificate View */}
        <div className="max-w-4xl mx-auto">
          {type === 'path' && targetPath && (
            renderCertificate(
              targetPath.id, 
              targetPath.title, 
              'path', 
              PATH_COLORS[LEARNING_PATHS.findIndex(p => p.id === targetPath.id) % PATH_COLORS.length],
              targetPath.units
            )
          )}
          {type === 'unit' && targetUnit && (
            renderCertificate(
              targetUnit.id, 
              targetUnit.title, 
              'unit', 
              PATH_COLORS[LEARNING_PATHS.findIndex(p => p.units.some(u => u.id === targetUnit.id)) % PATH_COLORS.length]
            )
          )}
        </div>
      </div>
    </div>
  );
};


