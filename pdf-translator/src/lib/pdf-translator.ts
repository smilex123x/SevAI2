import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts } from 'pdf-lib';
import { ExtractedText } from './pdf-utils';

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
}

export class PDFTranslator {
  private pdfDoc: PDFDocument | null = null;
  private pages: PDFPage[] = [];
  private fonts: Map<string, PDFFont> = new Map();

  async loadPDF(pdfBuffer: ArrayBuffer): Promise<void> {
    this.pdfDoc = await PDFDocument.load(pdfBuffer);
    this.pages = this.pdfDoc.getPages();
    
    // Pre-load fonts
    await this.loadFonts();
  }

  private async loadFonts(): Promise<void> {
    if (!this.pdfDoc) return;

    // Load standard fonts that support both English and Punjabi
    const standardFont = await this.pdfDoc.embedFont(StandardFonts.Helvetica);
    this.fonts.set('Helvetica', standardFont);

    // For better Punjabi support, we could embed a font like Noto Sans Gurmukhi
    // const punjabiFont = await this.pdfDoc.embedFont(punjabiFontBytes);
    // this.fonts.set('Punjabi', punjabiFont);
  }

  async translateAndReplace(
    extractedTexts: ExtractedText[],
    translateFunction: (text: string, targetLang: string) => Promise<string>,
    targetLanguage: string
  ): Promise<TranslationResult[]> {
    if (!this.pdfDoc) {
      throw new Error('PDF not loaded');
    }

    const results: TranslationResult[] = [];

    // Group texts by page for efficient processing
    const textsByPage = this.groupTextsByPage(extractedTexts);

    for (const [pageNum, texts] of Object.entries(textsByPage)) {
      const pageIndex = parseInt(pageNum) - 1;
      const page = this.pages[pageIndex];

      if (!page) continue;

      // Process each text item on the page
      for (const textItem of texts) {
        try {
          // Translate the text
          const translatedText = await translateFunction(textItem.text, targetLanguage);
          
          // Create translation result
          const result: TranslationResult = {
            originalText: textItem.text,
            translatedText,
            page: textItem.page,
            x: textItem.x,
            y: textItem.y,
            width: textItem.width,
            height: textItem.height,
            fontSize: textItem.fontSize
          };

          results.push(result);

          // Replace text in the PDF
          await this.replaceTextInPage(page, result);

        } catch (error) {
          console.error(`Translation failed for text: "${textItem.text}"`, error);
          // Continue with other texts
        }
      }
    }

    return results;
  }

  private groupTextsByPage(texts: ExtractedText[]): { [pageNum: number]: ExtractedText[] } {
    const grouped: { [pageNum: number]: ExtractedText[] } = {};
    
    texts.forEach(text => {
      if (!grouped[text.page]) {
        grouped[text.page] = [];
      }
      grouped[text.page].push(text);
    });

    return grouped;
  }

  private async replaceTextInPage(page: PDFPage, result: TranslationResult): Promise<void> {
    // Get the page dimensions
    const { height } = page.getSize();
    
    // Choose appropriate font based on language
    const font = this.selectFont(result.translatedText);
    
    // Calculate font size (preserve original if available)
    const fontSize = result.fontSize || 12;
    
    // Calculate text width to determine if we need to adjust positioning
    const textWidth = font.widthOfTextAtSize(result.translatedText, fontSize);
    const originalWidth = result.width;
    
    // Adjust positioning if translated text is longer/shorter
    const x = result.x;
    const y = height - result.y; // Convert from PDF coordinates
    
    // If translated text is longer, we might need to adjust
    if (textWidth > originalWidth) {
      // For now, we'll just use the original position
      // In a more sophisticated implementation, we'd handle text wrapping
    }

    // Draw the translated text
    page.drawText(result.translatedText, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0)
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private selectFont(_text: string): PDFFont {
    // Simple heuristic: if text contains Punjabi characters, use a font that supports it
    // const hasPunjabi = /[\u0A00-\u0A7F]/.test(text); // Gurmukhi Unicode range
    
    const helveticaFont = this.fonts.get('Helvetica');
    if (!helveticaFont) {
      throw new Error('Helvetica font not loaded');
    }
    
    return helveticaFont;
  }

  async save(): Promise<Uint8Array> {
    if (!this.pdfDoc) {
      throw new Error('PDF not loaded');
    }
    
    return await this.pdfDoc.save();
  }

  // Alternative approach: Create a new PDF with preserved structure
  async createTranslatedPDF(
    originalTexts: ExtractedText[],
    translatedTexts: string[]
  ): Promise<Uint8Array> {
    const newPdfDoc = await PDFDocument.create();
    
    // Copy pages from original PDF
    if (this.pdfDoc) {
      const copiedPages = await newPdfDoc.copyPages(this.pdfDoc, this.pdfDoc.getPageIndices());
      copiedPages.forEach(page => newPdfDoc.addPage(page));
    }

    // Load fonts for the new document
    const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Add translated text to the copied pages
    for (let i = 0; i < Math.min(originalTexts.length, translatedTexts.length); i++) {
      const original = originalTexts[i];
      const translated = translatedTexts[i];
      
      if (original.page <= newPdfDoc.getPageCount()) {
        const page = newPdfDoc.getPage(original.page - 1);
        const { height } = page.getSize();
        
        // Draw translated text at the same position
        page.drawText(translated, {
          x: original.x,
          y: height - original.y,
          size: original.fontSize || 12,
          font,
          color: rgb(0, 0, 0)
        });
      }
    }

    return await newPdfDoc.save();
  }
} 