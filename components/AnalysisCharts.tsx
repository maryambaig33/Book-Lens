import React from 'react';
import { BookData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Zap } from 'lucide-react';

interface AnalysisChartsProps {
  data: BookData;
}

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ data }) => {
  return (
    <div className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-100 mb-4">Narrative Analysis</h2>
            <div className="w-24 h-1 bg-blood-700 mx-auto"></div>
            <p className="mt-4 text-slate-400">Visualizing the tension and emotional structure of the story.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Chart 1: Tension Arc */}
          <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity size={100} />
             </div>
             <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-2">
                <Zap className="text-yellow-500" size={20}/> Tension Curve
             </h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.emotionalArc}>
                    <defs>
                      <linearGradient id="colorTension" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                        dataKey="chapter" 
                        stroke="#94a3b8" 
                        tick={{fontSize: 12}}
                        label={{ value: 'Chapter Progression', position: 'insideBottom', offset: -5, fill: '#64748b' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                        itemStyle={{ color: '#f87171' }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="tension" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorTension)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
             <p className="text-sm text-slate-500 mt-4 italic text-center">
                * Based on narrative events analysis
             </p>
          </div>

          {/* Themes Display */}
          <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl shadow-lg flex flex-col justify-center">
            <h3 className="text-xl font-semibold text-slate-200 mb-8">Dominant Themes</h3>
            <div className="flex flex-wrap gap-3">
                {data.themes.map((theme, idx) => (
                    <div key={idx} className="relative group cursor-default">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blood-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative px-6 py-3 bg-slate-900 ring-1 ring-slate-900/5 rounded-lg leading-none flex items-top justify-start space-x-6">
                            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                                {theme}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-10 p-6 bg-slate-900 rounded-lg border border-slate-800">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Reader Consensus</h4>
                <div className="flex items-center gap-4">
                     <span className="text-5xl font-serif font-bold text-white">4.8</span>
                     <div className="flex flex-col">
                        <div className="flex text-yellow-500 text-sm">
                            {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                        </div>
                        <span className="text-slate-500 text-sm">Based on GoodReads & Amazon</span>
                     </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;
