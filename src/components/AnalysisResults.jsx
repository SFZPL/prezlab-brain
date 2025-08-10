// src/components/AnalysisResults.jsx - Modern Enhanced Design
import React from 'react';
import { Download, CheckCircle, AlertCircle, TrendingUp, Palette, Type, Image, Layout, Brain, Sparkles, Zap, Target, Users, Clock, BarChart3, Lightbulb, Shield, Star, ArrowRight, ChevronRight, ChevronLeft, Maximize2, Minimize2, RefreshCw, Share2, BookOpen, Database, Cpu, Eye, FileText, MessageSquare, Layers, Settings, HelpCircle, Info, Award, Trophy, Heart, Target as TargetIcon, Users as UsersIcon, Palette as PaletteIcon, TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon, AlertCircle as AlertCircleIcon, Clock as ClockIcon, BarChart3 as BarChart3Icon, Lightbulb as LightbulbIcon, Shield as ShieldIcon, Star as StarIcon, ArrowRight as ArrowRightIcon, ChevronRight as ChevronRightIcon, ChevronLeft as ChevronLeftIcon, Maximize2 as Maximize2Icon, Minimize2 as Minimize2Icon, RefreshCw as RefreshCwIcon, Share2 as Share2Icon, BookOpen as BookOpenIcon, Database as DatabaseIcon, Cpu as CpuIcon, Eye as EyeIcon, FileText as FileTextIcon, MessageSquare as MessageSquareIcon, Layers as LayersIcon, Settings as SettingsIcon, HelpCircle as HelpCircleIcon, Info as InfoIcon, Award as AwardIcon, Trophy as TrophyIcon } from 'lucide-react';

