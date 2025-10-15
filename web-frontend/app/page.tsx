'use client';

import { useState } from 'react';
import { BookOpen, Shield, Palette, BarChart3, Eye } from 'lucide-react';
import FileUpload from './components/FileUpload';
import CollapsibleSection from './components/CollapsibleSection';
import AccessibilityResults from './components/AccessibilityResults';
import BrandingResults from './components/BrandingResults';
import AnalysisResults from './components/AnalysisResults';
import RemediationPanel from './components/RemediationPanel';
import VisualHierarchyResults from './components/VisualHierarchyResults';

export default function Home() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleAnalysisComplete = (data: any, file: File) => {
    setResults(data);
    setUploadedFile(file);
    setLoading(false);
    setError(null);
  };

  const handleAnalysisError = (err: string) => {
    setError(err);
    setLoading(false);
    setResults(null);
    setUploadedFile(null);
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setUploadedFile(null);
  };

  return (
    <>
      {/* Header with UVA Branding */}
      <header className="bg-gradient-to-r from-[#232d4b] to-[#1a2235] text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Document Accessibility Checker
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                WCAG 2.1 & 2.2 Compliance • UVA Branding • Visual Analysis
              </p>
            </div>
            <img
              src="/bat_rgb_ko.png"
              alt="Batten School Logo"
              className="h-14 w-auto hidden md:block"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-[95%] mx-auto my-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-8">
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 border-l-4 border-[#e57200] p-6 rounded-xl mb-8 shadow-sm">
              <h3 className="font-semibold text-[#232d4b] mb-3 text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#e57200]" />
                Comprehensive Analysis Includes:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Shield className="w-4 h-4 text-[#e57200] flex-shrink-0" />
                  <span><strong>Accessibility:</strong> WCAG 2.1 & 2.2 Level AA</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Palette className="w-4 h-4 text-[#e57200] flex-shrink-0" />
                  <span><strong>UVA Branding:</strong> Colors, fonts, logos</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <Eye className="w-4 h-4 text-[#e57200] flex-shrink-0" />
                  <span><strong>Visual Hierarchy:</strong> Layout & scannability</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <BookOpen className="w-4 h-4 text-[#e57200] flex-shrink-0" />
                  <span><strong>Best Practices:</strong> Clarity & structure</span>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <FileUpload
              onAnalysisStart={handleAnalysisStart}
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisError={handleAnalysisError}
            />

            {/* Loading State */}
            {loading && (
              <div className="card mt-6 text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#e57200] mb-4"></div>
                <p className="text-lg text-gray-600">Analyzing your document...</p>
                <p className="text-sm text-gray-500 mt-2">This comprehensive analysis may take 1-2 minutes</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="card mt-6 bg-red-50 border-red-300 border-l-4 border-l-red-500">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Analysis Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Results */}
            {results && !loading && (
              <div className="mt-8 space-y-4">
                {/* File Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#232d4b]">Analyzed File</h3>
                      <p className="text-sm text-gray-600">{results.fileName}</p>
                    </div>
                    <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                      {results.fileType}
                    </div>
                  </div>
                </div>

                {/* UVA Branding Results */}
                {results.branding && (
                  <CollapsibleSection
                    title="UVA Brand Compliance"
                    subtitle="Colors, typography, and logo usage analysis"
                    icon={<Palette className="w-6 h-6" />}
                    defaultOpen={true}
                    badge={results.branding.status?.toUpperCase() || 'YELLOW'}
                    badgeColor={
                      results.branding.status === 'green' ? 'bg-green-500' :
                      results.branding.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }
                  >
                    <BrandingResults branding={results.branding} />
                  </CollapsibleSection>
                )}

                {/* Accessibility Results */}
                {results.accessibility && (
                  <CollapsibleSection
                    title="Accessibility Compliance"
                    subtitle="WCAG 2.1 & 2.2 Level AA standards evaluation"
                    icon={<Shield className="w-6 h-6" />}
                    defaultOpen={true}
                    badge={results.accessibility.status?.toUpperCase() || 'RED'}
                    badgeColor={
                      results.accessibility.status === 'green' ? 'bg-green-500' :
                      results.accessibility.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }
                  >
                    <AccessibilityResults analysis={results.accessibility} />
                  </CollapsibleSection>
                )}

                {/* Automatic Remediation Panel */}
                {results.accessibility && results.accessibility.issues && results.accessibility.issues.length > 0 && (
                  <RemediationPanel
                    issues={results.accessibility.issues}
                    fileName={results.fileName}
                    originalFile={uploadedFile}
                  />
                )}

                {/* Visual Hierarchy Results */}
                {results.visualHierarchy && (
                  <CollapsibleSection
                    title="Visual Hierarchy Assessment"
                    subtitle="Layout, typography, spacing, and scannability analysis"
                    icon={<Eye className="w-6 h-6" />}
                    defaultOpen={true}
                    badge={results.visualHierarchy.status?.toUpperCase() || 'YELLOW'}
                    badgeColor={
                      results.visualHierarchy.status === 'green' ? 'bg-green-500' :
                      results.visualHierarchy.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }
                  >
                    <VisualHierarchyResults visualHierarchy={results.visualHierarchy} />
                  </CollapsibleSection>
                )}

                {/* Best Practices & Recommendations */}
                {results.general && (
                  <CollapsibleSection
                    title="Content Best Practices"
                    subtitle="Structure, clarity, and readability recommendations"
                    icon={<BookOpen className="w-6 h-6" />}
                    defaultOpen={true}
                  >
                    <AnalysisResults analysis={results.general} />
                  </CollapsibleSection>
                )}

                {/* Raw Response (if structured parsing failed) */}
                {results.rawResponse && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-[#232d4b] mb-4">Analysis Results</h3>
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-xs">
                        {results.rawResponse}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info Section */}
            {!results && !loading && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-hover bg-gradient-to-br from-purple-50 to-white border-l-4 border-[#e57200]">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-[#e57200]" />
                    <h3 className="font-semibold text-[#232d4b]">Accessibility</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    WCAG 2.1 & 2.2 Level AA compliance check with issue severity and remediation steps
                  </p>
                </div>

                <div className="card-hover bg-gradient-to-br from-orange-50 to-white border-l-4 border-[#e57200]">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-5 h-5 text-[#e57200]" />
                    <h3 className="font-semibold text-[#232d4b]">UVA Branding</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Brand guidelines verification including colors, fonts, and logo usage
                  </p>
                </div>

                <div className="card-hover bg-gradient-to-br from-blue-50 to-white border-l-4 border-[#e57200]">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-[#e57200]" />
                    <h3 className="font-semibold text-[#232d4b]">Best Practices</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Content structure, clarity, readability, and organization recommendations
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#232d4b] to-[#1a2235] text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-300">
            University of Virginia | Powered by Claude AI & Model Context Protocol
          </p>
        </div>
      </footer>
    </>
  );
}
