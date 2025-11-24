import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse } from "../types";

const parseGeminiResponse = (text: string): AnalysisResponse => {
  try {
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json\n|\n```|```/g, "").trim();
    // Attempt to find the first '[' or '{'
    const jsonStartIndex = cleanText.indexOf('{');
    const jsonEndIndex = cleanText.lastIndexOf('}');
    
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
       const jsonStr = cleanText.substring(jsonStartIndex, jsonEndIndex + 1);
       return JSON.parse(jsonStr) as AnalysisResponse;
    }
    throw new Error("No JSON found in response");
  } catch (e) {
    console.error("Failed to parse JSON", e);
    // Fallback empty structure
    return { points: [] };
  }
};

export const analyzeTextForCitations = async (inputText: string): Promise<AnalysisResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemPrompt = `
    You are an expert academic research assistant similar to "Research House" (科研之家). 
    Your strict goal is to find REAL, VERIFIABLE citations for the arguments presented in the user's text.
    
    RULES:
    1. You MUST use the Google Search tool to verify claims.
    2. DO NOT hallucinate citations. If a claim has no backing, state it.
    3. SEARCH SCOPE: 
       - Journals: Web of Science, IEEE, Nature, Science, Springer, Elsevier.
       - Databases: Google Scholar, Baidu Scholar, CNKI (China National Knowledge Infrastructure).
       - Other: Reputable News (BBC, NYT, Xinhua, etc.), Books, Official Reports.
    4. You must match specific phrases in the input text to the evidence found.
    5. Provide a Chinese translation (summary_translated_zh) for the relevance of the paper/article to the user's argument so they can compare.
    6. CRITICAL: Provide the DOI (Digital Object Identifier) for academic papers whenever available.
    7. For each argument, try to find 2-3 references if possible. Try to include BOTH English and Chinese sources if the topic allows.
    8. For News items, a specific URL is MANDATORY.

    OUTPUT FORMAT:
    Return a single JSON object with a property "points" which is an array. 
    Each item in "points" should have:
    - "id": string (unique id)
    - "original_text_match": string (the exact quote from user input being supported)
    - "argument_summary": string (brief summary of the claim)
    - "status": "verified" | "no_result" | "partial"
    - "references": Array of objects containing:
      - "title": string
      - "authors": string
      - "publication": string (Journal Name, Website Name, Database Name)
      - "year": string
      - "url": string (REQUIRED for news/web, Optional for papers if DOI exists but recommended)
      - "doi": string (The DOI string, e.g., "10.1038/s41586-020-2012-7". Empty if not applicable)
      - "type": "journal" | "news" | "book" | "other"
      - "snippet": string (a short quote or finding from the source)
      - "summary_translated_zh": string (Chinese explanation of why this source supports the claim)
  `;

  const userPrompt = `Please analyze the following text and find citations (English & Chinese) for the key arguments:\n\n"${inputText}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
        // We do not use responseMimeType: 'application/json' combined with search in this specific manner 
        // because we want the model to use the tool freely then format the output.
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return parseGeminiResponse(text);

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};