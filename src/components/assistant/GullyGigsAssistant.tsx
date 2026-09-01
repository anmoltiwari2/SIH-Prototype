'use client'

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMascot } from '@/lib/MascotContext';
import { getMascotAsset } from '@/lib/mascotConfig';
import { fetchMascotAIResponse } from '@/actions/mascotAI';
import { MessageSquare, X, ChevronDown, Send, Sparkles } from 'lucide-react';

// Advanced Flood-Fill Background Removal
const TransparentMascot = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !src) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        const bgR = data[0], bgG = data[1], bgB = data[2];
        const tolerance = 90;
        
        const visited = new Uint8Array(width * height);
        const stack = [
          [0, 0], [width - 1, 0], 
          [0, height - 1], [width - 1, height - 1]
        ];
        
        while (stack.length > 0) {
          const [x, y] = stack.pop()!;
          if (x < 0 || x >= width || y < 0 || y >= height) continue;
          
          const vIdx = y * width + x;
          if (visited[vIdx]) continue;
          visited[vIdx] = 1;

          const idx = vIdx * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          
          const dist = Math.sqrt(Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2));

          if (dist < tolerance) {
            data[idx + 3] = dist > tolerance - 15 ? 100 : 0;
            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
      } catch (err) {
        console.warn("Canvas extraction failed.", err);
      }
    };
  }, [src]);

  return <canvas ref={canvasRef} className={className} title={alt} />;
};

