// src/components/FileUpload.jsx
import React, { useRef, useState } from 'react';
import { Upload, Loader2, AlertCircle, Play, CheckCircle } from 'lucide-react';

const FileUpload = ({ 
  onFileUpload, 
  loading, 
  error, 
  uploadedFile,
  apiKey 
}) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAudienceForm, setShowAudienceForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [audienceData, setAudienceData] = useState({
    type: '',
    goal: '',
    size: '',
    context: '',
    retainerClient: ''
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowAudienceForm(true);
      setUploadProgress(0);
    }
  };

  const handleAudienceDataChange = (field, value) => {
    setAudienceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStartAnalysis = () => {
    if (selectedFile && audienceData.type && audienceData.goal && audienceData.size) {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      onFileUpload(selectedFile, audienceData);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setShowAudienceForm(false);
    setUploadProgress(0);
    setAudienceData({
      type: '',
      goal: '',
      size: '',
      context: '',
      retainerClient: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const ErrorAlert = ({ message }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-red-800">Upload Error</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ progress, stage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  const FilePreview = ({ file }) => (
    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
      <CheckCircle className="w-6 h-6 text-green-600" />
      <div className="flex-1">
        <p className="font-medium text-green-800">{file.name}</p>
        <p className="text-sm text-green-600">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Presentation</h2>
        <p className="text-lg text-gray-600 mb-8">
          Upload PowerPoint files, Word documents, or PDFs to get AI-powered design insights
        </p>
      </div>

      {error && <ErrorAlert message={error} />}

      {!apiKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">API Key Required</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Please enter your OpenAI API key in the header to enable analysis.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {loading && (
          <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <h3 className="font-semibold text-blue-800">Analyzing Your Presentation</h3>
            </div>
            <ProgressBar progress={uploadProgress} />
            <p className="text-sm text-blue-700">
              {uploadProgress < 30 && "Parsing file content..."}
              {uploadProgress >= 30 && uploadProgress < 60 && "Extracting design elements..."}
              {uploadProgress >= 60 && uploadProgress < 90 && "Generating AI analysis..."}
              {uploadProgress >= 90 && "Finalizing results..."}
            </p>
          </div>
        )}

        {selectedFile && !loading && (
          <div className="mb-6">
            <FilePreview file={selectedFile} />
          </div>
        )}

        <div
          onClick={() => !showAudienceForm && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer
            ${loading ? 'border-blue-300 bg-blue-50' : selectedFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}
            ${!apiKey ? 'opacity-50 cursor-not-allowed' : ''}
            ${showAudienceForm ? 'cursor-default' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".ppt,.pptx,.doc,.docx,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
            disabled={!apiKey || loading}
          />
          
          {loading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Processing...</h3>
                <p className="text-gray-600">Please wait while we analyze your presentation</p>
              </div>
            </div>
          ) : selectedFile ? (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">File Selected</h3>
                <p className="text-gray-600">{selectedFile.name}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Drop your file here</h3>
                <p className="text-gray-600">or click to browse</p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports PPT, PPTX, DOC, DOCX, PDF, TXT
                </p>
              </div>
            </div>
          )}
        </div>

        {showAudienceForm && selectedFile && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Information</h3>
            <p className="text-sm text-gray-600 mb-6">
              Help us provide more targeted design recommendations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audience Type *
                </label>
                <select
                  value={audienceData.type}
                  onChange={(e) => handleAudienceDataChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select audience type</option>
                  <option value="executive">Executive/Leadership</option>
                  <option value="client">Client/Stakeholder</option>
                  <option value="team">Internal Team</option>
                  <option value="public">Public/Conference</option>
                  <option value="educational">Educational/Training</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Presentation Goal *
                </label>
                <select
                  value={audienceData.goal}
                  onChange={(e) => handleAudienceDataChange('goal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select goal</option>
                  <option value="inform">Inform/Educate</option>
                  <option value="persuade">Persuade/Convince</option>
                  <option value="inspire">Inspire/Motivate</option>
                  <option value="align">Align/Coordinate</option>
                  <option value="sell">Sell/Pitch</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audience Size *
                </label>
                <select
                  value={audienceData.size}
                  onChange={(e) => handleAudienceDataChange('size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select size</option>
                  <option value="small">Small (1-10 people)</option>
                  <option value="medium">Medium (11-50 people)</option>
                  <option value="large">Large (50+ people)</option>
                  <option value="virtual">Virtual/Online</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retainer Client (Optional)
                </label>
                <input
                  type="text"
                  value={audienceData.retainerClient}
                  onChange={(e) => handleAudienceDataChange('retainerClient', e.target.value)}
                  placeholder="Client name if applicable"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context
              </label>
              <textarea
                value={audienceData.context}
                onChange={(e) => handleAudienceDataChange('context', e.target.value)}
                placeholder="Any additional context about your audience or presentation goals..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleStartAnalysis}
                disabled={!audienceData.type || !audienceData.goal || !audienceData.size || loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Start Analysis
                  </div>
                )}
              </button>
              
              <button
                onClick={resetUpload}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;