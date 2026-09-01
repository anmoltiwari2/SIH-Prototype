'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { fetchMascotAIResponse } from '@/actions/mascotAI';

export function SiteNavigatorChatbot() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant' as const, content: 'Hi! I am YOURGIGY. I can help you navigate GullyGigs. What are you looking for?' }
  ]);
  
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping, isExpanded]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userMsg = inputText.trim();
    setInputText('');
    
    const currentHistory = [...chatHistory, { role: 'user' as const, content: userMsg }];
    setChatHistory(currentHistory);
    
    setIsTyping(true);
    
    // Pass 'NAVIGATOR' as the persona type
    const aiResponse = await fetchMascotAIResponse(userMsg, 'NAVIGATOR', currentHistory);
    
    setIsTyping(false);
    setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
  };

  return (
    <>
      <style>{`
        @keyframes mossAurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .moss-watery-bg {
          /* Moss green colors */
          background: linear-gradient(-45deg, rgba(34, 197, 94, 0.4), rgba(21, 128, 61, 0.4), rgba(74, 222, 128, 0.4), rgba(22, 163, 74, 0.4));
          background-size: 400% 400%;
          animation: mossAurora 12s ease-in-out infinite;
        }
        .dark .moss-watery-bg {
          background: linear-gradient(-45deg, rgba(34, 197, 94, 0.25), rgba(21, 128, 61, 0.25), rgba(74, 222, 128, 0.25), rgba(22, 163, 74, 0.25));
          background-size: 400% 400%;
          animation: mossAurora 12s ease-in-out infinite;
        }
      `}</style>

      {/* Trigger Button in Navbar */}
      <button 
        onClick={() => setIsExpanded(true)}
        className="text-sm font-semibold opacity-90 hover:opacity-100 transition-all flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)]/60 hover:bg-[var(--background)] shadow-sm backdrop-blur-md text-[var(--foreground)] hover:text-green-600 dark:hover:text-green-400 hover:border-green-500/30"
      >
        <Bot size={16} className="text-green-600 dark:text-green-400" />
        Find Help
      </button>

      {/* Floating Chat Window */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(10px)' }}
            className="fixed top-20 right-4 md:right-8 w-[360px] h-[500px] rounded-[2rem] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.4)] backdrop-blur-3xl moss-watery-bg border border-white/20 flex flex-col z-[100] overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 dark:bg-black/10 backdrop-blur-2xl pointer-events-none" />
            
            <button 
              onClick={() => setIsExpanded(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white z-50 backdrop-blur-md transition-all cursor-pointer shadow-sm border border-white/10"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20 z-10 relative px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white drop-shadow-md">
                  YOURGIGY
                </h3>
                <p className="text-xs text-white/80 font-medium tracking-wide">Site Navigator</p>
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
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-sm border-transparent' 
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
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me how to find things..."
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-5 pr-14 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-400/50 shadow-inner transition-all placeholder:text-white/50"
              />
              <button 
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="absolute right-2 top-2 p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all cursor-pointer"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
