// src/services/fileParser.js - Updated to use Python parsing service
import mammoth from 'mammoth';
import cacheService from './cacheService';

class FileParser {
  constructor() {
    // Configure Python parser service URL; '' means same-origin (behind proxy)
    const base = (process.env.REACT_APP_PARSER_URL || '').replace(/\/$/, '');
    this.pythonParserUrl = base; // '' or 'http://host:port'
  }
  
  async parseFile(file) {
    console.log('FileParser: Starting file parsing for:', file.name);
    
    // Check cache first
    const cacheKey = await cacheService.generateCacheKey(file);
    const cachedResult = cacheService.get(cacheKey);
    
    if (cachedResult) {
      console.log('FileParser: Using cached result for:', file.name);
      return cachedResult;
    }
    
    const fileType = this.getFileType(file);
    
    try {
      let result;
      switch (fileType) {
        case 'powerpoint':
          result = await this.parsePowerPointWithPython(file);
          break;
        case 'word':
          result = await this.parseWord(file);
          break;
        case 'text':
          result = await this.parseText(file);
          break;
        case 'pdf':
          result = await this.parsePDF(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${file.type}`);
      }
      
      // Cache the successful result
      cacheService.set(cacheKey, result);
      return result;
      
    } catch (error) {
      console.error(`Error parsing ${fileType} file:`, error);
      return this.createInformedFallback(file, error);
    }
  }

  getFileType(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    if (extension === 'ppt' || extension === 'pptx' || mimeType.includes('presentation')) {
      return 'powerpoint';
    } else if (extension === 'doc' || extension === 'docx' || mimeType.includes('document')) {
      return 'word';
    } else if (extension === 'txt' || mimeType.includes('text')) {
      return 'text';
    } else if (extension === 'pdf' || mimeType.includes('pdf')) {
      return 'pdf';
    }
    
    return 'unknown';
  }

  async parsePowerPointWithPython(file) {
    console.log('Parsing PowerPoint with Python service:', file.name);
    
    try {
      // First check if Python service is available
      const healthCheck = await fetch(`${this.pythonParserUrl}/health`.replace(/^\//, '/'));
      if (!healthCheck.ok) {
        throw new Error('Python parsing service unavailable');
      }

      // Send file to Python service
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.pythonParserUrl}/parse-pptx`.replace(/^\//, '/'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Python parser error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      // Validate we got actual content (not XML garbage)
      if (!result.text_content || result.text_content.length < 50) {
        throw new Error('Python parser returned insufficient content');
      }

      console.log('✅ Python parsing successful. Content preview:', result.text_content.substring(0, 200));
      
      return {
        slideCount: result.slide_count,
        textContent: result.text_content,
        slides: result.slides, // Detailed slide breakdown
        metadata: {
          ...result.metadata,
          parseMethod: 'Python python-pptx service'
        }
      };
      
    } catch (error) {
      console.warn('Python parsing failed:', error.message);
      
      // Fallback with helpful message
      throw new Error(`PowerPoint parsing failed. \n\nPython service error: ${error.message}\n\nPlease either:\n1. Start the Python parsing service (python simple_ppt_parser.py)\n2. Convert your PowerPoint to PDF format\n3. Export as plain text from PowerPoint\n\nThis ensures you get accurate analysis of your content instead of technical XML metadata.`);
    }
  }

  async parseWord(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const textContent = result.value;
      
      return {
        slideCount: null,
        textContent: textContent,
        metadata: {
          colors: this.extractColors(textContent),
          fonts: this.extractFonts(textContent),
          hasImages: this.detectImages(textContent),
          bulletPointCount: this.countBulletPoints(textContent),
          parseMethod: 'Mammoth (Word)'
        }
      };
    } catch (error) {
      throw new Error(`Word document parsing failed: ${error.message}`);
    }
  }

  async parseText(file) {
    try {
      const textContent = await file.text();
      
      return {
        slideCount: null,
        textContent: textContent,
        metadata: {
          colors: [],
          fonts: [],
          hasImages: false,
          bulletPointCount: this.countBulletPoints(textContent),
          parseMethod: 'Direct text'
        }
      };
    } catch (error) {
      throw new Error(`Text file parsing failed: ${error.message}`);
    }
  }

  async parsePDF(file) {
    throw new Error('PDF parsing not implemented. Please convert to text or use PowerPoint format.');
  }

  createInformedFallback(file, error) {
    return {
      slideCount: null,
      textContent: `File parsing failed for ${file.name}. \n\nError: ${error.message}\n\nFor PowerPoint files (.ppt/.pptx):\n1. Start Python parsing service: python simple_ppt_parser.py\n2. Or convert to PDF format\n3. Or export as plain text\n\nThis ensures you get your actual presentation content instead of XML metadata.`,
      metadata: {
        colors: [],
        fonts: [],
        hasImages: false,
        bulletPointCount: 0,
        parseMethod: 'Failed - service needed',
        fileName: file.name,
        fileSize: Math.round(file.size / 1024) + 'KB',
        originalError: error.message
      }
    };
  }

  // Helper methods
  extractColors(text) {
    const colorRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
    return [...new Set((text || '').match(colorRegex) || [])];
  }

  extractFonts(text) {
    const fontNames = ['Arial', 'Helvetica', 'Times', 'Calibri', 'Verdana', 'Georgia', 'Tahoma'];
    const found = fontNames.filter(font => 
      (text || '').toLowerCase().includes(font.toLowerCase())
    );
    return found.length > 0 ? found : [];
  }

  detectImages(text) {
    const imageKeywords = ['image', 'picture', 'photo', 'graphic', 'chart', 'diagram'];
    return imageKeywords.some(keyword => 
      (text || '').toLowerCase().includes(keyword)
    );
  }

  countBulletPoints(text) {
    const bulletRegex = /[•·▪▫◦‣⁃]/g;
    const dashRegex = /^\s*[-*]\s/gm;
    
    const bullets = ((text || '').match(bulletRegex) || []).length;
    const dashes = ((text || '').match(dashRegex) || []).length;
    
    return bullets + dashes;
  }
}

export default FileParser;