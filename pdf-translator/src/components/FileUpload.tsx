'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useTranslationStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function FileUpload() {
  const { file, fileName, setFile, setError } = useTranslationStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) {
      toast.error('No file selected');
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      setError('Only PDF files are supported');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      setError('File size must be less than 10MB');
      return;
    }

    setFile(file);
    toast.success('PDF uploaded successfully!');
  }, [setFile, setError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          dropzone p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'drag-active' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${file ? 'border-green-500 bg-green-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {file ? (
            <>
              <FileText className="w-12 h-12 text-green-600" />
              <div>
                <p className="text-lg font-semibold text-green-800">
                  {fileName}
                </p>
                <p className="text-sm text-green-600">
                  Click to upload a different file
                </p>
              </div>
            </>
          ) : isDragReject ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500" />
              <div>
                <p className="text-lg font-semibold text-red-800">
                  Invalid file type
                </p>
                <p className="text-sm text-red-600">
                  Please upload a PDF file
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {isDragActive ? 'Drop your PDF here' : 'Upload your PDF'}
                </p>
                <p className="text-sm text-gray-500">
                  Drag and drop a PDF file, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Maximum file size: 10MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 