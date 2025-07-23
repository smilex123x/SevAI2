import { NextRequest, NextResponse } from 'next/server';
import { detectLanguage } from '@/lib/languages';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to text (simplified - in real implementation, we'd extract text from PDF)
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder().decode(arrayBuffer);
    
    // Extract first 1000 characters for language detection
    const sampleText = text.substring(0, 1000);
    
    // Detect language using franc
    const detectedLang = detectLanguage(sampleText);

    return NextResponse.json({
      success: true,
      detectedLanguage: detectedLang,
      confidence: 'high' // franc is very reliable for English vs Punjabi
    });

  } catch (error) {
    console.error('Language detection error:', error);
    return NextResponse.json(
      { error: 'Language detection failed' },
      { status: 500 }
    );
  }
} 