// src/services/openaiService.js - Updated to use Chat Completions API

class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1';
  }

  async analyzeDesign(content, companyContext = '', audienceData = null) {
    const prompt = this.createDesignCompassPrompt(content, companyContext, audienceData);
    
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert presentation design consultant specializing in the Design Compass methodology. You analyze presentations and provide strategic design recommendations in JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      
      // Parse JSON response
      try {
        const analysis = JSON.parse(responseText);
        return analysis;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', responseText);
        throw new Error('Invalid response format from analysis service');
      }

    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      throw error;
    }
  }

  createDesignCompassPrompt(content, companyContext = '', audienceData = null) {
    let audienceSection = '';
    if (audienceData) {
      audienceSection = `
AUDIENCE INFORMATION:
- Type: ${audienceData.type}
- Goal: ${audienceData.goal}
- Size: ${audienceData.size}
- Context: ${audienceData.context || 'None provided'}
- Retainer Client: ${audienceData.retainerClient || 'None'}
`;
    }

    return `You are a senior presentation design consultant. Analyze this presentation using "The Presentation Design Compass" methodology and provide strategic design recommendations.

${audienceSection}

PRESENTATION CONTENT:
${JSON.stringify(content, null, 2)}

COMPANY CONTEXT:
${companyContext || 'No specific company context provided'}

INSTRUCTIONS:
Use "The Presentation Design Compass" framework to analyze this presentation. Consider:
1. Context Understanding - Why does this presentation exist?
2. Ambition Setting - What should it achieve?
3. Design Direction - What visual approach fits best?
4. Storytelling Structure - How should content flow?
5. Execution Guidance - What specific actions to take?

Provide your analysis in this exact JSON structure:

{
  "presentationType": {
    "primary": "Executive & Strategic | Sales & Influence | Engagement & Immersion | Informative & Educational",
    "secondary": "Optional secondary type",
    "confidence": "high | medium | low",
    "reasoning": "Explanation of type classification"
  },
  "contextualGrounding": {
    "identifiedObjective": "What this presentation aims to achieve",
    "audienceProfile": "Who the audience is and their needs",
    "urgencyLevel": "high | medium | low",
    "stakeholderAlignment": "Assessment of stakeholder buy-in needed"
  },
  "strategicDirection": {
    "primaryStrategy": "Main strategic approach for the presentation",
    "communicationGoal": "Core message to convey",
    "successMetrics": "How success will be measured",
    "riskFactors": ["potential challenges or risks"]
  },
  "designDirection": {
    "colors": {
      "primary": ["#hexcode1", "#hexcode2"],
      "secondary": ["#hexcode3", "#hexcode4"],
      "paletteApproach": "Description of color strategy",
      "colorPsychology": "Why these colors work for this presentation"
    },
    "fonts": {
      "headings": "Recommended heading font",
      "body": "Recommended body font",
      "reasoning": "Why these fonts work"
    },
    "layouts": {
      "recommended": "Layout style recommendation",
      "reasoning": "Why this layout approach works"
    },
    "imagery": {
      "recommended": "Image style recommendation",
      "reasoning": "Why this imagery approach works"
    },
    "backgrounds": {
      "recommended": "Background style recommendation",
      "reasoning": "Why this background approach works"
    }
  },
  "storytellingStructure": {
    "narrativeApproach": "Recommended storytelling method",
    "emotionalTone": "Appropriate emotional approach",
    "keyMessages": ["message 1", "message 2", "message 3"],
    "flowRecommendations": ["flow suggestion 1", "flow suggestion 2"]
  },
  "contentStrategy": {
    "keyPoints": ["point 1", "point 2", "point 3"],
    "callToAction": "Recommended call to action",
    "supportingEvidence": "What evidence/data to include"
  },
  "executionGuidance": {
    "priorityFixes": ["fix 1", "fix 2", "fix 3"],
    "quickWins": ["quick win 1", "quick win 2", "quick win 3"],
    "designPrinciples": ["principle 1", "principle 2", "principle 3"],
    "slideTemplateNeeds": ["template need 1", "template need 2"]
  },
  "clientQuestions": {
    "clarifyingQuestions": ["question 1", "question 2", "question 3"],
    "stakeholderQuestions": ["question 1", "question 2", "question 3"],
    "visualReadinessQuestions": ["question 1", "question 2", "question 3"]
  }
}

Respond ONLY with the JSON structure. No additional text or explanation outside the JSON.`;
  }
}

export default OpenAIService;