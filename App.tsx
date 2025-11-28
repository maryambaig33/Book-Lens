import React, { useEffect, useState } from 'react';
import { BookData, LoadingState } from './types';
import { fetchBookDetails } from './services/geminiService';
import HeroSection from './components/HeroSection';
import AnalysisCharts from './components/AnalysisCharts';
import BookChat from './components/BookChat';
import { Search, Loader2, Book, AlertCircle } from 'lucide-react';

const DEFAULT_BOOK = "It's in the Blood";

const App: React.FC = () => {
  const [query, setQuery] = useState(DEFAULT_BOOK);
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => loadBook(DEFAULT_BOOK)}>
            <Book className="text-blood-500" size={24} />
            <span className="font-serif font-bold text-xl tracking-tighter">BookLens</span>
          </div>

          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-full px-4 py-2 pl-10 text-sm focus:border-blood-500 focus:outline-none w-64 transition-all focus:w-80"
              placeholder="Search another book..."
            />
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
          </form>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen">
        {status === LoadingState.LOADING && (
          <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
             <Loader2 className="w-12 h-12 text-blood-500 animate-spin" />
             <p className="text-slate-400 font-serif animate-pulse">Consulting the library of infinite pages...</p>
          </div>
        )}

        {status === LoadingState.ERROR && (
          <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
             <AlertCircle className="w-16 h-16 text-blood-600 mb-4" />
             <h2 className="text-2xl font-bold text-slate-200">Error Fetching Data</h2>
             <p className="text-slate-400">{error}</p>
             <button 
                onClick={() => loadBook(DEFAULT_BOOK)}
                className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
             >
                Try Again
             </button>
          </div>
        )}

        {status === LoadingState.SUCCESS && bookData && (
          <>
            <HeroSection data={bookData} />
            
            {/* Characters Section */}
            <section className="py-20 bg-slate-950">
              <div className="container mx-auto px-6">
                <h2 className="text-3xl font-serif font-bold text-slate-100 mb-12 text-center">Key Figures</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {bookData.characters.map((char, idx) => (
                    <div key={idx} className="bg-slate-900 p-8 rounded-lg border border-slate-800 hover:border-blood-800 transition-colors group">
                      <div className="w-12 h-12 bg-blood-900/30 rounded-full flex items-center justify-center text-blood-500 font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
                        {char.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-slate-200 mb-2">{char.name}</h3>
                      <p className="text-xs uppercase tracking-widest text-blood-400 mb-4">{char.role}</p>
                      <p className="text-slate-400 leading-relaxed text-sm">{char.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <AnalysisCharts data={bookData} />
            
            <BookChat data={bookData} />

            {/* Reviews Section */}
            <section className="py-20 bg-slate-900 text-center">
              <div className="container mx-auto px-6 max-w-4xl">
                 <h2 className="text-3xl font-serif font-bold text-slate-100 mb-12">Critical Acclaim</h2>
                 <div className="grid gap-8">
                    {bookData.reviews.map((review, idx) => (
                      <div key={idx} className="relative p-8">
                         <span className="text-6xl absolute top-0 left-0 text-slate-800 font-serif">"</span>
                         <p className="text-xl md:text-2xl font-serif text-slate-300 italic mb-6 relative z-10">
                           {review.quote}
                         </p>
                         <div className="flex items-center justify-center gap-4">
                            <span className="text-blood-400 font-bold tracking-wider uppercase text-sm">{review.source}</span>
                            <div className="flex text-yellow-500 text-xs gap-0.5">
                               {Array.from({length: review.rating}).map((_, i) => <StarIcon key={i} />)}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-sm">
          Enhanced by BookLens AI • Data generated by Gemini 2.5 • Not affiliated with Goodreads
        </p>
      </footer>
    </div>
  );
};

const StarIcon = () => (
  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);

export default App;
