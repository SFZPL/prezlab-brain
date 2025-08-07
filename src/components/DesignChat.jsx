// src/components/DesignChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, Loader2, Lightbulb, RefreshCw, 
  Compass, User, Bot, Sparkles, HelpCircle 
} from 'lucide-react';

const DesignChat = ({ 
  chatService, 
  presentationAnalysis, 
  uploadedFileName,
  knowledgeStats 
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [showTips, setShowTips] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize suggested questions
  useEffect(() => {
    if (chatService) {
      const suggestions = chatService.suggestQuestions(presentationAnalysis);
      setSuggestedQuestions(suggestions);
    }
  }, [chatService, presentationAnalysis]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (messageText = null) => {
    const message = messageText || inputMessage.trim();
    if (!message || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setShowTips(false);

    try {
      const response = await chatService.sendMessage(
        message, 
        presentationAnalysis, 
        messages
      );

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    setShowTips(true);
    setSuggestedQuestions(chatService?.suggestQuestions(presentationAnalysis) || []);
  };

  // Message bubble component
  const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.isError;

    return (
      <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-500' : isError ? 'bg-red-500' : 'bg-gray-600'
        }`}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </div>
        
        <div className={`max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`inline-block px-4 py-2 rounded-lg ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : isError 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-gray-100 text-gray-800'
          }`}>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  // Welcome message
  const WelcomeMessage = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Assistant Ready</h3>
      <p className="text-gray-600 mb-4">
        Ask me anything about your presentation design. I have access to your Design Compass framework
        {knowledgeStats?.totalDocuments > 0 && ` and ${knowledgeStats.totalDocuments} company documents`}.
      </p>
      
      {presentationAnalysis && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Current Analysis Context</span>
          </div>
          <p className="text-sm text-blue-800">
            {presentationAnalysis.presentationType?.primary} • {uploadedFileName}
          </p>
        </div>
      )}
    </div>
  );

  // Suggested questions component
  const SuggestedQuestions = () => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        <span className="text-sm font-medium text-gray-700">Suggested Questions</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestedQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleSendMessage(question)}
            className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-sm text-gray-700 transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );

  // Quick tips component
  const QuickTips = () => {
    if (!presentationAnalysis || !chatService) return null;
    
    const tips = chatService.getQuickTips(presentationAnalysis.presentationType?.primary);
    
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Quick Tips</span>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-purple-800">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Design Assistant</h3>
          {knowledgeStats?.hasFramework && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Framework Active
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSuggestedQuestions(chatService?.suggestQuestions(presentationAnalysis) || [])}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            title="Refresh suggestions"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            title="Clear chat"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div>
            <WelcomeMessage />
            {showTips && (
              <div>
                <SuggestedQuestions />
                <QuickTips />
              </div>
            )}
          </div>
        ) : (
          <div>
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about colors, fonts, layouts, or any design decision..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '100px' }}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {messages.length === 0 && suggestedQuestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                {question.length > 40 ? question.substring(0, 37) + '...' : question}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignChat;