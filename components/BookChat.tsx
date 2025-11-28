import React, { useState, useRef, useEffect } from 'react';
import { BookData, ChatMessage } from '../types';
import { createBookChat } from '../services/geminiService';
import { Send, Bot, User, Sparkles, X, ChevronDown } from 'lucide-react';
import { Chat } from '@google/genai';

interface BookChatProps {
  data: BookData;
}

const BookChat: React.FC<BookChatProps> = ({ data }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset messages and session when book changes
    chatSessionRef.current = createBookChat(data);
    setMessages([
        {
          id: 'init',
          role: 'model',
          text: `I am the essence of "${data.title}". Ask me what lies beneath the surface.`,
          timestamp: Date.now()
        }
    ]);
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
      const responseText = result.text;

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
        text: "I cannot find the words right now.",
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
    <div className="py-24 bg-gradient-to-b from-slate-950 to-black relative">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Section Header */}
        <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-white flex items-center justify-center gap-3">
               Interrogate the Text <Sparkles className="text-blood-500 w-5 h-5" />
            </h2>
            <p className="text-slate-500 mt-2">Speak directly with the persona of the book.</p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[700px] border border-slate-800/50">
          
          {/* Chat Header */}
          <div className="p-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-10">
             <div className="flex items-center gap-4">
               <div className="relative">
                 <div className="w-12 h-12 bg-gradient-to-br from-blood-800 to-slate-800 rounded-full flex items-center justify-center text-white shadow-lg ring-2 ring-slate-800">
                   <Bot size={20} />
                 </div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
               </div>
               <div>
                 <h3 className="text-slate-100 font-semibold text-lg">{data.title}</h3>
                 <p className="text-blood-400 text-xs font-mono tracking-widest uppercase">AI Persona Active</p>
               </div>
             </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed bg-slate-950/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-slate-700' : 'bg-blood-900'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className={`max-w-[75%] p-5 rounded-2xl text-sm leading-relaxed shadow-lg relative group ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-slate-100 rounded-tr-sm' 
                    : 'bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-slate-300 rounded-tl-sm'
                }`}>
                  {msg.text}
                  {/* Tiny timestamp */}
                  <span className="absolute bottom-1 right-3 text-[10px] opacity-0 group-hover:opacity-40 transition-opacity">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
               <div className="flex gap-4 animate-fade-in">
                 <div className="w-8 h-8 rounded-full bg-blood-900 flex items-center justify-center shrink-0">
                   <Bot size={14} />
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none">
                   <div className="flex gap-1.5 items-center h-full">
                     <div className="w-1.5 h-1.5 bg-blood-500 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-blood-500 rounded-full animate-bounce delay-100"></div>
                     <div className="w-1.5 h-1.5 bg-blood-500 rounded-full animate-bounce delay-200"></div>
                   </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me about the characters, the ending, or the hidden meanings..."
                className="w-full bg-slate-950 text-slate-200 pl-6 pr-14 py-5 rounded-xl border border-slate-800 focus:border-blood-600 focus:ring-1 focus:ring-blood-600 focus:shadow-[0_0_20px_rgba(225,29,72,0.1)] outline-none transition-all placeholder:text-slate-600 font-light"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-3 top-3 p-2.5 bg-blood-700 hover:bg-blood-600 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-800 transition-all hover:scale-105 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-center text-xs text-slate-600 mt-3 font-mono">
                AI can make mistakes. Please check important information.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookChat;