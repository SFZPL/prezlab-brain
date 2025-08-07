// src/services/exportService.js - Updated with Design Compass Framework
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

class ExportService {
  
  exportAnalysisToPDF(analysis, fileName = 'design-compass-brief.pdf') {
    const pdf = new jsPDF();
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredSpace) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Helper function to add text with word wrapping
    const addWrappedText = (text, x, maxWidth, fontSize = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      
      checkPageBreak(lines.length * lineHeight);
      
      lines.forEach(line => {
        pdf.text(line, x, yPosition);
        yPosition += lineHeight;
      });
    };

    // Helper function to add section header
    const addSectionHeader = (title, icon = '') => {
      checkPageBreak(15);
      pdf.setFontSize(16);
      pdf.setFont(undefined, 'bold');
      pdf.text(`${icon} ${title}`, margin, yPosition);
      yPosition += 12;
    };

    // Title Page
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('Design Compass Brief', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(14);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 20;

    // Presentation Type Classification
    addSectionHeader('Presentation Classification', '🎯');
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Primary Type: ${analysis.presentationType.primary}`, margin, yPosition);
    yPosition += 7;
    
    if (analysis.presentationType.secondary) {
      pdf.text(`Secondary Type: ${analysis.presentationType.secondary}`, margin, yPosition);
      yPosition += 7;
    }
    
    pdf.setFont(undefined, 'normal');
    addWrappedText(`Reasoning: ${analysis.presentationType.reasoning}`, margin, 170);
    yPosition += 10;

    // Design Compass Stage
    addSectionHeader('Design Compass Stage', '🧭');
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Current Stage: ${analysis.designCompassStage.currentStage}`, margin, yPosition);
    yPosition += 10;

    pdf.setFont(undefined, 'bold');
    pdf.text('Next Steps:', margin, yPosition);
    yPosition += 7;
    
    pdf.setFont(undefined, 'normal');
    analysis.designCompassStage.nextSteps.forEach(step => {
      addWrappedText(`• ${step}`, margin + 5, 165);
    });
    yPosition += 5;

    addWrappedText(`Stage Guidance: ${analysis.designCompassStage.stageGuidance}`, margin, 170);
    yPosition += 15;

    // Priority Actions
    addSectionHeader('Priority Actions', '⚠️');
    
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text('Top Priority Fixes:', margin, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    analysis.executionGuidance.priorityFixes.forEach((fix, index) => {
      addWrappedText(`${index + 1}. ${fix}`, margin + 5, 165);
    });
    yPosition += 5;

    pdf.setFont(undefined, 'bold');
    pdf.text('Quick Wins:', margin, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    analysis.executionGuidance.quickWins.forEach(win => {
      addWrappedText(`• ${win}`, margin + 5, 165);
    });
    yPosition += 15;

    // Contextual Grounding
    addSectionHeader('Contextual Grounding', '🎯');
    
    const contextItems = [
      { label: 'Objective', value: analysis.contextualGrounding.identifiedObjective },
      { label: 'Audience Profile', value: analysis.contextualGrounding.audienceProfile },
      { label: 'Presentation Trigger', value: analysis.contextualGrounding.presentationTrigger },
      { label: 'Urgency Level', value: analysis.contextualGrounding.urgencyLevel },
    ];

    contextItems.forEach(item => {
      pdf.setFont(undefined, 'bold');
      pdf.text(`${item.label}:`, margin, yPosition);
      yPosition += 5;
      pdf.setFont(undefined, 'normal');
      addWrappedText(item.value, margin + 5, 165, 10);
      yPosition += 3;
    });

    if (analysis.contextualGrounding.politicalClimate) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Political Climate & Sensitivities:', margin, yPosition);
      yPosition += 5;
      pdf.setFont(undefined, 'normal');
      addWrappedText(analysis.contextualGrounding.politicalClimate, margin + 5, 165);
    }
    yPosition += 15;

    // Design Direction
    addSectionHeader('Design Direction', '🎨');
    
    const designItems = [
      { label: 'Background Approach', value: `${analysis.designDirection.backgrounds.recommended} - ${analysis.designDirection.backgrounds.reasoning}` },
      { label: 'Layout Strategy', value: `${analysis.designDirection.layouts.recommended} - ${analysis.designDirection.layouts.reasoning}` },
      { label: 'Imagery Style', value: `${analysis.designDirection.imagery.recommended} - ${analysis.designDirection.imagery.reasoning}` },
      { label: 'Headings Font', value: analysis.designDirection.fonts.headings },
      { label: 'Body Font', value: analysis.designDirection.fonts.body },
      { label: 'Color Palette Approach', value: `${analysis.designDirection.colors.paletteApproach} - ${analysis.designDirection.colors.reasoning}` }
    ];

    designItems.forEach(item => {
      pdf.setFont(undefined, 'bold');
      pdf.text(`${item.label}:`, margin, yPosition);
      yPosition += 5;
      pdf.setFont(undefined, 'normal');
      addWrappedText(item.value, margin + 5, 165, 10);
      yPosition += 8;
    });

    // Color Swatches
    pdf.setFont(undefined, 'bold');
    pdf.text('Primary Colors:', margin, yPosition);
    yPosition += 7;
    
    pdf.setFont(undefined, 'normal');
    analysis.designDirection.colors.primary.forEach(color => {
      pdf.text(`• ${color}`, margin + 10, yPosition);
      yPosition += 5;
    });
    yPosition += 3;

    pdf.setFont(undefined, 'bold');
    pdf.text('Secondary Colors:', margin, yPosition);
    yPosition += 7;
    
    pdf.setFont(undefined, 'normal');
    analysis.designDirection.colors.secondary.forEach(color => {
      pdf.text(`• ${color}`, margin + 10, yPosition);
      yPosition += 5;
    });
    yPosition += 15;

    // Visual Metaphors
    addSectionHeader('Visual Metaphors', '💡');
    
    addWrappedText(`Recommended Metaphors: ${analysis.designDirection.visualMetaphors.recommended}`, margin, 170, 11);
    addWrappedText(`Transformation Theme: ${analysis.designDirection.visualMetaphors.transformationTheme}`, margin, 170, 11);
    addWrappedText(`Reasoning: ${analysis.designDirection.visualMetaphors.reasoning}`, margin, 170);
    yPosition += 15;

    // Storytelling Structure
    addSectionHeader('Storytelling Structure', '📖');
    
    addWrappedText(`Narrative Approach: ${analysis.storytellingStructure.narrativeApproach}`, margin, 170, 11);
    addWrappedText(`Emotional Tone: ${analysis.storytellingStructure.emotionalTone}`, margin, 170, 11);
    yPosition += 5;

    pdf.setFont(undefined, 'bold');
    pdf.text('Key Messages:', margin, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    analysis.storytellingStructure.keyMessages.forEach(message => {
      addWrappedText(`• ${message}`, margin + 5, 165);
    });
    yPosition += 5;

    pdf.setFont(undefined, 'bold');
    pdf.text('Flow Recommendations:', margin, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    analysis.storytellingStructure.flowRecommendations.forEach(rec => {
      addWrappedText(`• ${rec}`, margin + 5, 165);
    });
    yPosition += 15;

    // Client Questions
    addSectionHeader('Questions for Client', '❓');
    
    const questionSections = [
      { title: 'Context & Ambitions Questions', questions: analysis.clientQuestions.clarifyingQuestions },
      { title: 'Stakeholder Questions', questions: analysis.clientQuestions.stakeholderQuestions },
      { title: 'Visual Readiness Questions', questions: analysis.clientQuestions.visualReadinessQuestions }
    ];

    questionSections.forEach(section => {
      pdf.setFont(undefined, 'bold');
      pdf.text(section.title + ':', margin, yPosition);
      yPosition += 7;

      pdf.setFont(undefined, 'normal');
      section.questions.forEach(question => {
        addWrappedText(`• ${question}`, margin + 5, 165);
      });
      yPosition += 8;
    });

    // Execution Guidance
    addSectionHeader('Execution Guidance', '⚡');
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Design Principles:', margin, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    analysis.executionGuidance.designPrinciples.forEach(principle => {
      addWrappedText(`• ${principle}`, margin + 5, 165);
    });
    yPosition += 8;

    pdf.setFont(undefined, 'bold');
    pdf.text('Slide Template Needs:', margin, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    analysis.executionGuidance.slideTemplateNeeds.forEach(need => {
      addWrappedText(`• ${need}`, margin + 5, 165);
    });

    // Footer
    checkPageBreak(20);
    yPosition = pageHeight - 30;
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'italic');
    pdf.text('Generated by AI Design Compass - Strategic Presentation Analysis', margin, yPosition);

    // Save the PDF
    pdf.save(fileName);
  }

