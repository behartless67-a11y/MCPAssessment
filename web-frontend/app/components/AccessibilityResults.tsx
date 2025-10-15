'use client';

interface AccessibilityResultsProps {
  analysis: any;
}

export default function AccessibilityResults({ analysis }: AccessibilityResultsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'bg-green-600 text-white border-green-600';
      case 'yellow':
        return 'bg-yellow-500 text-white border-yellow-500';
      case 'red':
        return 'bg-red-600 text-white border-red-600';
      default:
        return 'bg-gray-600 text-white border-gray-600';
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

  return (
    <div className="space-y-6">
      {/* Accessibility Status */}
      {analysis && analysis.status && (
        <div className={`card ${getStatusColor(analysis.status)}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-5xl">{getStatusIcon(analysis.status)}</span>
                <h3 className="text-2xl font-bold">
                  Status: {analysis.status.toUpperCase()}
                </h3>
              </div>
              <p className="opacity-90 ml-14">
                WCAG 2.1 Level {analysis.wcagLevel || 'AA'}
              </p>
              {analysis.statusReason && (
                <p className="mt-2 opacity-90 ml-14 text-sm">
                  {analysis.statusReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Issues */}
      {analysis.issues && analysis.issues.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-uva-blue mb-4">
            Accessibility Issues
          </h3>
          <div className="space-y-3">
            {analysis.issues.map((issue: any, index: number) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold uppercase text-xs">
                        {issue.severity}
                      </span>
                      {issue.principle && (
                        <span className="text-xs opacity-75">
                          | {issue.principle}
                        </span>
                      )}
                      {issue.criterion && (
                        <span className="text-xs opacity-75">
                          | WCAG {issue.criterion}
                        </span>
                      )}
                    </div>
                    <p className="font-medium">{issue.description}</p>
                  </div>
                </div>
                {issue.recommendation && (
                  <div className="mt-2 pt-2 border-t border-current opacity-75">
                    <p className="text-sm">
                      <strong>Fix:</strong> {issue.recommendation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passed Criteria */}
      {analysis.accessibility?.passedCriteria && analysis.accessibility.passedCriteria.length > 0 && (
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            ✅ Passed Criteria
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {analysis.accessibility.passedCriteria.map((criterion: string, index: number) => (
              <div key={index} className="bg-white px-3 py-2 rounded border border-green-200">
                <span className="text-sm text-green-700">{criterion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Branding Issues */}
      {analysis.branding && (
        <div className="card">
          <h3 className="text-lg font-semibold text-uva-blue mb-3">
            Brand Compliance
          </h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Score</span>
              <span className="text-2xl font-bold text-uva-orange">
                {Math.round(analysis.branding.score)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-uva-orange h-2 rounded-full transition-all"
                style={{ width: `${Math.min(analysis.branding.score, 100)}%` }}
              ></div>
            </div>
          </div>
          {analysis.branding.issues && analysis.branding.issues.length > 0 && (
            <div className="space-y-2">
              {analysis.branding.issues.map((issue: any, index: number) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded p-3">
                  <div className="font-medium text-uva-orange text-sm uppercase mb-1">
                    {issue.type}
                  </div>
                  <p className="text-gray-700 text-sm">{issue.description}</p>
                  {issue.recommendation && (
                    <p className="text-gray-600 text-sm mt-1">
                      <strong>→</strong> {issue.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Layout Suggestions */}
      {analysis.layout?.suggestions && analysis.layout.suggestions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-uva-blue mb-3">
            Layout Suggestions
          </h3>
          <div className="mb-3">
            <span className="text-2xl font-bold text-uva-blue">
              {Math.round(analysis.layout.score)}%
            </span>
            <span className="text-gray-600 ml-2">Layout Quality</span>
          </div>
          <ul className="space-y-2">
            {analysis.layout.suggestions.map((suggestion: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-uva-blue mr-2">→</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
