// src/services/chatService.js
class ChatService {
    constructor(apiKey, knowledgeService) {
      this.apiKey = apiKey;
      this.knowledgeService = knowledgeService;
      this.baseURL = 'https://api.openai.com/v1';
    }
  
    async sendMessage(message, presentationAnalysis = null, chatHistory = []) {
      try {
        // Build comprehensive context
        const context = this.knowledgeService.buildChatContext(message, presentationAnalysis, chatHistory);
        
        // Create the system message with context
        const systemMessage = this.createSystemMessage(context);
        
        // Prepare conversation history
        const messages = [
          systemMessage,
          ...chatHistory.slice(-10), // Keep last 10 messages for context
          { role: 'user', content: this.decorateUserMessage(message, context) }
        ];
  
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
            stream: false
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }
  
        const data = await response.json();
        return {
          content: data.choices[0].message.content,
          usage: data.usage,
          timestamp: new Date().toISOString()
        };
  
      } catch (error) {
        console.error('Chat Service Error:', error);
        throw new Error(`Chat failed: ${error.message}`);
      }
    }
  
    createSystemMessage(context) {
      return {
        role: 'system',
        content: `You are a senior presentation design consultant and expert in "The Presentation Design Compass" methodology. You help designers make strategic design decisions for client presentations.
  
  CONTEXT PROVIDED:
  ${context}
  
  INSTRUCTIONS:
  - Answer design questions with specific, actionable advice
  - Always consider the presentation type and Design Compass framework
  - Reference company guidelines and design documents when relevant
  - For specific slide questions (like "should I use navy blue on slide 3?"), consider the overall presentation strategy
  - Give reasoning based on design principles, psychology, and the specific presentation context
  - Keep responses conversational but professional
  - If you need more information to give a good answer, ask clarifying questions
  - Always tie recommendations back to the presentation objectives and audience
  
  DESIGN COMPASS METHODOLOGY TO FOLLOW:
  1. Context Understanding - Consider why this presentation exists
  2. Ambition Setting - Align with presentation goals
  3. Design Decisions - Make strategic visual choices
  4. Storytelling - Support the narrative flow
  5. Work Justification - Provide clear reasoning
  
  Remember: Every design decision should serve the presentation's strategic purpose, not just look good.`
      };
    }

    // If user asks comparative questions like "which slide needs the most work?",
    // direct the model to use the SLIDE QUALITY SUMMARY embedded in the context.
    decorateUserMessage(message, context) {
      const lower = (message || '').toLowerCase();
      const comparative = [
        'which slide needs the most work',
        'worst slide',
        'needs the most improvement',
        'biggest issue slide',
        'top slides to fix'
      ].some(k => lower.includes(k));

      if (!comparative) return message;

      // Hint the model to consult the precomputed summary and respond succinctly
      return `${message}\n\nNote: Use the SLIDE QUALITY SUMMARY in the context to answer with a ranked list (top 3) and specific reasons drawn from the summary and analysis. Provide slide numbers and concrete next actions.`;
    }
  
    // Suggest relevant questions based on current analysis
    suggestQuestions(presentationAnalysis) {
      if (!presentationAnalysis) {
        return [
          "What presentation type should I focus on for this content?",
          "How can I better understand my audience?",
          "What design direction would work best?",
          "What questions should I ask my client?"
        ];
      }
  
      const type = presentationAnalysis.presentationType?.primary;
      const suggestions = [];
  
      // Type-specific suggestions
      switch (type) {
        case 'Executive & Strategic':
          suggestions.push(
            "Should I use more charts or text for executive audiences?",
            "How formal should my color palette be?",
            "What font size works best for boardroom presentations?"
          );
          break;
        case 'Sales & Influence':
          suggestions.push(
            "How can I make my value proposition more visually compelling?",
            "Should I use dark or light backgrounds for impact?",
            "What imagery style would be most persuasive?"
          );
          break;
        case 'Engagement & Immersion':
          suggestions.push(
            "How can I make this presentation more emotionally engaging?",
            "What visual metaphors would work for my story?",
            "Should I use more imagery or illustration?"
          );
          break;
        case 'Informative & Educational':
          suggestions.push(
            "How can I make complex information easier to understand?",
            "What's the best way to structure my content flow?",
            "Should I use more diagrams or bullet points?"
          );
          break;
        default:
          suggestions.push(
            "How can I improve the visual hierarchy in my slides?",
            "What's the best way to handle bullet points?",
            "How do I know if my design matches the presentation objective?"
          );
          break;
      }
  
      // General suggestions based on analysis
      if (presentationAnalysis.executionGuidance?.priorityFixes?.length > 0) {
        suggestions.push(
          `How should I address: ${presentationAnalysis.executionGuidance.priorityFixes[0]}?`
        );
      }
  
      if (presentationAnalysis.designDirection?.colors?.primary?.length > 0) {
        suggestions.push(
          `Should I use ${presentationAnalysis.designDirection.colors.primary[0]} as my primary color?`
        );
      }
  
      // Add some general design questions
      suggestions.push(
        "How can I improve the visual hierarchy in my slides?",
        "What's the best way to handle bullet points?",
        "How do I know if my design matches the presentation objective?"
      );
  
      return suggestions.slice(0, 6); // Return top 6 suggestions
    }
  
    // Quick design tips based on presentation type
    getQuickTips(presentationType) {
      const tips = {
        'Executive & Strategic': [
          "Keep layouts clean and structured",
          "Use navy, gray, or professional colors",
          "Lead with key insights, not details",
          "Ensure all text is readable from distance"
        ],
        'Sales & Influence': [
          "Use bold, contrasting colors",
          "Lead with benefits, not features",
          "Include compelling visuals and stories",
          "Create clear calls-to-action"
        ],
        'Engagement & Immersion': [
          "Use full-screen imagery and visuals",
          "Incorporate brand colors and energy",
          "Tell stories with visual metaphors",
          "Keep text minimal, visuals maximum"
        ],
        'Informative & Educational': [
          "Use consistent layouts and structures",
          "Break complex info into digestible chunks",
          "Use diagrams and charts effectively",
          "Ensure clear information hierarchy"
        ]
      };
  
      return tips[presentationType] || tips['Executive & Strategic'];
    }
  }
  
  export default ChatService;