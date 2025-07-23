'use client';

import { LANGUAGE_PAIRS } from '@/lib/languages';
import { useTranslationStore } from '@/lib/store';
import { Languages, ArrowRight } from 'lucide-react';

export default function LanguageSelector() {
  const { 
    detectedLanguage, 
    targetLanguage, 
    setTargetLanguage,
    file 
  } = useTranslationStore();

  if (!file) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Languages className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Choose Translation Direction
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LANGUAGE_PAIRS.map((pair) => (
            <button
              key={`${pair.from.code}-${pair.to.code}`}
              onClick={() => setTargetLanguage(pair.to.code)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${targetLanguage === pair.to.code 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {pair.from.nativeName}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">
                      {pair.to.nativeName}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {pair.description}
                  </p>
                </div>
                
                {targetLanguage === pair.to.code && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {detectedLanguage && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Detected language:</span> {
                detectedLanguage === 'en' ? 'English' : 'Punjabi'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 