  exportAnalysisToJSON(analysis, fileName = 'design-compass-analysis.json') {
    const exportData = {
      generatedAt: new Date().toISOString(),
      designCompassAnalysis: analysis,
      metadata: {
        version: '2.0',
        framework: 'Design Compass Methodology',
        stages: ['Context', 'Ambitions', 'Decisions', 'Story', 'Sell']
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    saveAs(blob, fileName);
  }

  exportClientQuestions(analysis, fileName = 'client-questions.txt') {
    let content = 'CLIENT DISCOVERY QUESTIONS\n';
    content += '=========================\n\n';
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `Presentation Type: ${analysis.presentationType.primary}\n\n`;

    content += 'CONTEXT & AMBITIONS QUESTIONS:\n';
    content += '------------------------------\n';
    analysis.clientQuestions.clarifyingQuestions.forEach(q => {
      content += `• ${q}\n`;
    });

    content += '\nSTAKEHOLDER QUESTIONS:\n';
    content += '----------------------\n';
    analysis.clientQuestions.stakeholderQuestions.forEach(q => {
      content += `• ${q}\n`;
    });

    content += '\nVISUAL READINESS QUESTIONS:\n';
    content += '---------------------------\n';
    analysis.clientQuestions.visualReadinessQuestions.forEach(q => {
      content += `• ${q}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, fileName);
  }

  exportDesignBrief(analysis, fileName = 'design-brief.txt') {
    let content = 'DESIGN BRIEF\n';
    content += '============\n\n';
    content += `Generated: ${new Date().toLocaleDateString()}\n`;
    content += `Presentation Type: ${analysis.presentationType.primary}\n`;
    content += `Current Stage: ${analysis.designCompassStage.currentStage}\n\n`;

    content += 'PRIORITY ACTIONS:\n';
    content += '-----------------\n';
    analysis.executionGuidance.priorityFixes.forEach((fix, idx) => {
      content += `${idx + 1}. ${fix}\n`;
    });

    content += '\nDESIGN DIRECTION:\n';
    content += '----------------\n';
    content += `Background: ${analysis.designDirection.backgrounds.recommended}\n`;
    content += `Layout: ${analysis.designDirection.layouts.recommended}\n`;
    content += `Imagery: ${analysis.designDirection.imagery.recommended}\n`;
    content += `Fonts: ${analysis.designDirection.fonts.headings} / ${analysis.designDirection.fonts.body}\n`;
    content += `Colors: ${analysis.designDirection.colors.primary.join(', ')}\n`;

    content += '\nKEY MESSAGES:\n';
    content += '-------------\n';
    analysis.storytellingStructure.keyMessages.forEach(msg => {
      content += `• ${msg}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    saveAs(blob, fileName);
  }
}

export default ExportService;