import React, { useEffect, useState } from 'react';
import { BookData, LoadingState } from './types';
import { fetchBookDetails } from './services/geminiService';
import HeroSection from './components/HeroSection';
import AnalysisCharts from './components/AnalysisCharts';
import BookChat from './components/BookChat';
import { Search, Loader2, Book, AlertCircle, Menu } from 'lucide-react';

const DEFAULT_BOOK = "It's in the Blood";

const App: React.FC = () => {
  const [query, setQuery] = useState(DEFAULT_BOOK);
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadBook = async (bookName: string) => {
    setStatus(LoadingState.LOADING);
    setError(null);
    try {
      const data = await fetchBookDetails(bookName);
      setBookData(data);
      setStatus(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Failed to conjure the book details. The spirits are quiet.");
      setStatus(LoadingState.ERROR);
    }
  };

  useEffect(() => {
    // Initial load
    loadBook(DEFAULT_BOOK);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      loadBook(query);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blood-500 selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-lg border-b border-slate-800 py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => loadBook(DEFAULT_BOOK)}>
            <div className="bg-blood-600 text-white p-1.5 rounded-md group-hover:rotate-12 transition-transform">
                <Book size={20} />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-white">BookLens</span>
          </div>

          <div className="flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative hidden md:block">
                <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 rounded-full px-4 py-2 pl-10 text-sm focus:border-blood-500 focus:bg-slate-900 focus:outline-none w-64 transition-all focus:w-80 placeholder:text-slate-600"
                placeholder="Search..."
                />
                <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            </form>
            <button className="md:hidden text-slate-300">
                <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {status === LoadingState.LOADING && (
          <div className="h-screen w-full flex flex-col items-center justify-center space-y-6 bg-slate-950 relative overflow-hidden">
             {/* Background glow for loader */}
             <div className="absolute w-96 h-96 bg-blood-600/10 rounded-full blur-[80px] animate-pulse"></div>
             
             <div className="relative">
                <Loader2 className="w-16 h-16 text-blood-600 animate-spin" />
                <div className="absolute inset-0 bg-blood-500/20 blur-xl rounded-full animate-ping"></div>
             </div>
             <p className="text-slate-400 font-serif text-lg tracking-widest animate-pulse">SUMMONING...</p>
          </div>
        )}

        {status === LoadingState.ERROR && (
          <div className="h-screen flex flex-col items-center justify-center space-y-4 text-center px-4 bg-slate-950">
             <AlertCircle className="w-20 h-20 text-blood-600 mb-6" />
             <h2 className="text-3xl font-serif font-bold text-white mb-2">Connection Severed</h2>
             <p className="text-slate-400 max-w-md">{error}</p>
             <button 
                onClick={() => loadBook(DEFAULT_BOOK)}
                className="mt-8 px-8 py-3 bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors"
             >
                Try Again
             </button>
          </div>
        )}

        {status === LoadingState.SUCCESS && bookData && (
          <div className="animate-fade-in">
            <HeroSection data={bookData} />
            
            {/* Characters Section */}
            <section className="py-24 bg-slate-950 relative z-10">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                     <h2 className="text-3xl font-serif font-bold text-slate-100 mb-4">Dramatis Personae</h2>
                     <div className="w-12 h-1 bg-blood-800 mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {bookData.characters.map((char, idx) => (
                    <div key={idx} className="group relative bg-slate-900 p-1 rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blood-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="bg-slate-900 p-8 h-full rounded-lg relative z-10 border border-slate-800 group-hover:border-blood-800 transition-colors">
                        <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center text-blood-500 font-serif font-bold text-2xl mb-6 shadow-inner">
                            {char.name.charAt(0)}
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-200 mb-2">{char.name}</h3>
                        <p className="text-xs uppercase tracking-widest text-blood-500 font-bold mb-4">{char.role}</p>
                        <p className="text-slate-400 leading-relaxed text-sm border-l-2 border-slate-800 pl-4 group-hover:border-blood-700 transition-colors">
                            {char.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <AnalysisCharts data={bookData} />
            
            <BookChat data={bookData} />

            {/* Footer */}
            <footer className="bg-black py-16 border-t border-slate-900">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-8 opacity-50">
                        <Book className="text-blood-600" size={24} />
                        <span className="font-serif font-bold text-xl text-white">BookLens</span>
                    </div>
                    <div className="flex justify-center gap-8 mb-8 text-sm text-slate-500">
                        <a href="#" className="hover:text-blood-500 transition-colors">About</a>
                        <a href="#" className="hover:text-blood-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blood-500 transition-colors">API</a>
                    </div>
                    <p className="text-slate-700 text-xs">
                    Powered by Google Gemini 2.5 • Developed for the AI Studio
                    </p>
                </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;