import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sprout, Sparkles, HelpCircle, User, Bot, Loader2, Minimize2 } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function CropAdvisorBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Namaste! I am Satyabhama, your personal Crop & Irrigation Advisor. Ask me anything about farming, soil moisture, and water conservation. How can I help you improve your field yield today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions tailored to the user request
  const suggestions = [
    "How to crop a field?",
    "Water requirement for Basmati rice?",
    "How to save water using mulching?",
    "What are drip irrigation benefits?"
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setMessageText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/crop-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error("Failed to fetch bot response:", err);
      // Fallback
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "I am having difficulty connecting to our main grid system, but here is an essential tip: ensure your soil moisture is checked daily using capacitance sensors, and irrigate when it falls below 35% to prevent wilting. - Developed by kvsp praneeth.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans select-none">
      {/* Floating Toggle Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-amber-700/90 hover:bg-amber-850 text-white p-3.5 sm:p-4 rounded-full shadow-lg shadow-amber-800/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer bubble-shake-hover border border-amber-600/50"
          title="Ask Satyabhama (Crop Advisor)"
        >
          <div className="relative">
            <MessageSquare className="w-5.5 h-5.5 text-amber-50 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-xs font-extrabold tracking-wide text-amber-50 hidden sm:inline pr-1">
            Satyabhama Crop Advisor
          </span>
        </button>
      )}

      {/* Main Chatbot Panel */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[480px] bg-[#fdfaf2] border border-amber-200/95 rounded-2xl shadow-xl flex flex-col overflow-hidden animate-fadeIn relative">
          
          {/* Header */}
          <div className="bg-amber-800/95 text-amber-50 p-4 flex justify-between items-center border-b border-amber-700/20">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-amber-900/40 rounded-lg">
                <Sprout className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-tight uppercase">Satyabhama Advisor</h4>
                <p className="text-[10px] text-amber-200/80 font-semibold">National Crop Support Grid</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-amber-200 hover:text-white p-1 rounded-full hover:bg-amber-900/40 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-amber-50/20">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={index}
                  className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  <div className={`p-1.5 rounded-full shrink-0 flex items-center justify-center w-7 h-7 ${
                    isUser ? 'bg-amber-600/10 text-amber-800' : 'bg-amber-800/10 text-amber-900'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-700" />}
                  </div>

                  <div className="space-y-1">
                    <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-semibold ${
                      isUser
                        ? 'bg-amber-600 text-amber-50 rounded-tr-none'
                        : 'bg-white text-amber-950 border border-amber-100 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-amber-800/60 font-mono block text-right px-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                <div className="p-1.5 rounded-full shrink-0 flex items-center justify-center w-7 h-7 bg-amber-800/10 text-amber-900">
                  <Bot className="w-4 h-4 text-amber-700" />
                </div>
                <div className="bg-white px-3.5 py-2.5 rounded-2xl text-xs text-amber-800 border border-amber-100 rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>Satyabhama is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Preloaded suggestion query chip pill items */}
          <div className="px-3.5 py-2 border-t border-amber-150 bg-amber-50/40 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item)}
                className="text-[10px] whitespace-nowrap bg-white hover:bg-amber-150 border border-amber-200/70 text-amber-900 font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all active:scale-95 bubble-shake-hover"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Form input controls */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(messageText);
            }}
            className="p-3 bg-white border-t border-amber-200/60 flex gap-2 items-center"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ask about crops, soil, water..."
              maxLength={150}
              className="flex-1 bg-amber-50/30 border border-amber-150 rounded-xl px-3.5 py-2 text-xs text-amber-950 focus:outline-none focus:border-amber-500 font-semibold transition-all"
            />
            <button
              type="submit"
              disabled={!messageText.trim() || isLoading}
              className="p-2.5 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Verification Stamp */}
          <div className="bg-amber-100/10 py-1 px-3 border-t border-amber-200/40 text-[8.5px] text-amber-800/80 text-center font-mono font-medium flex justify-between items-center">
            <span>Core Registry: Active</span>
            <span className="font-bold text-amber-950">kvsp praneeth © 2026</span>
          </div>

        </div>
      )}
    </div>
  );
}
