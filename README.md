# AI Design Analyzer

A powerful AI-powered presentation design analysis tool that uses OpenAI GPT-4 and the Design Compass Framework to provide comprehensive design recommendations for PowerPoint presentations.

## 🚀 Features

### **Core Functionality**
- **PowerPoint Parsing**: Advanced parsing of `.ppt` and `.pptx` files with detailed slide analysis
- **AI-Powered Analysis**: Comprehensive design analysis using OpenAI GPT-4
- **Slide-by-Slide Analysis**: Individual slide recommendations with specific improvements
- **Design Compass Framework**: Strategic design methodology implementation
- **Audience Customization**: Tailored recommendations based on audience type and goals

### **Analysis Components**
- **Presentation Type Classification**: Executive & Strategic, Sales & Influence, Engagement & Immersion, Informative & Educational
- **Strategic Direction**: Communication goals, audience engagement, call-to-action
- **Design Direction**: Color palettes, typography, layouts, imagery recommendations
- **Storytelling Structure**: Narrative approaches, emotional tone, flow recommendations
- **Execution Guidance**: Priority fixes, quick wins, design principles

### **UI/UX Features**
- **Modern React Interface**: Clean, responsive design with intuitive navigation
- **Real-time Processing**: Progress indicators and status feedback
- **Enhanced Slide Preview**: Visual slide thumbnails with content analysis
- **Interactive Chat**: AI-powered design assistant for questions and guidance
- **Export Capabilities**: PDF, JSON, and client question exports

## 🛠️ Technology Stack

### **Frontend**
- **React**: Modern UI components and state management
- **Tailwind CSS**: Utility-first styling for responsive design
- **Lucide React**: Beautiful, customizable icons
- **Axios**: HTTP client for API communication

### **Backend**
- **Flask**: Python web framework for API endpoints
- **python-pptx**: Advanced PowerPoint parsing with design element extraction
- **OpenAI GPT-4**: AI-powered analysis and recommendations
- **CORS**: Cross-origin resource sharing support

### **File Support**
- **PowerPoint**: `.ppt`, `.pptx` (enhanced parsing with color/font analysis)
- **Word Documents**: `.doc`, `.docx` (using mammoth)
- **PDF Files**: `.pdf` (using PyPDF2)
- **Text Files**: `.txt` (direct text processing)

## 📋 Prerequisites

- **Python 3.8+**: For backend Flask application
- **Node.js 14+**: For React frontend
- **OpenAI API Key**: Required for AI analysis features
- **Git**: For version control

## 🚀 Installation

### **1. Clone the Repository**
   ```bash
   git clone <repository-url>
   cd ai-design-analyzer
   ```

### **2. Backend Setup**
   ```bash
# Create Python virtual environment
   python -m venv venv
   
# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
   source venv/bin/activate

# Install Python dependencies
   pip install -r requirements.txt
   ```

### **3. Frontend Setup**
   ```bash
# Install Node.js dependencies
npm install
```

### **4. Environment Configuration**
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here
```

## 🏃‍♂️ Running the Application

### **1. Start the Flask Backend**
   ```bash
# Activate virtual environment (if not already activated)
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Start Flask server
   python app.py
   ```
The backend will run on `http://localhost:5000`

### **2. Start the React Frontend**
```bash
# In a new terminal window
npm start
```
The frontend will run on `http://localhost:3000`

### **3. Access the Application**
Open your browser and navigate to `http://localhost:3000`

## 📖 Usage Guide

### **1. Upload Presentation**
- Navigate to the "Upload" tab
- Select your PowerPoint file (`.ppt` or `.pptx`)
- Fill in the audience information form:
  - **Audience Type**: Executive/Leadership, Sales/Client, etc.
  - **Presentation Goal**: Inform/Educate, Persuade/Sell, etc.
  - **Audience Size**: Small (1-10), Medium (11-50), Large (50+)
  - **Additional Context**: Any relevant information about your audience

### **2. View Analysis Results**
- **Analysis Tab**: Comprehensive design analysis with strategic recommendations
- **Slide Analysis Tab**: Individual slide-by-slide analysis with specific improvements
- **Design Assistant Tab**: Interactive chat with AI for design questions
- **Knowledge Base Tab**: Upload company documents for context-aware recommendations

