import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import { detectLanguage } from '@/lib/languages';
import { extractTextContent } from '@/lib/pdf-utils';

// Mock OpenAI translation function (replace with actual OpenAI API call)
async function translateText(text: string): Promise<string> {
  // This is a placeholder - replace with actual OpenAI API integration
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
                    content: `You are a professional translator specializing in English and Punjabi translation. 
        Translate the following text to the appropriate language (English or Punjabi). 
        Maintain the original meaning, tone, and context. 
        For Punjabi, use proper Gurmukhi script. 
        Return only the translated text without any explanations or additional content.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Translation service unavailable');
  }
}

// Extract text from PDF using pdfjs-dist
async function extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<string[]> {
  return extractTextContent(pdfBuffer);
}

// Create translated PDF
async function createTranslatedPDF(
  originalTexts: string[], 
  translatedTexts: string[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  // Embed a font that supports both English and Punjabi
  const fontBytes = await fetch('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf').then(res => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);
  
  // Create pages with translated text
  for (let i = 0; i < translatedTexts.length; i++) {
    const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
    const { width, height } = page.getSize();
    
    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    const margin = 50;
    const maxWidth = width - 2 * margin;
    
    // Split text into lines
    const words = translatedTexts[i].split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (textWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Draw text lines
    let y = height - margin;
    for (const line of lines) {
      if (y < margin) break; // Stop if we run out of space
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0)
      });
      y -= lineHeight;
    }
  }
  
  return await pdfDoc.save();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetLanguage = formData.get('targetLanguage') as string;

    if (!file || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing file or target language' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract text from PDF
    const originalTexts = await extractTextFromPDF(arrayBuffer);
    
    // Detect source language
    const sampleText = originalTexts.join(' ').substring(0, 1000);
    const sourceLanguage = detectLanguage(sampleText);
    
    // Check if translation is needed
    if (sourceLanguage === targetLanguage) {
      return NextResponse.json(
        { error: 'Source and target languages are the same' },
        { status: 400 }
      );
    }

    // Translate texts
    const translatedTexts: string[] = [];
    for (const text of originalTexts) {
      if (text.trim()) {
        const translated = await translateText(text);
        translatedTexts.push(translated);
      } else {
        translatedTexts.push(text); // Preserve empty lines
      }
    }

    // Create translated PDF
    const translatedPdfBuffer = await createTranslatedPDF(
      originalTexts, 
      translatedTexts
    );

    // In a real implementation, you would:
    // 1. Upload the translated PDF to Vercel Blob Storage
    // 2. Return the download URL
    // For now, we'll return a mock response
    
    return NextResponse.json({
      success: true,
      downloadUrl: '/api/download/mock-translated-pdf',
      message: 'Translation completed successfully'
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    );
  }
} 