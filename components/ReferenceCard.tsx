import React from 'react';
import { Reference } from '../types';
import { IconBook, IconExternalLink, IconNews } from './Icons';

interface ReferenceCardProps {
  reference: Reference;
  index: number;
}

const ReferenceCard: React.FC<ReferenceCardProps> = ({ reference, index }) => {
  const isJournal = reference.type === 'journal' || reference.type === 'book';
  
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow mb-3 relative overflow-hidden group">
      <div className="flex justify-between items-start z-10 relative">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
           <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">
            [{index + 1}]
           </span>
           <span className={`text-xs uppercase font-semibold tracking-wider flex items-center gap-1 ${isJournal ? 'text-brand-600' : 'text-emerald-600'}`}>
             {isJournal ? <IconBook className="w-3 h-3"/> : <IconNews className="w-3 h-3"/>}
             {reference.type}
           </span>
           {reference.doi && (
             <a 
               href={`https://doi.org/${reference.doi}`} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="text-[10px] font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors truncate max-w-[150px] sm:max-w-none"
             >
               DOI: {reference.doi}
             </a>
           )}
        </div>
        <div className="flex gap-2">
            {reference.url && (
            <a href={reference.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 transition-colors" title="Open Link">
                <IconExternalLink className="w-4 h-4" />
            </a>
            )}
        </div>
      </div>

      <h4 className="font-serif font-medium text-slate-900 leading-snug mb-1">
        {reference.title}
      </h4>

      <p className="text-xs text-slate-500 mb-3 italic">
        {reference.authors} &bull; <span className="font-semibold text-slate-600">{reference.publication}</span> {reference.year ? `(${reference.year})` : ''}
      </p>

      {/* Snippet / Proof */}
      <div className="bg-slate-50 p-2 rounded text-xs text-slate-700 mb-2 border-l-2 border-slate-300">
        <span className="font-semibold block mb-1 text-slate-900">Evidence Snippet:</span>
        "{reference.snippet}"
      </div>

      {/* Translation */}
      <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
        <span className="font-semibold text-brand-700">相关性翻译: </span>
        {reference.summary_translated_zh}
      </div>
    </div>
  );
};

export default ReferenceCard;