'use client';

import { useState } from 'react';
import { Play, Loader2, CheckCircle } from 'lucide-react';
import { useTranslationStore } from '@/lib/store';
import { LANGUAGES } from '@/lib/languages';
import toast from 'react-hot-toast';

export default function TranslationButton() {
  const { 
    file, 
    targetLanguage, 
    isProcessing, 
    setProcessing, 
    setProgress, 
    setCurrentStep,
    setTranslatedPdfUrl,
    setError 
  } = useTranslationStore();

  const [isStarting, setIsStarting] = useState(false);

  const handleTranslate = async () => {
    if (!file || !targetLanguage) {
      toast.error('Please upload a PDF and select a target language');
      return;
    }

    setIsStarting(true);
    setProcessing(true);
    setError(null);
    setProgress(0);
    setCurrentStep('Preparing translation...');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetLanguage', targetLanguage);

      // Start translation process
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setTranslatedPdfUrl(result.downloadUrl);
        setProgress(100);
        setCurrentStep('Translation completed!');
        toast.success('Translation completed successfully!');
      } else {
        throw new Error(result.error || 'Translation failed');
      }

    } catch (error) {
      console.error('Translation error:', error);
      setError(error instanceof Error ? error.message : 'Translation failed');
      toast.error('Translation failed. Please try again.');
    } finally {
      setProcessing(false);
      setIsStarting(false);
    }
  };

  const isDisabled = !file || !targetLanguage || isProcessing;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <button
        onClick={handleTranslate}
        disabled={isDisabled}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200
          flex items-center justify-center space-x-2
          ${isDisabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Translating...</span>
          </>
        ) : isStarting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Starting translation...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span>
              Translate to {LANGUAGES[targetLanguage]?.nativeName || 'Selected Language'}
            </span>
          </>
        )}
      </button>
      
      {isProcessing && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Processing your PDF...
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${useTranslationStore.getState().progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            {useTranslationStore.getState().currentStep}
          </p>
        </div>
      )}
    </div>
  );
} 