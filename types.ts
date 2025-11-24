export interface Reference {
  title: string;
  authors: string;
  publication: string;
  year: string;
  url: string;
  doi?: string; // Added DOI support
  type: 'journal' | 'news' | 'book' | 'other';
  snippet: string; // The specific relevant text found
  summary_translated_zh: string; // Chinese translation of the relevance
}

export interface AnalysisPoint {
  id: string;
  original_text_match: string; // The specific sentence/phrase from user input
  argument_summary: string; // What the AI thinks the argument is
  references: Reference[];
  status: 'verified' | 'no_result' | 'partial';
}

export interface AnalysisResponse {
  points: AnalysisPoint[];
}

export enum AppState {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR
}