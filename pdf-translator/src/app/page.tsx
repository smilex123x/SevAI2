'use client';

import { useEffect } from 'react';
import { useTranslationStore } from '@/lib/store';
import FileUpload from '@/components/FileUpload';
import LanguageSelector from '@/components/LanguageSelector';
import TranslationButton from '@/components/TranslationButton';
import DownloadButton from '@/components/DownloadButton';
import { Globe, FileText, Zap, Shield } from 'lucide-react';

export default function Home() {
  const { 
    file, 
    detectedLanguage, 
    setDetectedLanguage,
    error 
  } = useTranslationStore();

  // Auto-detect language when file is uploaded
  useEffect(() => {
    if (file && !detectedLanguage) {
      detectLanguageFromFile();
    }
  }, [file, detectedLanguage]);

  const detectLanguageFromFile = async () => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/detect-language', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setDetectedLanguage(result.detectedLanguage);
      }
    } catch (error) {
      console.error('Language detection failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Globe className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  PDF Translator
                </h1>
                <p className="text-sm text-gray-600">
                  English ↔ Punjabi Translation
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Translate PDFs with AI Precision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload your PDF and get a perfectly translated version with all formatting, 
            images, and structure preserved. Powered by advanced AI technology.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <FileText className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Format Preservation
            </h3>
            <p className="text-gray-600">
              Maintains all original formatting, fonts, images, and layout structure.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <Zap className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Fast & Accurate
            </h3>
            <p className="text-gray-600">
              Powered by GPT-4o-mini for high-quality English-Punjabi translation.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <Shield className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your files are processed securely and never stored permanently.
            </p>
          </div>
        </div>

        {/* Translation Interface */}
        <div className="max-w-4xl mx-auto">
          {/* File Upload */}
          <FileUpload />

          {/* Error Display */}
          {error && (
            <div className="w-full max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Language Selection */}
          <LanguageSelector />

          {/* Translation Button */}
          <TranslationButton />

          {/* Download Button */}
          <DownloadButton />
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            Free PDF translation service. No registration required.
          </p>
        </footer>
      </main>
    </div>
  );
}
