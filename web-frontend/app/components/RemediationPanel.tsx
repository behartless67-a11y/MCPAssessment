'use client';

import { useState } from 'react';
import { Download, Loader, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import axios from 'axios';

interface AccessibilityIssue {
  severity: string;
  principle: string;
  criterion: string;
  description: string;
  recommendation: string;
  canAutoRemediate?: boolean;
}

interface RemediationPanelProps {
  issues: AccessibilityIssue[];
  fileName: string;
  originalFile: File | null;
}

export default function RemediationPanel({
  issues,
  fileName,
  originalFile
}: RemediationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Count auto-remediable issues
  const autoRemediableIssues = issues.filter(issue => issue.canAutoRemediate);
  const manualIssues = issues.filter(issue => !issue.canAutoRemediate);

  const handleRemediate = async () => {
    if (!originalFile) {
      setError('Original file not available. Please re-upload the document.');
      return;
    }

    if (autoRemediableIssues.length === 0) {
      setError('No auto-remediable issues found. All issues require manual fixes.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', originalFile);
      formData.append('issues', JSON.stringify(issues));

      const response = await axios.post('http://localhost:3002/api/remediate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important for file download
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName.replace('.docx', '_remediated.docx'));
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(`Successfully remediated ${autoRemediableIssues.length} accessibility issues! File downloaded.`);
    } catch (error: any) {
      console.error('Remediation error:', error);
      setError(error.response?.data?.error || error.message || 'Remediation failed');
    } finally {
      setLoading(false);
    }
  };

  // Only show for DOCX files
  if (!fileName.toLowerCase().endsWith('.docx')) {
    return (
      <div className="card border-2 border-blue-200 bg-blue-50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              Auto-Remediation Not Available
            </h3>
            <p className="text-sm text-blue-700">
              Automatic remediation is currently only supported for DOCX files.
              Please convert your document to DOCX format to use this feature.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="card border-2 border-[#e57200] bg-gradient-to-br from-orange-50 to-white">
      <div className="flex items-start gap-4">
        <Download className="w-8 h-8 text-[#e57200] flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#232d4b] mb-2">
            Automatic Accessibility Remediation
          </h3>
          <p className="text-gray-700 mb-4">
            We can automatically fix some of the accessibility issues found in your document.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {autoRemediableIssues.length}
                  </div>
                  <div className="text-xs text-gray-600">Auto-fixable issues</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-yellow-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {manualIssues.length}
                  </div>
                  <div className="text-xs text-gray-600">Manual fixes needed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-remediable issues list */}
          {autoRemediableIssues.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-[#232d4b] mb-2 text-sm">
                Will automatically fix:
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {autoRemediableIssues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{issue.criterion}: {issue.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Manual issues note */}
          {manualIssues.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-1 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Requires manual attention:
              </h4>
              <ul className="space-y-1 text-xs text-yellow-700 ml-6">
                {manualIssues.slice(0, 3).map((issue, idx) => (
                  <li key={idx} className="list-disc">
                    {issue.criterion}: {issue.description}
                  </li>
                ))}
                {manualIssues.length > 3 && (
                  <li className="italic">...and {manualIssues.length - 3} more</li>
                )}
              </ul>
            </div>
          )}

          {/* Action button */}
          {autoRemediableIssues.length > 0 && (
            <button
              onClick={handleRemediate}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating remediated document...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Remediated Document
                </>
              )}
            </button>
          )}

          {/* Status messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          {/* Info note */}
          <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <strong>Note:</strong> The remediated document will include:
            <ul className="list-disc ml-5 mt-1 space-y-0.5">
              <li>Proper document structure with headings</li>
              <li>Improved text formatting and spacing</li>
              <li>Notes about fixes that require manual attention</li>
              <li>WCAG 2.1 Level AA compliance improvements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
