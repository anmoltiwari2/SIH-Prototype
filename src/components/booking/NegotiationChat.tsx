"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, IndianRupee, Image as ImageIcon, Camera, MoreVertical, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: 'TEXT' | 'LOCATION' | 'OFFER';
  status: 'SENT' | 'DELIVERED' | 'READ';
  meta?: any;
}

export function NegotiationChat({ 
  currentUserId, 
  otherUserId, 
  otherUserName, 
  otherUserAvatar,
  isWorker = false 
}: { 
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  isWorker?: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: otherUserId,
      text: isWorker ? "Hi! I just saw your service request. When do you need me to come over?" : "Hi! I'm available today. Can you share a bit more detail about the issue?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'TEXT',
      status: 'READ'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (type: 'TEXT' | 'LOCATION' | 'OFFER' = 'TEXT', customText?: string, meta?: any) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && type === 'TEXT') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      text: textToSend,
      timestamp: new Date(),
      type,
      status: 'SENT',
      meta
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate "Delivered" and "Read" status
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'DELIVERED' } : m));
    }, 800);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'READ' } : m));
      
      // Simulate reply
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyText = type === 'LOCATION' 
          ? "Got your location! I'm about 15 minutes away from there."
          : type === 'OFFER'
          ? "That rate works for me! I accept the offer."
          : "Okay, I understand. Let's get this sorted out.";
          
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          senderId: otherUserId,
          text: replyText,
          timestamp: new Date(),
          type: 'TEXT',
          status: 'READ'
        }]);
      }, 2500);
    }, 1500);
  };

  const handleSendLocation = () => {
    handleSend('LOCATION', "📍 Shared a precise location pinning", { lat: 28.6139, lng: 77.2090 });
  };

  const handleSendOffer = () => {
    const amount = prompt("Enter your negotiated offer amount (₹):", "500");
    if (amount && !isNaN(Number(amount))) {
      handleSend('OFFER', `Negotiated Offer: ₹${amount}`, { amount: Number(amount) });
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl overflow-hidden shadow-2xl relative backdrop-blur-md">
      {/* Chat Header */}
      <div className="h-16 px-4 border-b border-[var(--glass-border)] flex items-center justify-between bg-black/20 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={otherUserAvatar} alt={otherUserName} className="w-10 h-10 rounded-full object-cover border-2 border-[var(--primary)]/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a1a]"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">{otherUserName}</h3>
            <p className="text-[10px] text-[var(--primary)] font-bold tracking-wider uppercase">
              {isWorker ? 'Customer' : 'Worker'} • Online
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical size={18} className="opacity-70" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {msg.type === 'LOCATION' ? (
                    <div className={`rounded-2xl p-1 shadow-lg ${isMe ? 'bg-[var(--primary)]' : 'bg-[#2a2a2a]'}`}>
                      <div className="w-48 h-32 bg-gray-800 rounded-xl overflow-hidden relative border border-white/10">
                        <img src="https://maps.googleapis.com/maps/api/staticmap?center=28.6139,77.2090&zoom=14&size=400x300&maptype=roadmap&markers=color:red%7C28.6139,77.2090&key=dummy" alt="Map" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <MapPin size={32} className="text-red-500 drop-shadow-md animate-bounce" />
                        </div>
                      </div>
                      <p className={`text-xs px-2 py-1.5 ${isMe ? 'text-white' : 'text-gray-200'}`}>
                        📍 Live Location Pinned
                      </p>
                    </div>
                  ) : msg.type === 'OFFER' ? (
                    <div className={`rounded-2xl p-4 shadow-lg border-2 ${isMe ? 'bg-[var(--primary)]/20 border-[var(--primary)]' : 'bg-amber-500/20 border-amber-500'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isMe ? 'bg-[var(--primary)]/30' : 'bg-amber-500/30'}`}>
                          <IndianRupee size={20} className={isMe ? 'text-[var(--primary)]' : 'text-amber-500'} />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider opacity-70 font-bold mb-1">New Offer</p>
                          <p className="text-xl font-extrabold">₹{msg.meta.amount}</p>
                        </div>
                      </div>
                      {!isMe && (
                        <div className="mt-3 flex gap-2">
                          <button className="flex-1 py-1.5 bg-amber-500 text-black text-xs font-bold rounded hover:bg-amber-400 transition-colors">Accept</button>
                          <button className="flex-1 py-1.5 bg-white/10 border border-white/20 text-xs font-bold rounded hover:bg-white/20 transition-colors">Decline</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`rounded-2xl px-4 py-2.5 shadow-md text-sm ${
                      isMe 
                        ? 'bg-gradient-to-br from-[var(--primary)] to-blue-600 text-white rounded-tr-sm' 
                        : 'bg-[#2a2a2a] border border-white/5 rounded-tl-sm text-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {/* Timestamp & Status */}
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[9px] opacity-50">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <span className="opacity-70 text-[var(--primary)]">
                        {msg.status === 'SENT' && <Check size={10} />}
                        {msg.status === 'DELIVERED' && <CheckCheck size={10} className="text-gray-400" />}
                        {msg.status === 'READ' && <CheckCheck size={10} />}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[#2a2a2a] bg-white/5 w-fit px-3 py-2 rounded-2xl rounded-tl-sm border border-white/5"
          >
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Bar (Quick Tools) */}
      <div className="px-4 py-2 flex items-center gap-2 bg-black/10 border-t border-[var(--glass-border)] shrink-0">
        <button onClick={handleSendLocation} className="p-2 rounded-full hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors group relative" title="Share Location">
          <MapPin size={18} className="group-hover:scale-110 transition-transform" />
        </button>
        <button onClick={handleSendOffer} className="p-2 rounded-full hover:bg-amber-500/20 text-amber-500 transition-colors group" title="Negotiate Price">
          <IndianRupee size={18} className="group-hover:scale-110 transition-transform" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors group" title="Send Photo">
          <ImageIcon size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-black/20 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend('TEXT'); }}
          className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 pl-4 focus-within:border-[var(--primary)]/50 focus-within:shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] transition-all"
        >
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-white placeholder:text-gray-500"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-full bg-[var(--primary)] text-white disabled:opacity-50 disabled:bg-gray-600 transition-colors"
          >
            <Send size={16} className={inputText.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
          </button>
        </form>
      </div>
    </div>
  );
}
