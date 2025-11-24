import React from 'react';
import { AnalysisPoint } from '../types';
import ReferenceCard from './ReferenceCard';
import { IconCheck, IconAlert } from './Icons';

interface AnalysisResultProps {
  point: AnalysisPoint;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ point }) => {
  const hasReferences = point.references && point.references.length > 0;

  return (
    <div className="mb-8 border-l-4 border-l-brand-500 pl-4 py-1 animate-fadeIn">
      <div className="mb-4">
        <h3 className="text-sm uppercase tracking-wide text-slate-400 font-bold mb-1">Original Text Segment</h3>
        <blockquote className="font-serif text-lg text-slate-800 bg-brand-50 p-4 rounded-r-lg border-y border-r border-brand-100 italic relative">
          <span className="absolute -left-3 top-2 text-4xl text-brand-200 leading-none">“</span>
          {point.original_text_match}
          <span className="absolute bottom-0 right-2 text-4xl text-brand-200 leading-none">”</span>
        </blockquote>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
            <div className={`p-1 rounded-full ${hasReferences ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                {hasReferences ? <IconCheck className="w-4 h-4"/> : <IconAlert className="w-4 h-4"/>}
            </div>
            <h3 className="text-sm font-bold text-slate-700">
                {hasReferences ? `Verified Support Found (${point.references.length})` : 'No Direct Citation Found'}
            </h3>
        </div>
        <p className="text-sm text-slate-600 ml-8">{point.argument_summary}</p>
      </div>

      {hasReferences ? (
        <div className="ml-4 md:ml-8 grid gap-4 grid-cols-1">
          {point.references.map((ref, idx) => (
            <ReferenceCard key={idx} reference={ref} index={idx} />
          ))}
        </div>
      ) : (
        <div className="ml-8 p-4 bg-amber-50 text-amber-800 text-sm rounded border border-amber-100">
          This statement could not be directly verified with high-confidence academic sources in the search. It may be original research, common knowledge, or require rewording for search.
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;