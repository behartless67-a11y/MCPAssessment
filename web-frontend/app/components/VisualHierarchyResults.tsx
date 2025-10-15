'use client';

import { CheckCircle, XCircle, AlertCircle, Eye, Type, Layout, Minimize2, Layers } from 'lucide-react';

interface VisualHierarchyData {
  status: 'red' | 'yellow' | 'green';
  statusReason?: string;
  overallScore: string;
  sizeAndScale?: {
    hasProperHierarchy: boolean;
    issues: string[];
    recommendations: string[];
  };
  colorAndContrast?: {
    effectiveUse: boolean;
    issues: string[];
    recommendations: string[];
  };
  alignment?: {
    consistent: boolean;
    scanningPattern: string;
    issues: string[];
    recommendations: string[];
  };
  proximity?: {
    effectiveGrouping: boolean;
    issues: string[];
    recommendations: string[];
  };
  whitespace?: {
    adequate: boolean;
    issues: string[];
    recommendations: string[];
  };
  typography?: {
    hierarchyClear: boolean;
    fontChoices: string;
    issues: string[];
    recommendations: string[];
  };
  cognitiveLoad?: {
    appropriate: boolean;
    assessment: string;
    recommendations: string[];
  };
  recommendations: string[];
}

interface VisualHierarchyResultsProps {
  visualHierarchy: VisualHierarchyData;
}

export default function VisualHierarchyResults({ visualHierarchy }: VisualHierarchyResultsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'text-green-600 bg-green-50 border-green-300';
      case 'yellow':
        return 'text-yellow-700 bg-yellow-50 border-yellow-300';
      case 'red':
        return 'text-red-600 bg-red-50 border-red-300';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green':
        return '✓';
      case 'yellow':
        return '⚠';
      case 'red':
        return '✗';
      default:
        return '•';
    }
  };

  const getScoreColor = (score: string) => {
    switch (score.toLowerCase()) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'needs improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className={`border-2 rounded-lg p-4 ${getStatusColor(visualHierarchy.status)}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{getStatusIcon(visualHierarchy.status)}</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Status: {visualHierarchy.status.toUpperCase()}</h3>
            <p className={`text-lg font-semibold mt-1 ${getScoreColor(visualHierarchy.overallScore)}`}>
              Overall Assessment: {visualHierarchy.overallScore}
            </p>
            {visualHierarchy.statusReason && (
              <p className="text-sm mt-2">{visualHierarchy.statusReason}</p>
            )}
          </div>
        </div>
      </div>

      {/* Size and Scale */}
      {visualHierarchy.sizeAndScale && (
        <div className="card border-l-4 border-l-purple-500">
          <div className="flex items-start gap-3">
            <Layers className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-[#232d4b] mb-2 flex items-center gap-2">
                Size & Scale Hierarchy
                {visualHierarchy.sizeAndScale.hasProperHierarchy ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </h4>
              {visualHierarchy.sizeAndScale.issues.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">Issues:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.sizeAndScale.issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-700">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visualHierarchy.sizeAndScale.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Recommendations:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.sizeAndScale.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Color and Contrast */}
      {visualHierarchy.colorAndContrast && (
        <div className="card border-l-4 border-l-indigo-500">
          <div className="flex items-start gap-3">
            <Eye className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-[#232d4b] mb-2 flex items-center gap-2">
                Color & Contrast
                {visualHierarchy.colorAndContrast.effectiveUse ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </h4>
              {visualHierarchy.colorAndContrast.issues.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">Issues:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.colorAndContrast.issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-700">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visualHierarchy.colorAndContrast.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Recommendations:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.colorAndContrast.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alignment */}
      {visualHierarchy.alignment && (
        <div className="card border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <Layout className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-[#232d4b] mb-2 flex items-center gap-2">
                Alignment & Layout
                {visualHierarchy.alignment.consistent ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </h4>
              {visualHierarchy.alignment.scanningPattern && (
                <p className="text-sm mb-2">
                  <strong>Scanning Pattern:</strong> {visualHierarchy.alignment.scanningPattern}
                </p>
              )}
              {visualHierarchy.alignment.issues.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">Issues:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.alignment.issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-700">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visualHierarchy.alignment.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Recommendations:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.alignment.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Proximity */}
      {visualHierarchy.proximity && visualHierarchy.proximity.issues.length > 0 && (
        <div className="card border-l-4 border-l-green-500">
          <div className="flex items-start gap-3">
            <Layers className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-[#232d4b] mb-2 flex items-center gap-2">
                Proximity & Grouping
                {visualHierarchy.proximity.effectiveGrouping ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </h4>
              {visualHierarchy.proximity.issues.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">Issues:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.proximity.issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-700">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visualHierarchy.proximity.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Recommendations:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.proximity.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Whitespace */}
      {visualHierarchy.whitespace && (
        <div className="card border-l-4 border-l-cyan-500">
          <div className="flex items-start gap-3">
            <Minimize2 className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-[#232d4b] mb-2 flex items-center gap-2">
                Whitespace & Spacing
                {visualHierarchy.whitespace.adequate ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </h4>
              {visualHierarchy.whitespace.issues.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">Issues:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.whitespace.issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-700">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visualHierarchy.whitespace.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Recommendations:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.whitespace.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Typography */}
      {visualHierarchy.typography && (
        <div className="card border-l-4 border-l-orange-500">
          <div className="flex items-start gap-3">
            <Type className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-[#232d4b] mb-2 flex items-center gap-2">
                Typography
                {visualHierarchy.typography.hierarchyClear ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </h4>
              {visualHierarchy.typography.fontChoices && (
                <p className="text-sm mb-2">
                  <strong>Font Choices:</strong> {visualHierarchy.typography.fontChoices}
                </p>
              )}
              {visualHierarchy.typography.issues.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">Issues:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.typography.issues.map((issue, idx) => (
                      <li key={idx} className="text-gray-700">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              {visualHierarchy.typography.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Recommendations:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.typography.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cognitive Load */}
      {visualHierarchy.cognitiveLoad && (
        <div className="card border-l-4 border-l-pink-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-[#232d4b] mb-2 flex items-center gap-2">
                Cognitive Load
                {visualHierarchy.cognitiveLoad.appropriate ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </h4>
              {visualHierarchy.cognitiveLoad.assessment && (
                <p className="text-sm mb-2">
                  <strong>Assessment:</strong> {visualHierarchy.cognitiveLoad.assessment}
                </p>
              )}
              {visualHierarchy.cognitiveLoad.recommendations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-1">Recommendations:</p>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    {visualHierarchy.cognitiveLoad.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overall Recommendations */}
      {visualHierarchy.recommendations.length > 0 && (
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h4 className="font-bold text-[#232d4b] mb-3 text-lg">
            Overall Visual Hierarchy Recommendations
          </h4>
          <ul className="space-y-2">
            {visualHierarchy.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-0.5">→</span>
                <span className="text-gray-800">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
