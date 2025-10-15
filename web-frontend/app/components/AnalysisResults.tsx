'use client';

import BrandingResults from './BrandingResults';

interface AnalysisResultsProps {
  analysis: any;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* UVA Branding Section */}
      {analysis.branding && (
        <BrandingResults branding={analysis.branding} />
      )}

      {/* Document Type */}
      {analysis.documentType && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-uva-blue mb-2">
            Document Type
          </h3>
          <p className="text-gray-700 capitalize">{analysis.documentType}</p>
        </div>
      )}

      {/* General Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-uva-blue mb-4">
            📋 General Recommendations
          </h3>
          <ul className="space-y-3">
            {analysis.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start bg-gray-50 p-3 rounded">
                <span className="text-uva-orange mr-3 text-lg">✓</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Accessibility Recommendations */}
      {analysis.accessibility && analysis.accessibility.length > 0 && (
        <div className="card bg-purple-50 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-700 mb-4">
            ♿ Accessibility Improvements
          </h3>
          <ul className="space-y-2">
            {analysis.accessibility.map((item: string, index: number) => (
              <li key={index} className="flex items-start text-purple-900">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Structure Recommendations */}
      {analysis.structure && analysis.structure.length > 0 && (
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">
            🏗️ Structure & Organization
          </h3>
          <ul className="space-y-2">
            {analysis.structure.map((item: string, index: number) => (
              <li key={index} className="flex items-start text-blue-900">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content Recommendations */}
      {analysis.content && analysis.content.length > 0 && (
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-4">
            ✍️ Content Improvements
          </h3>
          <ul className="space-y-2">
            {analysis.content.map((item: string, index: number) => (
              <li key={index} className="flex items-start text-green-900">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Notes */}
      {analysis.additionalNotes && (
        <div className="card bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            📝 Additional Notes
          </h3>
          <p className="text-gray-600">{analysis.additionalNotes}</p>
        </div>
      )}
    </div>
  );
}
