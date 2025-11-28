import React from 'react';
import { BookData } from '../types';
import { BookOpen, Star, Share2 } from 'lucide-react';

interface HeroSectionProps {
  data: BookData;
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blood-900/30 via-slate-950 to-slate-950 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-0 mix-blend-overlay"></div>
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        
        {/* Book Cover Placeholder */}
        <div className="w-full md:w-1/3 flex justify-center perspective-1000 animate-slide-up">
          <div className="relative w-64 h-96 md:w-80 md:h-[500px] bg-slate-800 rounded-r-lg shadow-[0_20px_50px_rgba(220,38,38,0.3)] transform transition-transform hover:rotate-y-[-5deg] duration-500 group">
             {/* Spine effect */}
             <div className="absolute left-0 top-0 bottom-0 w-4 bg-slate-700 rounded-l-sm z-20 shadow-inner"></div>
             
             {/* Cover Image */}
             <img 
               src="https://picsum.photos/seed/bloodmystery/400/600" 
               alt={data.title} 
               className="w-full h-full object-cover rounded-r-lg opacity-80 group-hover:opacity-100 transition-opacity"
             />
             
             {/* Overlay Title on Cover */}
             <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-transparent to-transparent rounded-r-lg">
                <h1 className="text-3xl font-serif font-bold text-blood-500 drop-shadow-lg tracking-tighter uppercase">{data.title}</h1>
                <p className="text-white/80 font-sans text-sm mt-2 tracking-widest">{data.author.toUpperCase()}</p>
             </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-2/3 text-center md:text-left animate-fade-in space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blood-900/30 border border-blood-800/50 text-blood-300 text-xs font-semibold tracking-wider uppercase">
             <Star className="w-3 h-3 fill-current" />
             <span>Bestseller / {data.genres[0]}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 leading-tight">
            {data.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-blood-400 font-serif italic font-light">
            "{data.tagline}"
          </p>
          
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0 border-l-2 border-blood-900 pl-6">
            {data.synopsis.slice(0, 250)}...
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
            <button className="px-8 py-4 bg-blood-700 hover:bg-blood-600 text-white font-semibold rounded-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Start Reading
            </button>
            <button className="px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold rounded-sm transition-all flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-600">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>
    </div>
  );
};

export default HeroSection;
