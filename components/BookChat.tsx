import React, { useState, useRef, useEffect } from 'react';
import { BookData, ChatMessage } from '../types';
import { createBookChat } from '../services/geminiService';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Chat } from '@google/genai';

interface BookChatProps {
  data: BookData;
}

const BookChat: React.FC<BookChatProps> = ({ data }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `Greetings. I am the spirit of "${data.title}". Ask me anything about my pages, my secrets, or the characters that dwell within.`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount or data change
    chatSessionRef.current = createBookChat(data);
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = result.text; // Access .text directly property

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "The pages are silent right now...",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "A shadow clouds my vision. I cannot answer right now.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="py-20 bg-slate-950 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
          
          {/* Header */}
          <div className="p-6 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blood-900/50 rounded-full text-blood-400">
                 <Sparkles size={20} />
               </div>
               <div>
                 <h3 className="text-white font-semibold">Talk to the Book</h3>
                 <p className="text-slate-400 text-xs">AI-Powered Persona</p>
               </div>
             </div>
             <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Gemini 2.5 Active</div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-blood-900'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-slate-200 rounded-tr-none' 
                    : 'bg-blood-950/30 border border-blood-900/30 text-slate-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex gap-4 animate-pulse">
                 <div className="w-8 h-8 rounded-full bg-blood-900 flex items-center justify-center">
                   <Bot size={14} />
                 </div>
                 <div className="bg-blood-950/30 border border-blood-900/30 p-4 rounded-xl rounded-tl-none">
                   <div className="flex gap-1">
                     <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                     <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                   </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about the plot, meaning, or secrets..."
                className="w-full bg-slate-900 text-slate-200 pl-4 pr-12 py-4 rounded-lg border border-slate-700 focus:border-blood-500 focus:ring-1 focus:ring-blood-500 outline-none transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 p-2 bg-blood-700 hover:bg-blood-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookChat;
