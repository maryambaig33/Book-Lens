import React from 'react';
import { BookData } from '../types';
import { BookOpen, Share2, ExternalLink, Star } from 'lucide-react';

interface HeroSectionProps {
  data: BookData;
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  return (
    <div className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_var(--tw-gradient-stops))] from-blood-900/20 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="order-2 lg:order-1 text-center lg:text-left animate-fade-in space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blood-900/20 border border-blood-500/30 text-blood-400 text-xs font-bold tracking-widest uppercase">
             <span className="w-2 h-2 rounded-full bg-blood-500 animate-pulse"></span>
             <span>Now Trending</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl lg:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 leading-[0.9]">
              {data.title}
            </h1>
            <p className="text-xl lg:text-3xl text-blood-500 font-serif italic font-light tracking-wide">
              {data.tagline}
            </p>
          </div>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
            {data.synopsis.slice(0, 300)}...
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <button className="group px-8 py-4 bg-slate-100 hover:bg-white text-slate-950 font-bold rounded-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-3">
              <BookOpen className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span>Read Sample</span>
            </button>
            
            {data.goodreadsUrl && (
              <a 
                href={data.goodreadsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent border border-slate-700 hover:border-blood-500 hover:text-blood-400 text-slate-300 font-medium rounded-sm transition-all flex items-center gap-3"
              >
                <span className="font-serif">Goodreads</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <div className="flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm font-medium pt-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-blood-500 fill-blood-500" />
              <span>4.8/5 Rating</span>
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <span>{data.genres[0]}</span>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <span>{data.publicationYear}</span>
          </div>
        </div>

        {/* Book Cover */}
        <div className="order-1 lg:order-2 flex justify-center perspective-1000 animate-slide-up">
          <div className="relative w-72 h-[450px] lg:w-[400px] lg:h-[600px] animate-float">
             {/* Glow behind */}
             <div className="absolute inset-0 bg-blood-600/20 blur-[60px] rounded-full transform scale-90"></div>
             
             {/* The Book */}
             <div className="relative w-full h-full bg-slate-900 rounded-r-lg shadow-[20px_20px_60px_rgba(0,0,0,0.5)] transform rotate-y-[-15deg] transition-transform hover:rotate-y-[-5deg] duration-700 ease-out group border-l border-slate-800">
                
                {/* Book Texture Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-multiply z-10 rounded-r-lg"></div>

                {/* Cover Image Area */}
                <img 
                  src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop" 
                  alt={data.title} 
                  className="absolute inset-0 w-full h-full object-cover rounded-r-lg opacity-60 mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Title Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12 z-20 bg-gradient-to-tr from-black/80 via-transparent to-transparent rounded-r-lg">
                   <div className="text-right">
                     <p className="text-blood-500 font-bold tracking-widest text-sm uppercase">A Novel By</p>
                     <p className="text-white font-serif tracking-wide mt-1">{data.author}</p>
                   </div>
                   
                   <div>
                      <h1 className="text-4xl lg:text-6xl font-serif font-black text-white leading-none uppercase tracking-tighter drop-shadow-2xl">
                        {data.title}
                      </h1>
                      <div className="w-12 h-1 bg-blood-600 mt-6"></div>
                   </div>
                </div>

                {/* Spine Effect */}
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-white/20 z-30"></div>
             </div>
          </div>
        </div>

      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
        <svg className="w-6 h-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>
    </div>
  );
};

export default HeroSection;