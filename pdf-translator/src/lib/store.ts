import { create } from 'zustand';

export interface TranslationState {
  // File state
  file: File | null;
  fileName: string;
  
  // Processing state
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  
  // Language state
  detectedLanguage: string;
  targetLanguage: string;
  
  // Results
  translatedPdfUrl: string | null;
  error: string | null;
  
  // Actions
  setFile: (file: File) => void;
  setProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  setCurrentStep: (step: string) => void;
  setDetectedLanguage: (language: string) => void;
  setTargetLanguage: (language: string) => void;
  setTranslatedPdfUrl: (url: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  file: null,
  fileName: '',
  isProcessing: false,
  progress: 0,
  currentStep: '',
  detectedLanguage: '',
  targetLanguage: '',
  translatedPdfUrl: null,
  error: null,
};

export const useTranslationStore = create<TranslationState>((set) => ({
  ...initialState,
  
  setFile: (file: File) => set({ 
    file, 
    fileName: file.name,
    error: null,
    translatedPdfUrl: null 
  }),
  
  setProcessing: (isProcessing: boolean) => set({ 
    isProcessing,
    progress: isProcessing ? 0 : 100 
  }),
  
  setProgress: (progress: number) => set({ progress }),
  
  setCurrentStep: (currentStep: string) => set({ currentStep }),
  
  setDetectedLanguage: (detectedLanguage: string) => set({ detectedLanguage }),
  
  setTargetLanguage: (targetLanguage: string) => set({ targetLanguage }),
  
  setTranslatedPdfUrl: (translatedPdfUrl: string | null) => set({ translatedPdfUrl }),
  
  setError: (error: string | null) => set({ 
    error,
    isProcessing: false,
    progress: 0 
  }),
  
  reset: () => set(initialState),
})); 