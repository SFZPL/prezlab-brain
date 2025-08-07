// src/components/KnowledgeBase.jsx
import React, { useRef, useState } from 'react';
import { Plus, X, Upload, Loader2 } from 'lucide-react';

const KnowledgeBase = ({ 
  companyDocs, 
  onAddDocuments, 
  onRemoveDocument,
  knowledgeStats
}) => {
  const companyDocsInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      await onAddDocuments(files);
    } catch (error) {
      console.error('Error uploading company documents:', error);
    } finally {
      setUploading(false);
      // Clear the input
      if (companyDocsInputRef.current) {
        companyDocsInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const name = fileName.toLowerCase();
    
    // Special icon for Design Compass framework
    if (name.includes('design compass') || name.includes('presentation compass')) {
      return '🧭';
    }
    
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'txt':
        return '📄';
      default:
        return '📄';
    }
  };

  const getDocumentTypeLabel = (doc) => {
    if (doc.isFramework) return 'Framework';
    if (doc.type === 'brand') return 'Brand';
    if (doc.type === 'template') return 'Template';
    if (doc.type === 'guideline') return 'Guideline';
    return 'Document';
  };

  const getDocumentTypeBadge = (doc) => {
    if (doc.isFramework) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    switch (doc.type) {
      case 'brand': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'template': return 'bg-green-100 text-green-800 border-green-200';
      case 'guideline': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Company Design Knowledge</h2>
        <p className="text-lg text-gray-600 mb-8">
          Upload your company's design guidelines, brand documents, and style guides to improve analysis accuracy
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Design Documents</h3>
              <p className="text-sm text-gray-500 mt-1">
                {companyDocs.length} document{companyDocs.length !== 1 ? 's' : ''} uploaded
                {knowledgeStats?.hasFramework && ' • Design Compass Framework Active'}
              </p>
            </div>
            <button
              onClick={() => companyDocsInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Documents
                </>
              )}
            </button>
          </div>

          <input
            ref={companyDocsInputRef}
            type="file"
            multiple
            accept=".txt,.pdf,.doc,.docx,.ppt,.pptx"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="space-y-3">
            {companyDocs.length === 0 && !uploading ? (
              <div className="text-center py-12">
                <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-500 mb-2">No documents uploaded yet</h4>
                <p className="text-gray-400 mb-6">
                  Add your design guidelines, brand manuals, and style guides to help the AI provide more accurate, company-specific recommendations.
                </p>
                <button
                  onClick={() => companyDocsInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                  Upload First Document
                </button>
              </div>
            ) : (
              <>
                {companyDocs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-2xl">{getFileIcon(doc.name)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate">{doc.name}</span>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getDocumentTypeBadge(doc)}`}>
                            {getDocumentTypeLabel(doc)}
                          </span>
                          {doc.size && (
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                              {formatFileSize(doc.size)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          Added {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'recently'}
                          {doc.isFramework && ' • Will be used for all design guidance'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveDocument(doc.id)}
                      className="flex-shrink-0 ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove document"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {uploading && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                    <span className="text-sm text-blue-700">Processing documents...</span>
                  </div>
                )}
                
                {knowledgeStats?.hasFramework && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🧭</span>
                      <h4 className="text-sm font-medium text-blue-800">Design Compass Framework Loaded</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your presentation framework is active and will guide all AI recommendations and chat responses.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {companyDocs.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">💡 How this improves your design process:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Strategic Analysis:</strong> AI considers your brand colors, fonts, and style preferences</li>
                <li>• <strong>Framework-Guided:</strong> Recommendations align with Design Compass methodology</li>
                <li>• <strong>Smart Chat:</strong> Design Assistant references your guidelines in conversations</li>
                <li>• <strong>Context-Aware:</strong> Analysis considers your existing design language and standards</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;