### **3. Export Results**
- **PDF Export**: Download analysis as a formatted report
- **JSON Export**: Raw analysis data for further processing
- **Client Questions**: Export questions for client discussions

## 🎯 Key Features Explained

### **Enhanced PowerPoint Parsing**
- **Text Extraction**: Multiple methods for reliable text extraction from shapes
- **Design Elements**: Color analysis, font detection, layout identification
- **Slide Metadata**: Speaker notes, shape counts, image/chart detection
- **Error Handling**: Robust parsing with fallback mechanisms for complex files

### **AI Analysis Framework**
- **Design Compass Methodology**: 5-stage framework from strategy to execution
- **Presentation Classification**: Automatic categorization based on content analysis
- **Strategic Recommendations**: Audience-specific design direction
- **Actionable Insights**: Specific, implementable design improvements

### **Slide-by-Slide Analysis**
- **Individual Slide Assessment**: Detailed analysis of each slide
- **Visual Hierarchy**: Layout and content organization recommendations
- **Design Elements**: Color, typography, and spacing suggestions
- **Storytelling Flow**: Narrative connection between slides

## 🔧 Configuration

### **File Size Limits**
- **Maximum Upload Size**: 600MB (configurable in `app.py`)
- **Supported Formats**: PowerPoint, Word, PDF, Text files
- **Processing Timeout**: Optimized for large presentations

### **AI Analysis Settings**
- **Model**: OpenAI GPT-4 for comprehensive analysis
- **Temperature**: 0.7 for balanced creativity and consistency
- **Max Tokens**: 3000 for detailed analysis responses

## 🐛 Troubleshooting

### **Common Issues**

**1. PowerPoint Parsing Errors**
- **Issue**: "RGBColor._format_" errors
- **Solution**: Enhanced error handling now skips problematic color data
- **Workaround**: File is still processed with available content

**2. Large File Uploads**
- **Issue**: "413 Request Entity Too Large"
- **Solution**: Increased file size limit to 600MB
- **Note**: Processing time may be longer for very large files

**3. Backend Connection Issues**
- **Issue**: "Failed to fetch" errors
- **Solution**: Ensure Flask backend is running on port 5000
- **Check**: Verify virtual environment is activated

**4. OpenAI API Errors**
- **Issue**: Analysis failures
- **Solution**: Verify API key is valid and has sufficient credits
- **Check**: Ensure `.env` file contains correct API key

### **Debug Information**
- **Console Logs**: Detailed parsing and analysis logs
- **Error Messages**: Specific error descriptions for troubleshooting
- **Progress Indicators**: Real-time status updates during processing

## 📁 Project Structure

```
ai-design-analyzer/
├── app.py                 # Flask backend application
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
├── public/              # Static assets
├── src/                 # React frontend source
│   ├── components/      # React components
│   ├── services/        # API services
│   └── utils/          # Utility functions
├── uploads/            # Temporary file storage
└── venv/              # Python virtual environment
```

## 🔄 Recent Updates

### **v2.0 - Enhanced Features**
- ✅ **Improved PowerPoint Parsing**: Better text extraction and design element detection
- ✅ **Enhanced Error Handling**: Robust parsing for complex PowerPoint files
- ✅ **Slide-by-Slide Analysis**: Individual slide recommendations
- ✅ **Modern UI/UX**: Improved interface with progress indicators
- ✅ **Large File Support**: Increased upload limits to 600MB
- ✅ **Color Analysis**: Advanced color extraction with theme support
- ✅ **Export Features**: Multiple export formats for analysis results

### **v1.0 - Core Features**
- ✅ **Basic PowerPoint Parsing**: Text extraction from slides
- ✅ **AI Analysis**: OpenAI GPT-4 integration
- ✅ **React Frontend**: Modern web interface
- ✅ **Design Compass Framework**: Strategic design methodology

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For providing the GPT-4 API for intelligent analysis
- **python-pptx**: For robust PowerPoint parsing capabilities
- **React Community**: For the excellent frontend framework
- **Design Compass Framework**: For the strategic design methodology

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for better presentation design**
