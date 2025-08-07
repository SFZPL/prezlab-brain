// src/components/DesignAnalysisTool.jsx - Updated with Enhanced UI
import React, { useState, useEffect } from 'react';
import { Upload, FileText, Brain, Settings, MessageSquare, Layers, Sparkles, Shield, Maximize2, Minimize2, Database, CheckCircle } from 'lucide-react';

// Import our components
import FileUpload from './FileUpload';
import KnowledgeBase from './KnowledgeBase';
import AnalysisResults from './AnalysisResults';
import DesignChat from './DesignChat';
import SlideAnalysis from './SlideAnalysis';

// Import services
import OpenAIService from '../services/openaiService';
import FileParser from '../services/fileParser';
import ExportService from '../services/exportService';
import KnowledgeService from '../services/knowledgeService';
import ChatService from '../services/chatService';

const DesignAnalysisTool = () => {
  // State management
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(process.env.REACT_APP_OPENAI_API_KEY || '');
  console.log('API Key from env:', process.env.REACT_APP_OPENAI_API_KEY ? 'Found' : 'Not found');
  const [activeTab, setActiveTab] = useState('upload');
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [progressValue, setProgressValue] = useState(0);

  // Initialize services
  const [knowledgeService] = useState(() => new KnowledgeService());
  const [knowledgeStats, setKnowledgeStats] = useState(knowledgeService.getStats());
  const [chatService, setChatService] = useState(null);
  const fileParser = new FileParser();
  const exportService = new ExportService();

  // Initialize chat service when API key is available
  useEffect(() => {
    if (apiKey && knowledgeService) {
      setChatService(new ChatService(apiKey, knowledgeService));
    } else {
      setChatService(null);
    }
  }, [apiKey, knowledgeService]);

  // Update knowledge stats when knowledge base changes
  useEffect(() => {
    setKnowledgeStats(knowledgeService.getStats());
  }, [knowledgeService]);

  // Enhanced error handling with better user feedback
  const handleFileUpload = async (file, audienceData) => {
    setUploadedFile(file);
    setLoading(true);
    setAnalysis(null);
    setError(null);
    setProcessingStage('Initializing analysis...');
    setProgressValue(10);
  
    try {
      if (!apiKey) {
        throw new Error('Please enter your OpenAI API key in the header');
      }
  
      // Parse the uploaded file
      setProcessingStage('Parsing file content...');
      setProgressValue(30);
      console.log('Parsing file:', file.name);
      const content = await fileParser.parseFile(file);
      console.log('Parsed file content:', content);
      
      // Create company context from knowledge base
      setProcessingStage('Preparing analysis context...');
      setProgressValue(50);
      const allDocs = knowledgeService.getAllDocuments();
      const companyContext = allDocs
        .map(doc => `${doc.name}: ${doc.content}`)
        .join('\n\n');
      
      // Initialize OpenAI service and analyze
      setProcessingStage('Analyzing with AI...');
      setProgressValue(70);
      console.log('Analyzing with OpenAI...');
      const openaiService = new OpenAIService(apiKey);
      const designAnalysis = await openaiService.analyzeDesign(content, companyContext, audienceData);
      
      // Add slides data to analysis if available
      if (content.slides) {
        designAnalysis.slides = content.slides;
        console.log('✅ Added slides data to analysis:', content.slides.length, 'slides');
      } else {
        console.log('⚠️ No slides data found in parsed content');
      }
      
      setProcessingStage('Finalizing results...');
      setProgressValue(90);
      console.log('Final analysis object:', designAnalysis);
      setAnalysis(designAnalysis);
      setActiveTab('results');
      setProgressValue(100);
      
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setProcessingStage('');
      setProgressValue(0);
    }
  };

  // Handle adding company documents to knowledge base
  const handleAddCompanyDocuments = async (files) => {
    for (const file of files) {
      try {
        const content = await fileParser.parseFile(file);
        const document = {
          name: file.name,
          content: content.textContent,
          size: file.size,
          type: determineDocumentType(file.name)
        };
        
        knowledgeService.addDocument(document);
      } catch (error) {
        console.error('Error parsing company document:', error);
        // Add file anyway with basic info
        const document = {
          name: file.name,
          content: `Document: ${file.name} (${Math.round(file.size / 1024)}KB) - Could not parse content`,
          size: file.size,
          type: 'general'
        };
        
        knowledgeService.addDocument(document);
      }
    }
    
    // Update stats after adding documents
    setKnowledgeStats(knowledgeService.getStats());
  };

  // Determine document type for better organization
  const determineDocumentType = (fileName) => {
    const name = fileName.toLowerCase();
    if (name.includes('design compass') || name.includes('presentation compass')) {
      return 'framework';
    } else if (name.includes('brand') || name.includes('style')) {
      return 'brand';
    } else if (name.includes('template')) {
      return 'template';
    } else if (name.includes('guideline')) {
      return 'guideline';
    }
    return 'general';
  };

  // Handle removing company document
  const handleRemoveCompanyDocument = (id) => {
    knowledgeService.removeDocument(id);
    setKnowledgeStats(knowledgeService.getStats());
  };

  // Export handlers
  const handleExportPDF = () => {
    if (analysis) {
      const fileName = `design-compass-brief-${uploadedFile?.name || 'report'}.pdf`;
      exportService.exportAnalysisToPDF(analysis, fileName);
    }
  };

  const handleExportJSON = () => {
    if (analysis) {
      const fileName = `design-compass-analysis-${uploadedFile?.name || 'report'}.json`;
      exportService.exportAnalysisToJSON(analysis, fileName);
    }
  };

  const handleExportClientQuestions = () => {
    if (analysis) {
      const fileName = `client-questions-${uploadedFile?.name || 'project'}.txt`;
      exportService.exportClientQuestions(analysis, fileName);
    }
  };

  const handleExportDesignBrief = () => {
    if (analysis) {
      const fileName = `design-brief-${uploadedFile?.name || 'project'}.txt`;
      exportService.exportDesignBrief(analysis, fileName);
    }
  };

  // Enhanced navigation tabs with better visual design
  const tabs = [
    { 
      id: 'upload', 
      label: 'Upload', 
      icon: Upload, 
      color: 'blue',
      description: 'Upload your presentation'
    },
    { 
      id: 'results', 
      label: 'Analysis', 
      icon: Brain, 
      color: 'purple',
      description: 'View comprehensive analysis'
    },
    { 
      id: 'slides', 
      label: 'Slide Analysis', 
      icon: Layers, 
      color: 'green',
      description: 'Slide-by-slide breakdown'
    },
    { 
      id: 'chat', 
      label: 'Design Assistant', 
      icon: MessageSquare, 
      color: 'orange',
      description: 'AI-powered design guidance'
    },
    { 
      id: 'knowledge', 
      label: 'Knowledge Base', 
      icon: FileText, 
      color: 'indigo',
      description: 'Manage company documents'
    }
  ];

  // Enhanced TabButton component with animations
  const TabButton = ({ tab, isActive, onClick }) => {
    const Icon = tab.icon;
    const baseClasses = "flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105";
    const activeClasses = "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25";
    const inactiveClasses = "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300";

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
        <div className="flex flex-col items-start">
          <span className="font-semibold">{tab.label}</span>
          <span className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
            {tab.description}
          </span>
        </div>
        {tab.id === 'knowledge' && knowledgeStats?.totalDocuments > 0 && (
          <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
            {knowledgeStats.totalDocuments}
          </span>
        )}
        {tab.id === 'results' && analysis && (
          <span className="ml-auto bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-semibold">
            ✓
          </span>
        )}
        {tab.id === 'chat' && !apiKey && (
          <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
            !
          </span>
        )}
        {tab.id === 'slides' && analysis?.slides && (
          <span className="ml-auto bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-semibold">
            {analysis.slides.length}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Enhanced Header with better visual hierarchy */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Design Analyzer
                </h1>
                <p className="text-sm text-gray-500 font-medium mt-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Powered by OpenAI GPT-4 • Design Compass Framework
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* Enhanced status indicators */}
              {knowledgeStats?.hasFramework && (
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-4 py-2 rounded-full font-semibold border border-blue-200">
                  <Shield className="w-4 h-4" />
                  Framework Active
                </div>
              )}
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <div className="relative">
                  <input
                    type="password"
                    placeholder="OpenAI API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-64"
                  />
                  {!apiKey && (
                    <span className="absolute -bottom-6 left-0 text-xs text-red-500 font-semibold">
                      API key required
                    </span>
                  )}
                </div>
              </div>
              {apiKey && (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Connected</span>
                </div>
              )}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-3 py-4 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Upload Tab with enhanced loading states */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {loading && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <Brain className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {processingStage || 'Processing your presentation...'}
                    </h3>
                    <p className="text-gray-600">This may take a few moments</p>
                  </div>
                  {progressValue > 0 && (
                    <div className="w-full max-w-md mx-auto">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressValue}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{progressValue}% complete</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <FileUpload
              onFileUpload={handleFileUpload}
              loading={loading}
              error={error}
              uploadedFile={uploadedFile}
              apiKey={apiKey}
            />
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <KnowledgeBase
            companyDocs={knowledgeService.getAllDocuments()}
            onAddDocuments={handleAddCompanyDocuments}
            onRemoveDocument={handleRemoveCompanyDocument}
            knowledgeStats={knowledgeStats}
          />
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <AnalysisResults
            analysis={analysis}
            onExportPDF={handleExportPDF}
            onExportJSON={handleExportJSON}
            onExportClientQuestions={handleExportClientQuestions}
            onExportDesignBrief={handleExportDesignBrief}
            uploadedFileName={uploadedFile?.name}
          />
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Design Assistant</h2>
              <p className="text-lg text-gray-600">
                Ask specific questions about your presentation design decisions
              </p>
            </div>

            {!apiKey ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
                <MessageSquare className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-yellow-900 mb-2">API Key Required</h3>
                <p className="text-yellow-800">
                  Please enter your OpenAI API key in the header to start chatting with the design assistant.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg">
                <DesignChat
                  chatService={chatService}
                  presentationAnalysis={analysis}
                  uploadedFileName={uploadedFile?.name}
                  knowledgeStats={knowledgeStats}
                />
              </div>
            )}
          </div>
        )}

        {/* Slides Tab */}
        {activeTab === 'slides' && (
          <>
            {console.log('DesignAnalysisTool: Passing analysis to SlideAnalysis:', analysis)}
            <SlideAnalysis
              analysis={analysis}
              apiKey={apiKey}
              uploadedFileName={uploadedFile?.name}
            />
          </>
        )}
      </div>

      {/* Enhanced Status Bar */}
      {(loading || uploadedFile || knowledgeStats?.totalDocuments > 0) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg p-4 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-4 text-gray-700 font-medium">
              {uploadedFile && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">{uploadedFile.name}</span>
                  <span className="text-gray-400">({Math.round(uploadedFile.size / 1024)} KB)</span>
                </div>
              )}
              {knowledgeStats?.totalDocuments > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{knowledgeStats.totalDocuments}</span>
                  <span className="text-blue-600">document{knowledgeStats.totalDocuments !== 1 ? 's' : ''}</span>
                  {knowledgeStats.hasFramework && (
                    <span className="ml-2 text-blue-600 font-semibold">Framework Active</span>
                  )}
                </div>
              )}
              {analysis && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-700 font-semibold">Analysis complete</span>
                </div>
              )}
              {chatService && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-semibold">Assistant ready</span>
                </div>
              )}
            </div>
            {loading && (
              <div className="flex items-center gap-3 text-blue-600 font-semibold">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>{processingStage || 'Processing...'}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DesignAnalysisTool;