import React from 'react';
import { FileText, Download, Copy, AlertCircle } from 'lucide-react';

const FileConversionGuide = ({ fileName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold">PowerPoint File Detected</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          We can't reliably extract content from <strong>{fileName}</strong> in the browser. 
          For accurate analysis, please convert your file first:
        </p>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-red-500" />
              <span className="font-medium">Convert to PDF (Recommended)</span>
            </div>
            <ol className="text-sm text-gray-600 space-y-1 ml-6">
              <li>1. Open your PowerPoint file</li>
              <li>2. Go to <strong>File → Export → PDF</strong></li>
              <li>3. Save and upload the PDF here</li>
            </ol>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Copy className="w-4 h-4 text-blue-500" />
              <span className="font-medium">Copy as Text</span>
            </div>
            <ol className="text-sm text-gray-600 space-y-1 ml-6">
              <li>1. Open your PowerPoint file</li>
              <li>2. Select all content (Ctrl+A)</li>
              <li>3. Copy (Ctrl+C) and paste into a .txt file</li>
              <li>4. Upload the .txt file here</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileConversionGuide;