import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export interface ExtractedText {
  text: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
}

export async function extractTextFromPDF(pdfBuffer: ArrayBuffer): Promise<ExtractedText[]> {
  try {
    const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    const extractedTexts: ExtractedText[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      for (const item of textContent.items) {
        if ('str' in item && item.str.trim()) {
          const transform = item.transform;
          extractedTexts.push({
            text: item.str,
            page: pageNum,
            x: transform[4],
            y: transform[5],
            width: item.width || 0,
            height: item.height || 0
          });
        }
      }
    }

    return extractedTexts;
  } catch (error) {
    console.error('PDF text extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export function groupTextByPages(extractedTexts: ExtractedText[]): string[] {
  const pages: { [key: number]: string[] } = {};
  
  // Group text items by page
  extractedTexts.forEach(item => {
    if (!pages[item.page]) {
      pages[item.page] = [];
    }
    pages[item.page].push(item.text);
  });
  
  // Convert to array of page texts
  return Object.keys(pages)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(pageNum => pages[parseInt(pageNum)].join(' '));
}

export function extractTextContent(pdfBuffer: ArrayBuffer): Promise<string[]> {
  return extractTextFromPDF(pdfBuffer).then(groupTextByPages);
}

// Utility function to validate PDF file
export function validatePDFFile(file: File): { isValid: boolean; error?: string } {
  if (file.type !== 'application/pdf') {
    return { isValid: false, error: 'File must be a PDF' };
  }
  
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }
  
  return { isValid: true };
} 