'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MascotRole } from './mascotConfig';

export type MascotState = 'idle' | 'thinking' | 'listening' | 'speaking' | 'success';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface MascotContextProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  userRole: MascotRole;
  setUserRole: (role: MascotRole) => void;
  selectedMascot: string | null;
  setSelectedMascot: (mascot: string | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  mascotState: MascotState;
  setMascotState: (state: MascotState) => void;
  message: string;
  setMessage: (msg: string) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (history: ChatMessage[]) => void;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
}

const MascotContext = createContext<MascotContextProps | undefined>(undefined);

export function MascotProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [userRole, setUserRole] = useState<MascotRole>('CUSTOMER');
  const [selectedMascot, setSelectedMascot] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [message, setMessage] = useState('Hi! How can I help you today?');
  
  // Chat feature state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <MascotContext.Provider
      value={{
        isVisible,
        setIsVisible,
        userRole,
        setUserRole,
        selectedMascot,
        setSelectedMascot,
        currentStep,
        setCurrentStep,
        mascotState,
        setMascotState,
        message,
        setMessage,
        chatHistory,
        setChatHistory,
        isTyping,
        setIsTyping
      }}
    >
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error('useMascot must be used within a MascotProvider');
  }
  return context;
}
