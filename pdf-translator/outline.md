# PDF Translator - English ↔ Punjabi Translation App

## Project Overview
A modern SaaS-style web application that translates PDFs between English and Punjabi while preserving formatting, images, and document structure.

## Key Requirements

### Core Functionality
- **Language Pair**: English ↔ Punjabi (bidirectional translation)
- **File Format**: PDF only (no OCR needed - text-based PDFs only)
- **Preservation**: Maintain all formatting, images, graphics, text hierarchy, backgrounds
- **AI Translation**: OpenAI GPT-4o-mini for high-quality translation
- **No Authentication**: Free to use, no login required
- **No Analytics**: Minimal bloat, focused functionality

### User Flow
1. User uploads PDF
2. AI detects source language (English or Punjabi)
3. User selects target language (English or Punjabi)
4. App processes and translates the entire PDF
5. User downloads translated PDF with preserved formatting

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **File Upload**: react-dropzone
- **UI Components**: Lucide React icons, react-hot-toast notifications

### Backend Stack (Vercel Functions)
- **PDF Processing**: pdf-lib (generation), pdfjs-dist (parsing)
- **Language Detection**: Hybrid approach (franc + AI fallback)
- **Translation**: OpenAI API (GPT-4o-mini)
- **File Storage**: Vercel Blob Storage

### Performance Optimizations
- **Language Detection**: Use franc for speed (95% accuracy), AI fallback for confidence
- **Streaming**: Server-Sent Events for real-time progress
- **Chunked Processing**: Process PDFs in chunks to avoid timeouts
- **Caching**: Cache common translations and language detections
- **Compression**: Compress PDFs before processing

## Implementation Phases

### Phase 1: Core Infrastructure ✅
- [x] Project setup with Next.js 15
- [x] Dependencies configuration
- [x] Global styling and layout
- [x] State management with Zustand
- [ ] Install dependencies

### Phase 2: PDF Processing Pipeline
- [ ] API routes for PDF processing
- [ ] PDF parsing and text extraction
- [ ] Language detection (franc + AI fallback)
- [ ] Text translation with OpenAI
- [ ] PDF reconstruction with preserved formatting

### Phase 3: User Experience
- [ ] File upload component with drag & drop
- [ ] Language selection interface
- [ ] Progress tracking and real-time updates
- [ ] Download mechanism
- [ ] Error handling and user feedback

### Phase 4: Polish & Optimization
- [ ] Performance optimization
- [ ] UI/UX improvements
- [ ] Error boundaries
- [ ] Testing and refinement

## Key Libraries & Dependencies

### Core Dependencies
- `pdf-lib`: PDF manipulation and creation
- `pdfjs-dist`: PDF parsing and text extraction
- `franc`: Fast language detection
- `react-dropzone`: File upload UI
- `react-hot-toast`: User notifications
- `lucide-react`: Modern icons
- `zustand`: State management
- `axios`: HTTP requests

### Language-Specific Considerations
- **Punjabi Support**: Ensure proper Unicode handling for Gurmukhi script
- **Font Preservation**: Maintain original fonts or provide Punjabi-compatible alternatives
- **Text Direction**: Handle right-to-left text flow for Punjabi
- **Character Encoding**: Proper UTF-8 encoding for both languages

## Technical Challenges & Solutions

### Challenge 1: Format Preservation
**Solution**: Use pdf-lib to extract and recreate PDF structure while replacing text content

### Challenge 2: Language Detection Accuracy
**Solution**: Hybrid approach - fast franc detection with AI fallback for low confidence

### Challenge 3: Large PDF Processing
**Solution**: Chunked processing with progress tracking and streaming responses

### Challenge 4: Punjabi Text Rendering
**Solution**: Ensure proper font embedding and Unicode support

## Performance Targets
- **Upload to Detection**: < 2 seconds
- **Translation Processing**: < 30 seconds for typical documents
- **Download Ready**: < 5 seconds after processing
- **Memory Usage**: < 512MB per request
- **Concurrent Users**: Support 10+ simultaneous translations

## Security Considerations
- **File Validation**: Strict PDF validation and size limits
- **API Security**: Secure OpenAI API integration
- **Data Privacy**: No persistent storage of user files
- **Rate Limiting**: Prevent abuse while maintaining usability

## Deployment Strategy
- **Platform**: Vercel (free tier)
- **File Storage**: Vercel Blob Storage
- **CDN**: Vercel Edge Network for global performance
- **Monitoring**: Basic error tracking and performance monitoring

## Future Enhancements (Post-MVP)
- Batch processing for multiple PDFs
- Translation memory for common phrases
- Custom formatting templates
- Preview mode with side-by-side comparison
- Export options (DOCX, TXT)
- Mobile-responsive design improvements 