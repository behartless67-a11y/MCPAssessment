'use client';

interface QMScoreProps {
  analysis: any;
}

export default function QMScore({ analysis }: QMScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="card bg-gradient-to-r from-uva-blue to-blue-900 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">
              Quality Matters Score
            </h3>
            <p className="text-blue-200">
              {analysis.totalPoints} / {analysis.maxPoints} points
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">
              {Math.round(analysis.overallScore)}%
            </div>
            <div className="text-sm mt-1">
              {analysis.meetsThreshold ? (
                <span className="bg-green-500 px-3 py-1 rounded-full">
                  ✓ Meets 85% Threshold
                </span>
              ) : (
                <span className="bg-red-500 px-3 py-1 rounded-full">
                  ✗ Below 85% Threshold
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-700">
          <div className="flex items-center justify-between text-sm">
            <span>Essential Standards:</span>
            <span className={analysis.passesEssentialStandards ? 'text-green-300' : 'text-red-300'}>
              {analysis.passesEssentialStandards ? '✓ All Met' : '✗ Missing Required Standards'}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {analysis.criticalIssues && analysis.criticalIssues.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-700 mb-3">
            ⚠️ Critical Issues (Must Fix)
          </h3>
          <ul className="space-y-2">
            {analysis.criticalIssues.map((issue: string, index: number) => (
              <li key={index} className="text-red-700 flex items-start">
                <span className="mr-2">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Standards Breakdown */}
      <div className="card">
        <h3 className="text-lg font-semibold text-uva-blue mb-4">
          Standards Breakdown
        </h3>
        <div className="space-y-3">
          {analysis.standardScores && Object.entries(analysis.standardScores).map(([key, standard]: [string, any]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{standard.name}</h4>
                  <p className="text-sm text-gray-500">
                    {standard.pointsEarned} / {standard.pointsPossible} points
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(standard.percentage)}`}>
                    {Math.round(standard.percentage)}%
                  </div>
                  {!standard.essentialsMet && (
                    <div className="text-xs text-red-600 mt-1">
                      Missing essentials
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    standard.percentage >= 85 ? 'bg-green-600' :
                    standard.percentage >= 70 ? 'bg-blue-600' :
                    standard.percentage >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${Math.min(standard.percentage, 100)}%` }}
                ></div>
              </div>

              {/* Feedback */}
              {standard.feedback && (
                <p className="text-sm text-gray-600 mt-2">
                  {standard.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-uva-blue mb-3">
            📋 Recommendations
          </h3>
          <ul className="space-y-2">
            {analysis.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-uva-orange mr-2">→</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      {analysis.strengths && analysis.strengths.length > 0 && (
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            ✅ Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength: string, index: number) => (
              <li key={index} className="text-green-700 flex items-start">
                <span className="mr-2">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
