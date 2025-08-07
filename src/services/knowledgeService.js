// src/services/knowledgeService.js
class KnowledgeService {
    constructor() {
      this.knowledgeBase = this.loadKnowledgeBase();
    }
  
    // Load knowledge from memory (in production, use a proper database)
    loadKnowledgeBase() {
      return {
        documents: [],
        designFramework: null,
        lastUpdated: null
      };
    }
  
    // Save knowledge to memory (in production, use a proper database)
    saveKnowledgeBase() {
      this.knowledgeBase.lastUpdated = new Date().toISOString();
      // In production, this would save to a database
      // For now, data persists only during the session
    }
  
    // Add a document to the knowledge base
    addDocument(document) {
      const knowledgeDoc = {
        id: Date.now() + Math.random(),
        name: document.name,
        content: document.content,
        type: document.type || 'general',
        keywords: this.extractKeywords(document.content),
        uploadDate: new Date().toISOString(),
        size: document.size || 0
      };
  
      // Check if this is the Design Compass framework
      if (document.name.toLowerCase().includes('design compass') || 
          document.name.toLowerCase().includes('presentation compass')) {
        this.knowledgeBase.designFramework = knowledgeDoc;
      } else {
        this.knowledgeBase.documents.push(knowledgeDoc);
      }
  
      this.saveKnowledgeBase();
      return knowledgeDoc;
    }
  
    // Remove a document
    removeDocument(id) {
      this.knowledgeBase.documents = this.knowledgeBase.documents.filter(doc => doc.id !== id);
      if (this.knowledgeBase.designFramework && this.knowledgeBase.designFramework.id === id) {
        this.knowledgeBase.designFramework = null;
      }
      this.saveKnowledgeBase();
    }
  
    // Extract keywords for better search
    extractKeywords(content) {
      const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
      
      const words = content.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !commonWords.includes(word));
      
      // Get unique words and their frequency
      const wordCount = {};
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
      
      // Return top keywords
      return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([word]) => word);
    }
  
    // Search for relevant documents based on query
    searchRelevantDocuments(query, limit = 5) {
      const queryKeywords = this.extractKeywords(query);
      const allDocs = [...this.knowledgeBase.documents];
      
      if (this.knowledgeBase.designFramework) {
        allDocs.push(this.knowledgeBase.designFramework);
      }
  
      // Score documents based on keyword relevance
      const scoredDocs = allDocs.map(doc => {
        let score = 0;
        
        // Check for direct keyword matches
        queryKeywords.forEach(keyword => {
          if (doc.keywords.includes(keyword)) score += 2;
          if (doc.content.toLowerCase().includes(keyword)) score += 1;
          if (doc.name.toLowerCase().includes(keyword)) score += 3;
        });
  
        // Boost Design Compass framework for all design questions
        if (doc === this.knowledgeBase.designFramework) {
          score += 5;
        }
  
        return { ...doc, relevanceScore: score };
      });
  
      return scoredDocs
        .filter(doc => doc.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    }
  
    // Get all documents
    getAllDocuments() {
      const allDocs = [...this.knowledgeBase.documents];
      if (this.knowledgeBase.designFramework) {
        allDocs.push({...this.knowledgeBase.designFramework, isFramework: true});
      }
      return allDocs;
    }
  
    // Build context for chat
    buildChatContext(query, presentationAnalysis = null, chatHistory = []) {
      const relevantDocs = this.searchRelevantDocuments(query);
      
      let context = '';
      
      // Always include Design Compass framework if available
      if (this.knowledgeBase.designFramework) {
        context += `DESIGN FRAMEWORK (Design Compass):\n${this.knowledgeBase.designFramework.content.substring(0, 2000)}\n\n`;
      }
  
      // Add relevant company documents
      if (relevantDocs.length > 0) {
        context += 'RELEVANT COMPANY DOCUMENTS:\n';
        relevantDocs.forEach(doc => {
          context += `${doc.name}:\n${doc.content.substring(0, 1000)}\n\n`;
        });
      }
  
      // Add presentation analysis if available
      if (presentationAnalysis) {
        context += 'CURRENT PRESENTATION ANALYSIS:\n';
        context += `Presentation Type: ${presentationAnalysis.presentationType?.primary || 'Unknown'}\n`;
        context += `Key Insights: ${JSON.stringify(presentationAnalysis, null, 2).substring(0, 1500)}\n\n`;
      }
  
      // Add recent chat history for context
      if (chatHistory.length > 0) {
        context += 'RECENT CONVERSATION:\n';
        chatHistory.slice(-6).forEach(msg => {
          context += `${msg.role === 'user' ? 'Designer' : 'AI'}: ${msg.content}\n`;
        });
        context += '\n';
      }
  
      return context;
    }
  
    // Get knowledge base stats
    getStats() {
      return {
        totalDocuments: this.knowledgeBase.documents.length + (this.knowledgeBase.designFramework ? 1 : 0),
        hasFramework: !!this.knowledgeBase.designFramework,
        lastUpdated: this.knowledgeBase.lastUpdated,
        documents: this.knowledgeBase.documents.length,
        frameworkName: this.knowledgeBase.designFramework?.name || null
      };
    }
  }
  
  export default KnowledgeService;