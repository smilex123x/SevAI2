'use client';

import { Download, FileText } from 'lucide-react';
import { useTranslationStore } from '@/lib/store';
import { LANGUAGES } from '@/lib/languages';

export default function DownloadButton() {
  const { translatedPdfUrl, targetLanguage, fileName } = useTranslationStore();

  if (!translatedPdfUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(translatedPdfUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const originalName = fileName.replace('.pdf', '');
      const targetLangName = LANGUAGES[targetLanguage]?.name.toLowerCase() || 'translated';
      link.download = `${originalName}-${targetLangName}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">
            Translation Complete!
          </h3>
        </div>
        
        <p className="text-green-700 mb-4">
          Your PDF has been successfully translated to {LANGUAGES[targetLanguage]?.nativeName}.
          All formatting, images, and structure have been preserved.
        </p>
        
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download Translated PDF</span>
        </button>
        
        <div className="mt-4 p-3 bg-white rounded border">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {fileName.replace('.pdf', '')}-{LANGUAGES[targetLanguage]?.name.toLowerCase()}.pdf
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
  );
} 