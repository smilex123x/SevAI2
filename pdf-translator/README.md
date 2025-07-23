# PDF Translator - English ↔ Punjabi Translation

A modern SaaS-style web application that translates PDFs between English and Punjabi while preserving formatting, images, and document structure.

## 🌟 Features

- **Bidirectional Translation**: English ↔ Punjabi
- **Format Preservation**: Maintains all original formatting, fonts, images, and layout
- **AI-Powered**: Uses OpenAI GPT-4o-mini for high-quality translation
- **Fast Processing**: Optimized for quick translation with real-time progress
- **No Registration**: Free to use, no login required
- **Modern UI**: Beautiful, responsive design with drag & drop upload

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Vercel Functions
- **PDF Processing**: pdf-lib, pdfjs-dist
- **Language Detection**: franc (fast and accurate for English-Punjabi)
- **Translation**: OpenAI GPT-4o-mini
- **State Management**: Zustand
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pdf-translator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI API Configuration
   # Get your API key from: https://platform.openai.com/api-keys
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional: Set to 'true' to enable mock translations for testing
   # MOCK_TRANSLATION=true
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### Current Process (Text Replacement)
1. **Upload PDF**: User drags & drops a PDF file
2. **Language Detection**: Fast detection using franc library
3. **Text Extraction**: Extract text with positioning using pdfjs-dist
4. **Translation**: Translate text using OpenAI GPT-4o-mini
5. **PDF Reconstruction**: Replace text in place while preserving formatting
6. **Download**: Serve translated PDF with all original elements intact

### PDF Processing Approach
- **Text Replacement**: Preserves original PDF structure, images, and formatting
- **Position Preservation**: Maintains exact text positioning and layout
- **Font Support**: Handles both English and Punjabi (Gurmukhi) characters
- **Image Preservation**: Keeps all original images and graphics

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

### File Limits
- **Maximum file size**: 10MB
- **Supported format**: PDF only
- **Text-based PDFs**: OCR not supported

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Add environment variables in Vercel dashboard

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Environment Setup in Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add `OPENAI_API_KEY` with your API key

## 📁 Project Structure

```
pdf-translator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── detect-language/     # Language detection API
│   │   │   ├── translate/           # Main translation API
│   │   │   └── download/            # PDF download API
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Main page
│   ├── components/
│   │   ├── FileUpload.tsx           # File upload component
│   │   ├── LanguageSelector.tsx     # Language selection
│   │   ├── TranslationButton.tsx    # Translation controls
│   │   └── DownloadButton.tsx       # Download component
│   └── lib/
│       ├── store.ts                 # Zustand state management
│       ├── languages.ts             # Language configuration
│       ├── pdf-utils.ts             # PDF processing utilities
│       └── pdf-translator.ts        # Advanced PDF translation
├── public/                          # Static assets
└── package.json                     # Dependencies
```

## 🔍 API Endpoints

### POST `/api/detect-language`
Detects the language of uploaded PDF text.

**Request:**
- `file`: PDF file (multipart/form-data)

**Response:**
```json
{
  "success": true,
  "detectedLanguage": "en",
  "confidence": "high"
}
```

### POST `/api/translate`
Translates PDF content.

**Request:**
- `file`: PDF file (multipart/form-data)
- `targetLanguage`: Target language code ("en" or "pa")

**Response:**
```json
{
  "success": true,
  "downloadUrl": "/api/download/translated-pdf",
  "message": "Translation completed successfully"
}
```

## 🎨 Customization

### Adding New Languages
1. Update `src/lib/languages.ts`
2. Add language codes and mappings
3. Update UI components

### Styling
- Uses Tailwind CSS for styling
- Custom CSS in `src/app/globals.css`
- Component-specific styles in each component

## 🔒 Security

- **File Validation**: Strict PDF validation and size limits
- **API Security**: Secure OpenAI API integration
- **Data Privacy**: No persistent storage of user files
- **Rate Limiting**: Built-in protection against abuse

## 🐛 Troubleshooting

### Common Issues

1. **"franc is not a function"**
   - Ensure franc is properly installed: `npm install franc`

2. **PDF processing errors**
   - Check file size (max 10MB)
   - Ensure PDF contains extractable text
   - Verify PDF is not corrupted

3. **Translation failures**
   - Check OpenAI API key is valid
   - Verify API quota and limits
   - Check network connectivity

### Performance Optimization

- **Large PDFs**: Consider chunking for files > 5MB
- **Concurrent users**: Monitor API rate limits
- **Caching**: Implement translation memory for common phrases

## 📈 Future Enhancements

- [ ] Batch processing for multiple PDFs
- [ ] Translation memory and caching
- [ ] Custom formatting templates
- [ ] Preview mode with side-by-side comparison
- [ ] Export options (DOCX, TXT)
- [ ] Mobile-responsive improvements
- [ ] Advanced font support for Punjabi

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ for seamless English-Punjabi PDF translation**