const AnalysisResults = ({ analysis, onExportPDF, onExportJSON, onExportQuestions, onExportDesignBrief, uploadedFileName }) => {

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Brain className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Available</h3>
            <p className="text-gray-500">Upload a presentation to see comprehensive analysis results</p>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced StatCard component with better visual design
  const StatCard = ({ icon: Icon, title, value, color = 'blue', trend, subtitle }) => (
    <div className={`bg-gradient-to-br from-${color}-50 to-${color}-100 border border-${color}-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-${color}-100 rounded-xl`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold text-${color}-900`}>{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-${trend === 'up' ? 'green' : 'red'}-600 text-sm font-medium`}>
            <TrendingUpIcon className="w-4 h-4" />
            {trend === 'up' ? '↑' : '↓'}
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced SectionCard component with better visual hierarchy
  const SectionCard = ({ title, children, icon: Icon, color = 'blue', badge, collapsible = false, defaultExpanded = true }) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
    
    return (
      <div className={`bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden`}>
        <div 
          className={`flex items-center justify-between p-6 cursor-pointer ${collapsible ? 'hover:bg-gray-50' : ''}`}
          onClick={() => collapsible && setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-${color}-100 rounded-xl`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {badge && (
                <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium bg-${color}-100 text-${color}-700 rounded-full`}>
                  {badge}
                </span>
              )}
            </div>
          </div>
          {collapsible && (
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
          )}
        </div>
        {(!collapsible || isExpanded) && (
          <div className="px-6 pb-6">
            {children}
          </div>
        )}
      </div>
    );
  };

  // Enhanced ProgressBar component
  const ProgressBar = ({ value, max = 100, color = 'blue', label }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">{value}%</span>
      </div>
      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`bg-gradient-to-r from-${color}-500 to-${color}-600 h-3 rounded-full transition-all duration-500`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Enhanced MetricCard component for detailed metrics
  const MetricCard = ({ title, value, description, icon: Icon, color = 'blue' }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-5 h-5 text-${color}-600`} />
        <h4 className="font-medium text-gray-900">{title}</h4>
      </div>
      <p className={`text-2xl font-bold text-${color}-900 mb-1`}>{value}</p>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Export Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Design Analysis Results</h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Comprehensive analysis using Design Compass methodology
                </p>
              </div>
            </div>
            {uploadedFileName && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="w-4 h-4" />
                <span>Analyzed: {uploadedFileName}</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onExportPDF}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={onExportJSON}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={onExportDesignBrief}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              Design Brief
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={TrendingUpIcon} 
          title="Presentation Type" 
          value={analysis?.presentationType?.primary || 'Not specified'} 
          color="blue"
          subtitle="Primary classification"
        />
        <StatCard 
          icon={PaletteIcon} 
          title="Design Complexity" 
          value={analysis?.metadata?.design_complexity || 'Not specified'} 
          color="purple"
          subtitle="Visual sophistication"
        />
        <StatCard 
          icon={Layout} 
          title="Content Density" 
          value={analysis?.metadata?.content_density || 'Not specified'} 
          color="green"
          subtitle="Information load"
        />
        <StatCard 
          icon={Image} 
          title="Visual Elements" 
          value={`${analysis?.metadata?.total_images || 0} images, ${analysis?.metadata?.total_charts || 0} charts`} 
          color="orange"
          subtitle="Media count"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Enhanced Presentation Type */}
          <SectionCard title="Presentation Classification" icon={TrendingUpIcon} color="blue" badge="AI Analysis">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="Primary Type"
                  value={analysis?.presentationType?.primary || 'Not specified'}
                  icon={TargetIcon}
                  color="blue"
                />
                {analysis?.presentationType?.secondary && (
                  <MetricCard
                    title="Secondary Type"
                    value={analysis.presentationType.secondary}
                    icon={Layers}
                    color="purple"
                  />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Confidence Level</h4>
                <ProgressBar 
                  value={
                    analysis?.presentationType?.confidence === 'high' ? 90 :
                    analysis?.presentationType?.confidence === 'medium' ? 65 :
                    analysis?.presentationType?.confidence === 'low' ? 40 : 50
                  }
                  color={
                    analysis?.presentationType?.confidence === 'high' ? 'green' :
                    analysis?.presentationType?.confidence === 'medium' ? 'yellow' : 'red'
                  }
                  label="Analysis Confidence"
                />
              </div>
            </div>
          </SectionCard>

          {/* Enhanced Strategic Direction */}
          <SectionCard title="Strategic Direction" icon={TargetIcon} color="purple" badge="Core Strategy">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <MetricCard
                  title="Primary Strategy"
                  value={analysis?.strategicDirection?.primaryStrategy || 'Not specified'}
                  description="Main strategic approach"
                  icon={TargetIcon}
                  color="purple"
                />
                <MetricCard
                  title="Communication Goal"
                  value={analysis?.strategicDirection?.communicationGoal || 'Not specified'}
                  description="Primary communication objective"
                  icon={MessageSquareIcon}
                  color="blue"
                />
                <MetricCard
                  title="Call to Action"
                  value={analysis?.strategicDirection?.callToAction || 'Not specified'}
                  description="Desired audience response"
                  icon={ArrowRightIcon}
                  color="green"
                />
              </div>
            </div>
          </SectionCard>

          {/* Enhanced Design Direction */}
          <SectionCard title="Design Recommendations" icon={PaletteIcon} color="green" badge="Visual Guide">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Backgrounds"
                  value={analysis?.designDirection?.backgrounds?.recommended || 'Not specified'}
                  icon={Image}
                  color="blue"
                />
                <MetricCard
                  title="Layouts"
                  value={analysis?.designDirection?.layouts?.recommended || 'Not specified'}
                  icon={Layout}
                  color="purple"
                />
                <MetricCard
                  title="Imagery"
                  value={analysis?.designDirection?.imagery?.recommended || 'Not specified'}
                  icon={Image}
                  color="green"
                />
                <MetricCard
                  title="Typography"
                  value={analysis?.designDirection?.fonts?.headings || 'Not specified'}
                  icon={Type}
                  color="orange"
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Enhanced Contextual Analysis */}
          <SectionCard title="Contextual Analysis" icon={UsersIcon} color="orange" badge="Audience Focus">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <MetricCard
                  title="Objective"
                  value={analysis?.contextualGrounding?.identifiedObjective || 'Not specified'}
                  description="Presentation purpose"
                  icon={TargetIcon}
                  color="orange"
                />
                <MetricCard
                  title="Audience Profile"
                  value={analysis?.contextualGrounding?.audienceProfile || 'Not specified'}
                  description="Target audience characteristics"
                  icon={UsersIcon}
                  color="blue"
                />
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${
                      analysis?.contextualGrounding?.urgencyLevel === 'high' ? 'bg-red-500' :
                      analysis?.contextualGrounding?.urgencyLevel === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">Urgency Level</p>
                      <p className="text-sm text-gray-600">{analysis?.contextualGrounding?.urgencyLevel || 'Not specified'}</p>
                    </div>
                  </div>
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Enhanced Priority Actions */}
          <SectionCard title="Priority Actions" icon={CheckCircleIcon} color="red" badge="Critical Fixes">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Priority Fixes
                </h4>
                <div className="space-y-3">
                  {analysis?.executionGuidance?.priorityFixes?.slice(0, 3).map((fix, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <span className="text-red-500 font-bold text-lg">{index + 1}</span>
                      <span className="text-gray-900 text-sm">{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Quick Wins
                </h4>
                <div className="space-y-2">
                  {analysis?.executionGuidance?.quickWins?.slice(0, 2).map((win, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm">{win}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Enhanced Storytelling Structure */}
          <SectionCard title="Storytelling Approach" icon={Type} color="indigo" badge="Narrative">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <MetricCard
                  title="Narrative Approach"
                  value={analysis?.storytellingStructure?.narrativeApproach || 'Not specified'}
                  icon={BookOpen}
                  color="indigo"
                />
                <MetricCard
                  title="Emotional Tone"
                  value={analysis?.storytellingStructure?.emotionalTone || 'Not specified'}
                  icon={Heart}
                  color="pink"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Messages</h4>
                <div className="space-y-2">
                  {analysis?.storytellingStructure?.keyMessages?.slice(0, 3).map((message, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <span className="text-indigo-500 font-bold text-lg">{index + 1}</span>
                      <span className="text-gray-900 text-sm">{message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Enhanced Client Questions Section */}
      {analysis?.clientQuestions && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <SectionCard title="Client Questions" icon={HelpCircle} color="yellow" badge="Discovery">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Clarifying Questions
                </h4>
                <div className="space-y-2">
                  {analysis.clientQuestions.clarifyingQuestions?.slice(0, 3).map((question, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">• {question}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  Stakeholder Questions
                </h4>
                <div className="space-y-2">
                  {analysis.clientQuestions.stakeholderQuestions?.slice(0, 3).map((question, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-gray-700">• {question}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  Visual Readiness
                </h4>
                <div className="space-y-2">
                  {analysis.clientQuestions.visualReadinessQuestions?.slice(0, 3).map((question, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-700">• {question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={onExportQuestions}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Export All Questions
              </button>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;