export function GullyGigsAssistant() {
  const { 
    isVisible, setIsVisible, userRole, selectedMascot, mascotState, setMascotState, 
    chatHistory, setChatHistory, isTyping, setIsTyping 
  } = useMascot();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const pathname = usePathname();
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping, isExpanded]);

  useEffect(() => {
    if (!pathname.startsWith('/book') && !pathname.startsWith('/mascot-test') && userRole === 'CUSTOMER') {
      setIsVisible(false);
      setIsExpanded(false);
    }
  }, [pathname, userRole, setIsVisible]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    setInputText('');
    
    const currentHistory = [...chatHistory, { role: 'user' as const, content: userMsg }];
    setChatHistory(currentHistory);
    
    setIsTyping(true);
    setMascotState('thinking');
    
    const aiResponse = await fetchMascotAIResponse(userMsg, selectedMascot, currentHistory);
    
    setIsTyping(false);
    setMascotState('speaking');
    setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    
    setTimeout(() => {
      setMascotState('idle');
    }, 2000);
  };

  const mascotSrc = getMascotAsset(userRole, selectedMascot);

  if (!isVisible) return null;

  const mascotVariants = {
    idle: { y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    thinking: { y: [-5, 5, -5], transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } },
    listening: { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 1.5 } },
    speaking: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.5 } },
    success: { y: [0, -15, 0], scale: [1, 1.1, 1], transition: { duration: 0.5, type: 'spring' } }
  };

  // Shared Chat Layout for Desktop & Mobile
  const ChatContent = () => (
    <>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20 z-10 relative px-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white drop-shadow-md">
            YOURGIGY
          </h3>
          <p className="text-xs text-white/80 font-medium tracking-wide">Gemini AI is online</p>
        </div>
      </div>
      
      <div ref={chatScrollRef} className="flex-1 overflow-y-auto mb-4 space-y-4 px-2 custom-scrollbar pr-2 z-10 relative">
        <AnimatePresence initial={false}>
          {chatHistory.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`p-3.5 rounded-2xl max-w-[85%] text-sm shadow-[0_4px_15px_rgba(0,0,0,0.1)] backdrop-blur-md border ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-br-sm border-transparent' 
                  : 'bg-white/20 border-white/30 rounded-bl-sm text-white drop-shadow-sm'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 rounded-bl-sm flex gap-1.5 items-center shadow-sm">
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 rounded-full bg-white/80" />
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 rounded-full bg-white/80" />
                <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 rounded-full bg-white/80" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSendMessage} className="relative mt-auto z-10">
        <input 
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (mascotState === 'idle' && e.target.value.length > 0) setMascotState('listening');
            if (e.target.value.length === 0) setMascotState('idle');
          }}
          placeholder="Ask me anything..."
          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-5 pr-14 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-inner transition-all placeholder:text-white/50"
        />
        <button 
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="absolute right-2 top-2 p-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all cursor-pointer"
        >
          <Send size={16} className="-ml-0.5" />
        </button>
      </form>
    </>
  );

  return (
    <>
      <style>{`
        @keyframes fluidAurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .premium-watery-bg {
          background: linear-gradient(-45deg, rgba(79, 70, 229, 0.4), rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.4));
          background-size: 400% 400%;
          animation: fluidAurora 12s ease-in-out infinite;
        }
        .dark .premium-watery-bg {
          background: linear-gradient(-45deg, rgba(79, 70, 229, 0.25), rgba(147, 51, 234, 0.25), rgba(236, 72, 153, 0.25), rgba(59, 130, 246, 0.25));
          background-size: 400% 400%;
          animation: fluidAurora 12s ease-in-out infinite;
        }
      `}</style>

      {/* DESKTOP UI */}
      <div className="hidden md:flex fixed bottom-6 right-8 z-50 pointer-events-none items-end justify-end">
        <div className="relative pointer-events-auto flex items-end">
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                className="absolute bottom-20 right-10 w-[380px] h-[520px] rounded-[2rem] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.4)] backdrop-blur-3xl premium-watery-bg border border-white/20 flex flex-col z-40 overflow-hidden"
              >
                {/* Heavy Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-white/5 dark:bg-black/10 backdrop-blur-2xl pointer-events-none" />
                
                {/* Properly Z-Indexed Close Button */}
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white z-50 backdrop-blur-md transition-all cursor-pointer shadow-sm border border-white/10"
                >
                  <X size={16} />
                </button>
                
                <ChatContent />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Anchor: Mascot & "Ask AI" Button layered ON TOP of chat window */}
          <div className="flex flex-col items-end z-50">
            {!isExpanded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(true)}
                className="bg-white/10 dark:bg-black/20 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl rounded-full px-5 py-3 flex items-center gap-2 mb-2 hover:border-purple-400 transition-colors group cursor-pointer"
              >
                <Sparkles size={18} className="text-purple-400 group-hover:animate-pulse" />
                <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] to-[var(--foreground)] group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">Ask YOURGIGY</span>
              </motion.button>
            )}

            <motion.div
              variants={mascotVariants}
              animate={mascotState}
              className="relative cursor-pointer group flex items-end justify-center z-50"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="h-44 w-auto relative z-50 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110 origin-bottom">
                {mascotSrc ? (
                  <TransparentMascot src={mascotSrc} alt="Mascot" className="h-full w-auto object-contain transition-all" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="w-8 h-8 text-white/50" />
                  </div>
                )}
              </div>
              
              {!isExpanded && (
                <span className="absolute top-6 right-2 flex h-5 w-5 z-50">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-[var(--background)]"></span>
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* MOBILE UI */}
      <div className="md:hidden">
        <motion.button
          variants={mascotVariants}
          animate={mascotState}
          onClick={() => setIsExpanded(true)}
          className={`fixed bottom-24 right-4 z-40 h-32 w-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] flex items-end justify-center transition-transform origin-bottom cursor-pointer ${isExpanded ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        >
           {mascotSrc ? (
              <TransparentMascot src={mascotSrc} alt="Mascot" className="h-full w-auto object-contain" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-md">
                <Sparkles className="w-8 h-8 text-white/50" />
              </div>
            )}
            <span className="absolute top-4 right-2 flex h-5 w-5 z-50">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-indigo-500 to-purple-500 border-2 border-[var(--background)]"></span>
            </span>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 z-50 premium-watery-bg backdrop-blur-3xl rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] p-5 flex flex-col h-[80vh] border-t border-white/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 dark:bg-black/10 backdrop-blur-2xl pointer-events-none" />
              
              <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-4 z-20" />
              
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white z-50 backdrop-blur-md transition-all cursor-pointer shadow-sm border border-white/10"
              >
                <ChevronDown size={20} />
              </button>

              <div className="flex items-center gap-4 mb-4 px-2 shrink-0 z-10">
                <div className="h-20 w-auto shrink-0 drop-shadow-2xl relative z-10">
                  {mascotSrc && (
                    <TransparentMascot src={mascotSrc} alt="Mascot" className="h-full w-auto object-contain" />
                  )}
                </div>
              </div>

              <ChatContent />
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
