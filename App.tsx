import React, { useState } from 'react';
import { analyzeTextForCitations } from './services/geminiService';
import { AnalysisResponse, AppState } from './types';
import AnalysisResult from './components/AnalysisResult';
import { IconSearch, IconLoader, IconBook } from './components/Icons';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setAppState(AppState.ANALYZING);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeTextForCitations(inputText);
      setResults(data);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
      setAppState(AppState.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 text-white p-1.5 rounded-lg">
                <IconBook className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              ScholarRef <span className="text-brand-600 font-light">AI</span>
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Verifying against Web of Science, IEEE, Nature, Google Scholar & News
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            
            {/* Left Column: Input */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-[calc(100vh-140px)] sticky top-24">
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  1. Input Text
                  <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">English or Chinese</span>
                </h2>
                <p className="text-sm text-slate-500 mb-4">
                  Paste your abstract, introduction, or arguments here. We will verify your claims against real literature.
                </p>
                <textarea
                  className="flex-grow w-full p-4 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none font-serif text-slate-700 leading-relaxed custom-scrollbar transition-all"
                  placeholder="Paste your text here (e.g., 'Recent studies suggest that global warming has accelerated due to increased carbon emissions in the last decade...')"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={appState === AppState.ANALYZING}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={appState === AppState.ANALYZING || !inputText.trim()}
                    className={`
                      flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all
                      ${appState === AppState.ANALYZING || !inputText.trim() 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg active:scale-95'}
                    `}
                  >
                    {appState === AppState.ANALYZING ? (
                      <>
                        <IconLoader className="animate-spin w-5 h-5" />
                        Analyzing Literature...
                      </>
                    ) : (
                      <>
                        <IconSearch className="w-5 h-5" />
                        Find Real Citations
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[calc(100vh-140px)] p-6">
                 <h2 className="text-lg font-semibold mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                  <span>2. Verification Results</span>
                  {results && (
                    <span className="text-xs font-normal text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                      {results.points.length} Segments Analyzed
                    </span>
                  )}
                </h2>

                {appState === AppState.IDLE && (
                   <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center p-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <IconBook className="w-8 h-8 text-slate-300" />
                      </div>
                      <p>Enter text on the left to begin the citation search.</p>
                      <p className="text-xs mt-2 max-w-xs">Supported sources: Journals (Web of Science, IEEE, Nature), Google Scholar, News, Books.</p>
                   </div>
                )}

                {appState === AppState.ERROR && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}

                {appState === AppState.ANALYZING && (
                   <div className="space-y-8 animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="border-l-4 border-slate-200 pl-4 py-2">
                           <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
                           <div className="h-20 bg-slate-100 rounded w-full mb-4"></div>
                           <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                           <div className="h-32 bg-slate-50 rounded border border-slate-100 w-full"></div>
                        </div>
                      ))}
                   </div>
                )}

                {appState === AppState.SUCCESS && results && (
                  <div className="space-y-4">
                    {results.points.length === 0 ? (
                      <div className="text-center text-slate-500 py-10">
                        No distinct arguments found to verify. Please try a longer text.
                      </div>
                    ) : (
                      results.points.map((point) => (
                        <AnalysisResult key={point.id} point={point} />
                      ))
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;