// src/components/SlideAnalysis.jsx
import React, { useState, useEffect } from 'react';
import { 
  Layers, ChevronLeft, ChevronRight, Brain, RefreshCw, 
  CheckCircle, Circle, Image, Loader2 
} from 'lucide-react';

const SlideAnalysis = ({ 
  analysis, 
  apiKey, 
  uploadedFileName 
}) => {
  const [slidesData, setSlidesData] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideAnalyses, setSlideAnalyses] = useState({});
  const [analyzing, setAnalyzing] = useState(false);

  // Initialize slides data when analysis changes
  useEffect(() => {
    console.log('SlideAnalysis: analysis received:', analysis);
    if (analysis?.slides) {
      console.log('SlideAnalysis: slides found:', analysis.slides);
      setSlidesData(analysis.slides);
      setCurrentSlideIndex(0);
      setSlideAnalyses({});
    } else {
      console.log('SlideAnalysis: no slides found in analysis');
      setSlidesData([]);
      setCurrentSlideIndex(0);
      setSlideAnalyses({});
    }
  }, [analysis]);

  const selectSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  const previousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const nextSlide = () => {
    if (currentSlideIndex < slidesData.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const analyzeCurrentSlide = async () => {
    if (!slidesData.length || !apiKey) {
      console.warn('Cannot analyze slide: missing slides data or API key');
      return;
    }

    const slide = slidesData[currentSlideIndex];
    console.log('Analyzing slide:', slide);
    setAnalyzing(true);

    try {
      const requestBody = {
        api_key: apiKey,
        slide_data: slide,
        presentation_context: analysis,
        audience_info: getAudienceInfo(),
        slide_number: slide.slide_number || currentSlideIndex + 1
      };

      console.log('Sending slide analysis request:', requestBody);

      const API_BASE =
        process.env.REACT_APP_API_BASE_URL ||
        (typeof window !== 'undefined' && window?.location?.origin?.includes('localhost')
          ? 'http://localhost:5000'
          : '');

      const response = await fetch(`${API_BASE}/analyze-slide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Slide analysis response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Slide analysis error response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Slide analysis failed`);
      }

      const slideAnalysis = await response.json();
      console.log('Slide analysis result:', slideAnalysis);

      // Check if the analysis has an error field (from our fallback)
      if (slideAnalysis.error) {
        console.warn('Slide analysis returned with error:', slideAnalysis.error);
      }

      setSlideAnalyses(prev => ({
        ...prev,
        [currentSlideIndex]: slideAnalysis
      }));

    } catch (error) {
      console.error('Slide analysis error:', error);
      
      // Create a fallback analysis for display
      const fallbackAnalysis = {
        slideOverview: {
          slideNumber: currentSlideIndex + 1,
          contentSummary: "Analysis failed",
          slidePurpose: "Unable to determine",
          effectiveness: "unknown",
          priority: "unknown"
        },
        contentAnalysis: {
          textContent: {
            clarity: "Unable to analyze",
            organization: "Unable to analyze",
            length: "unknown",
            keyMessages: ["Analysis failed"],
            improvements: ["Please try again or check your API key"]
          },
          visualElements: {
            images: {
              count: slide?.images || 0,
              relevance: "Unable to analyze",
              quality: "unknown",
              recommendations: ["Please try again"]
            },
            charts: {
              count: slide?.charts || 0,
              effectiveness: "Unable to analyze",
              clarity: "Unable to analyze",
              improvements: ["Please try again"]
            },
            tables: {
              count: slide?.tables || 0,
              readability: "Unable to analyze",
              structure: "Unable to analyze",
              improvements: ["Please try again"]
            }
          }
        },
        designRecommendations: {
          layout: {
            currentLayout: slide?.layout_type || "unknown",
            effectiveness: "Unable to analyze",
            recommendedLayout: "Unable to determine",
            specificChanges: ["Please try analyzing this slide again"],
            visualHierarchy: "Unable to analyze"
          },
          colorScheme: {
            currentColors: slide?.colors || [],
            effectiveness: "Unable to analyze",
            recommendedPalette: ["Unable to analyze"],
            colorPsychology: "Unable to analyze",
            accessibility: "Unable to analyze"
          },
          typography: {
            currentFonts: slide?.fonts || [],
            readability: "Unable to analyze",
            recommendedFonts: ["Unable to analyze"],
            sizing: "Unable to analyze",
            hierarchy: "Unable to analyze"
          }
        },
        actionItems: {
          immediate: ["Check your OpenAI API key"],
          shortTerm: ["Try analyzing this slide again"],
          longTerm: ["Contact support if issue persists"]
        },
        error: error.message
      };

      setSlideAnalyses(prev => ({
        ...prev,
        [currentSlideIndex]: fallbackAnalysis
      }));
    } finally {
      setAnalyzing(false);
    }
  };

  const getAudienceInfo = () => {
    // This should come from the analysis data or be passed as a prop
    // For now, return empty object since we don't have access to the original audience data
    return {};
  };

  const getAnalyzedCount = () => {
    return Object.keys(slideAnalyses).length;
  };

  const getTotalCount = () => {
    return slidesData.length;
  };

  if (!analysis?.slides || slidesData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Slides Available</h3>
        <p className="text-gray-600 mb-6">Upload a presentation first to analyze individual slides</p>
        {analysis && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Debug Info:</strong> Analysis object received but no slides found. 
              Analysis keys: {Object.keys(analysis || {}).join(', ')}
            </p>
          </div>
        )}
      </div>
    );
  }

  const currentSlide = slidesData[currentSlideIndex];
  const currentAnalysis = slideAnalyses[currentSlideIndex];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Slide-by-Slide Analysis</h2>
        <p className="text-lg text-gray-600">
          Analyze each slide individually for detailed design recommendations
        </p>
      </div>

      {/* Slides Overview */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Presentation Slides</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Progress:</span>
            <span className="text-sm font-medium text-blue-600">
              {getAnalyzedCount()}/{getTotalCount()} analyzed
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slidesData.map((slide, index) => (
            <div
              key={index}
              onClick={() => selectSlide(index)}
              className={`slide-card cursor-pointer bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 ${
                index === currentSlideIndex ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">
                  Slide {slide.slide_number}
                </span>
                <div className="flex items-center gap-1">
                  {slideAnalyses[index] ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </div>
              
              {/* Slide Content Preview */}
              <div className="mb-3">
                {slide.thumbnail_url ? (
                  <img
                    src={slide.thumbnail_url}
                    alt={`Slide ${slide.slide_number}`}
                    className="w-full h-24 object-cover rounded border border-gray-200 mb-2"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {slide.text_content 
                      ? slide.text_content.substring(0, 80) + (slide.text_content.length > 80 ? '...' : '')
                      : 'No text content'
                    }
                  </div>
                )}
                
                {/* Layout Type */}
                <div className="mb-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {slide.layout_type}
                  </span>
                </div>
              </div>
              
              {/* Slide Elements */}
              <div className="flex flex-wrap gap-1">
                {slide.images > 0 && (
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    📷 {slide.images}
                  </span>
                )}
                {slide.charts > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                    📊 {slide.charts}
                  </span>
                )}
                {slide.tables > 0 && (
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                    📋 {slide.tables}
                  </span>
                )}
                {slide.text_boxes > 0 && (
                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                    📝 {slide.text_boxes}
                  </span>
                )}
              </div>
              
              {/* Analysis Status */}
              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{slide.shapes_count} shapes</span>
                  {slideAnalyses[index] && (
                    <span className="text-green-600 font-medium">✓ Analyzed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Slide Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slide Preview */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Slide Preview</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={previousSlide}
                disabled={currentSlideIndex === 0}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-600">
                Slide {currentSlide.slide_number}
              </span>
              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === slidesData.length - 1}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4 min-h-64">
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              {/* Slide Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900">Slide {currentSlide.slide_number}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">{currentSlide.layout_type}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{currentSlide.shapes_count} shapes</span>
                </div>
              </div>
              
              {/* Slide Content Preview */}
              <div className="space-y-3">
                {/* Visual Slide Thumbnail */}
                {currentSlide.thumbnail_url ? (
                  <img
                    src={currentSlide.thumbnail_url}
                    alt={`Slide ${currentSlide.slide_number}`}
                    className="w-full rounded-lg border border-blue-200 shadow-sm"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="aspect-video bg-white rounded shadow-sm flex items-center justify-center relative">
                      {currentSlide.text_content ? (
                        <div className="p-4 w-full h-full flex flex-col justify-center">
                          <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                              Slide {currentSlide.slide_number}
                            </h3>
                            <div className="text-sm text-gray-600 max-h-24 overflow-hidden">
                              {currentSlide.text_content.split('\n').slice(0, 3).map((line, index) => (
                                <p key={index} className={line.trim() ? 'mb-1' : 'mb-2'}>
                                  {line.trim() || '\u00A0'}
                                </p>
                              ))}
                              {currentSlide.text_content.split('\n').length > 3 && (
                                <p className="text-gray-400 text-xs">...</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400">
                          <Image className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">No content</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {currentSlide.text_content ? (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">Full Content</h5>
                    <div className="text-sm text-gray-600 bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                      {currentSlide.text_content.split('\n').map((line, index) => (
                        <p key={index} className={line.trim() ? 'mb-1' : 'mb-2'}>
                          {line.trim() || '\u00A0'}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
                
                {/* Slide Elements */}
                <div className="flex flex-wrap gap-2">
                  {currentSlide.images > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      📷 {currentSlide.images} image{currentSlide.images !== 1 ? 's' : ''}
                    </span>
                  )}
                  {currentSlide.charts > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      📊 {currentSlide.charts} chart{currentSlide.charts !== 1 ? 's' : ''}
                    </span>
                  )}
                  {currentSlide.tables > 0 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      📋 {currentSlide.tables} table{currentSlide.tables !== 1 ? 's' : ''}
                    </span>
                  )}
                  {currentSlide.text_boxes > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                      📝 {currentSlide.text_boxes} text box{currentSlide.text_boxes !== 1 ? 'es' : ''}
                    </span>
                  )}
                </div>
                
                {/* Speaker Notes */}
                {currentSlide.notes && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <h5 className="text-sm font-medium text-yellow-800 mb-1">Speaker Notes</h5>
                    <p className="text-xs text-yellow-700">{currentSlide.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Slide Content</h4>
            <div className="text-sm text-gray-600 bg-gray-50 rounded p-3">
              <div className="space-y-2">
                <div>
                  <strong>Text Content:</strong>
                  <p className="mt-1">{currentSlide.text_content || 'No text content'}</p>
                </div>
                {currentSlide.notes && (
                  <div>
                    <strong>Speaker Notes:</strong>
                    <p className="mt-1">{currentSlide.notes}</p>
                  </div>
                )}
                <div className="flex gap-4 text-xs">
                  <span><strong>Layout:</strong> {currentSlide.layout_type}</span>
                  <span><strong>Shapes:</strong> {currentSlide.shapes_count}</span>
                  <span><strong>Text Boxes:</strong> {currentSlide.text_boxes}</span>
                  {currentSlide.images > 0 && (
                    <span><strong>Images:</strong> {currentSlide.images}</span>
                  )}
                  {currentSlide.charts > 0 && (
                    <span><strong>Charts:</strong> {currentSlide.charts}</span>
                  )}
                  {currentSlide.tables > 0 && (
                    <span><strong>Tables:</strong> {currentSlide.tables}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
            <button
              onClick={analyzeCurrentSlide}
              disabled={analyzing || !apiKey}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                currentAnalysis
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {analyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentAnalysis ? (
                <RefreshCw className="w-4 h-4" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
              {analyzing ? 'Analyzing...' : currentAnalysis ? 'Re-analyze Slide' : 'Analyze Slide'}
            </button>
          </div>
          
          <div className="space-y-4">
            {analyzing ? (
              <div className="text-center text-gray-500">
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p>Analyzing slide...</p>
              </div>
            ) : currentAnalysis ? (
              <SlideAnalysisResults analysis={currentAnalysis} />
            ) : (
              <div className="text-center text-gray-500">
                <Layers className="w-8 h-8 mx-auto mb-2" />
                <p>Click "Analyze Slide" to get detailed recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SlideAnalysisResults = ({ analysis }) => {
  return (
    <>
      {/* Slide Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">Slide Overview</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Effectiveness:</span>
            <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
              analysis.slideOverview?.effectiveness === 'high' ? 'bg-green-100 text-green-800' :
              analysis.slideOverview?.effectiveness === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {analysis.slideOverview?.effectiveness || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Priority:</span>
            <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
              analysis.slideOverview?.priority === 'critical' ? 'bg-red-100 text-red-800' :
              analysis.slideOverview?.priority === 'important' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {analysis.slideOverview?.priority || 'N/A'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {analysis.slideOverview?.contentSummary || 'N/A'}
        </p>
      </div>

      {/* Content Analysis */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Content Analysis</h4>
        
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h5 className="font-medium text-gray-700 mb-2">Text Content</h5>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Clarity:</span>
              <span className="ml-1">{analysis.contentAnalysis?.textContent?.clarity || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Organization:</span>
              <span className="ml-1">{analysis.contentAnalysis?.textContent?.organization || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Length:</span>
              <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                analysis.contentAnalysis?.textContent?.length === 'appropriate' ? 'bg-green-100 text-green-800' :
                analysis.contentAnalysis?.textContent?.length === 'too long' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {analysis.contentAnalysis?.textContent?.length || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h5 className="font-medium text-gray-700 mb-2">Visual Elements</h5>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Images:</span>
              <span className="ml-1">
                {analysis.contentAnalysis?.visualElements?.images?.count || 0} 
                ({analysis.contentAnalysis?.visualElements?.images?.relevance || 'N/A'})
              </span>
            </div>
            <div>
              <span className="text-gray-500">Charts:</span>
              <span className="ml-1">
                {analysis.contentAnalysis?.visualElements?.charts?.count || 0} 
                ({analysis.contentAnalysis?.visualElements?.charts?.effectiveness || 'N/A'})
              </span>
            </div>
            <div>
              <span className="text-gray-500">Tables:</span>
              <span className="ml-1">
                {analysis.contentAnalysis?.visualElements?.tables?.count || 0} 
                ({analysis.contentAnalysis?.visualElements?.tables?.readability || 'N/A'})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Design Recommendations */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Design Recommendations</h4>
        
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h5 className="font-medium text-gray-700 mb-2">Layout</h5>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Current:</span>
              <span className="ml-1">{analysis.designRecommendations?.layout?.currentLayout || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Recommended:</span>
              <span className="ml-1 font-medium">
                {analysis.designRecommendations?.layout?.recommendedLayout || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <h5 className="font-medium text-gray-700 mb-2">Typography</h5>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-500">Readability:</span>
              <span className="ml-1">{analysis.designRecommendations?.typography?.readability || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Recommended Fonts:</span>
              <span className="ml-1">
                {analysis.designRecommendations?.typography?.recommendedFonts?.join(', ') || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Wins & Priority Fixes */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Action Items</h4>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h5 className="font-medium text-green-800 mb-2">Quick Wins</h5>
          <ul className="text-sm text-green-700 space-y-1">
            {(analysis.quickWins || []).map((win, index) => (
              <li key={index}>• {win}</li>
            ))}
          </ul>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h5 className="font-medium text-red-800 mb-2">Priority Fixes</h5>
          <ul className="text-sm text-red-700 space-y-1">
            {(analysis.priorityFixes || []).map((fix, index) => (
              <li key={index}>• {fix}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SlideAnalysis; 