import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { chatWithExpert } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

import { Button } from './ui/Button';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIConsultant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'مرحباً بك في رحلة الثراء. أنا مستشارك الخاص لعام 2026. كيف يمكنني مساعدتك اليوم في مسارك كمصمم ومطور تطبيقات؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const history = (Array.isArray(messages) ? messages : []).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      const response = await chatWithExpert(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. حاول مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#1c1c1e] rounded-3xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500" />
      
      <div className="p-5 bg-[#1c1c1e] border-b border-white/10 flex items-center gap-4 z-10">
        <div className="w-12 h-12 bg-[#282828] rounded-full flex items-center justify-center text-[#1DB954] relative shadow-[0_0_15px_rgba(29,185,84,0.2)]">
          <Bot size={24} />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1c1c1e] rounded-full" />
        </div>
        <div>
          <h3 className="font-extrabold text-white flex items-center gap-2">
            المستشار الذكي 2026
            <Sparkles size={14} className="text-amber-500" />
          </h3>
          <p className="text-xs font-bold text-[#8e8e93]">خبير الثراء، التصميم، والذكاء الاصطناعي</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/40 scroll-smooth">
        <AnimatePresence initial={false}>
          {(Array.isArray(messages) ? messages : []).map((m, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm md:text-base leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-[#1DB954] text-black rounded-tr-sm shadow-md' 
                  : 'bg-[#282828] text-white rounded-tl-sm border border-white/5'
              }`}>
                <div className={`flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-wider ${m.role === 'user' ? 'text-black/70' : 'text-[#b3b3b3]'}`}>
                  {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  {m.role === 'user' ? 'أنت' : 'المستشار'}
                </div>
                <div className="whitespace-pre-wrap font-medium">{m.text}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="bg-[#2c2c2e] p-4 rounded-3xl rounded-tl-sm border border-white/5 flex items-center gap-3 text-[#8e8e93] shadow-sm">
              <Loader2 size={18} className="animate-spin text-[#1DB954]" />
              <span className="text-xs font-bold">يحلل البيانات ويكتب الإجابة...</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-[#1c1c1e] border-t border-white/10 z-10">
        <div className="flex gap-2 bg-[#2c2c2e] p-2 rounded-2xl border border-white/5 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل عن أي شيء (عقلية، مهارات، عملاء، أدوات)..."
            className="flex-1 bg-transparent border-none px-4 py-2 text-sm font-medium focus:outline-none text-white placeholder:text-[#8e8e93]"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            variant="success"
            size="md"
            className="p-3 rounded-xl shadow-md shadow-emerald-900/50"
          >
            <Send size={20} className="rtl:-scale-x-100" />
          </Button>
        </div>
      </div>
    </div>
  );
};
