import React from 'react';
import { BookData } from '../types';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Zap, Quote } from 'lucide-react';

interface AnalysisChartsProps {
  data: BookData;
}

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ data }) => {
  return (
    <div className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-blood-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-white mb-6">Deconstructed Narrative</h2>
            <div className="w-16 h-1 bg-blood-700 mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-400 text-lg font-light">
              An AI-driven breakdown of the emotional cadence and thematic structure hidden within the pages.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart 1: Tension Arc (Larger) */}
          <div className="lg:col-span-8 glass-panel p-8 rounded-2xl relative group hover:border-blood-500/30 transition-colors duration-500">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-medium text-slate-200 flex items-center gap-3">
                  <span className="p-2 bg-slate-800 rounded-lg text-blood-500"><Activity size={18} /></span>
                  Narrative Tension
               </h3>
               <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Emotional Velocity</span>
             </div>
             
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.emotionalArc} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTension" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                        dataKey="chapter" 
                        stroke="#334155" 
                        tick={{fontSize: 12, fill: '#64748b'}}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={15}
                        label={{ value: 'Chapter Progression', position: 'insideBottom', offset: -5, fill: '#475569', fontSize: 12 }}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f1f5f9', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}
                        itemStyle={{ color: '#fb7185' }}
                        cursor={{ stroke: '#e11d48', strokeWidth: 1, strokeDasharray: '5 5' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="tension" 
                        stroke="#e11d48" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorTension)" 
                        animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Themes (Smaller) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="glass-panel p-8 rounded-2xl h-full flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blood-600/10 rounded-full blur-[40px] translate-x-10 -translate-y-10"></div>
                
                <h3 className="text-xl font-medium text-slate-200 mb-6 flex items-center gap-3 relative z-10">
                    <span className="p-2 bg-slate-800 rounded-lg text-yellow-500"><Zap size={18} /></span>
                    Core Themes
                </h3>
                
                <div className="flex flex-wrap gap-3 relative z-10">
                    {data.themes.map((theme, idx) => (
                        <div key={idx} className="group relative">
                             <div className="absolute -inset-px bg-gradient-to-r from-blood-600 to-purple-600 rounded-md opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                             <div className="relative px-4 py-2 bg-slate-900 border border-slate-800 rounded-md text-sm text-slate-300 group-hover:text-white transition-colors">
                                {theme}
                             </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800 relative z-10">
                     <p className="text-sm text-slate-500 italic flex gap-2">
                        <Quote size={16} className="text-blood-700 shrink-0 transform scale-x-[-1]" />
                        {data.reviews[0]?.quote.slice(0, 80)}..."
                     </p>
                     <p className="text-right text-xs text-blood-400 mt-2 font-bold uppercase tracking-wider">— {data.reviews[0]?.source}</p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;