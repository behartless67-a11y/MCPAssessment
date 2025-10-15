'use client';

import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface BrandingData {
  status: 'red' | 'yellow' | 'green';
  statusReason?: string;
  mentionsSchool?: boolean;
  colorUsage?: {
    usesUVAColors: boolean;
    properContrast: boolean;
    issues: string[];
  };
  typography?: {
    usesApprovedFonts: boolean;
    issues: string[];
  };
  logoUsage?: {
    hasLogo: boolean;
    isCorrectlyUsed: boolean;
    issues: string[];
  };
  recommendations: string[];
}

interface BrandingResultsProps {
  branding: BrandingData;
}

export default function BrandingResults({ branding }: BrandingResultsProps) {
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

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className={`border-2 rounded-lg p-4 ${getStatusColor(branding.status)}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{getStatusIcon(branding.status)}</span>
          <div>
            <h3 className="text-lg font-bold">Status: {branding.status.toUpperCase()}</h3>
            {branding.statusReason && (
              <p className="text-sm mt-1">{branding.statusReason}</p>
            )}
          </div>
        </div>
      </div>

      {/* School Name Check */}
      {branding.mentionsSchool !== undefined && (
        <div className="border rounded-lg p-4 bg-blue-50 border-blue-300">
          <div className="flex items-center gap-2">
            {branding.mentionsSchool ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-medium">
              {branding.mentionsSchool
                ? 'Document mentions Frank Batten School of Public Policy ✓'
                : 'Document should mention Frank Batten School of Public Policy'}
            </span>
          </div>
        </div>
      )}

      {/* Color Usage Section */}
      {branding.colorUsage && (
        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-[#232D4B]">Color Usage</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {branding.colorUsage.usesUVAColors ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">
                {branding.colorUsage.usesUVAColors
                  ? 'Uses UVA brand colors (Blue #232D4B / Orange #E57200)'
                  : 'Does not use approved UVA brand colors'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {branding.colorUsage.properContrast ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">
                {branding.colorUsage.properContrast
                  ? 'Proper contrast ratios (WCAG AA compliant)'
                  : 'Contrast issues detected'}
              </span>
            </div>
            {branding.colorUsage.issues.length > 0 && (
              <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <p className="text-sm font-semibold text-yellow-800 mb-1">Color Issues:</p>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {branding.colorUsage.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Typography Section */}
      {branding.typography && (
        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-[#232D4B]">Typography</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {branding.typography.usesApprovedFonts ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm">
                {branding.typography.usesApprovedFonts
                  ? 'Uses approved UVA fonts (Franklin Gothic, Adobe Caslon, Bodoni)'
                  : 'Does not use approved UVA brand fonts'}
              </span>
            </div>
            {branding.typography.issues.length > 0 && (
              <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <p className="text-sm font-semibold text-yellow-800 mb-1">Typography Issues:</p>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {branding.typography.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logo Usage Section */}
      {branding.logoUsage && (
        <div className="mb-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-[#232D4B]">Logo Usage</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {branding.logoUsage.hasLogo ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-gray-500" />
              )}
              <span className="text-sm">
                {branding.logoUsage.hasLogo
                  ? 'UVA logo present'
                  : 'No UVA logo detected'}
              </span>
            </div>
            {branding.logoUsage.hasLogo && (
              <div className="flex items-center gap-2">
                {branding.logoUsage.isCorrectlyUsed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm">
                  {branding.logoUsage.isCorrectlyUsed
                    ? 'Logo used correctly'
                    : 'Logo usage issues detected'}
                </span>
              </div>
            )}
            {branding.logoUsage.issues.length > 0 && (
              <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <p className="text-sm font-semibold text-yellow-800 mb-1">Logo Issues:</p>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {branding.logoUsage.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {branding.recommendations && branding.recommendations.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-[#232D4B]">
            Branding Recommendations
          </h3>
          <ul className="space-y-2">
            {branding.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#E57200] mt-1">•</span>
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* UVA Brand Colors Reference */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-3 text-[#232D4B]">
          UVA Brand Colors Reference
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-12 h-12 rounded" style={{ backgroundColor: '#232D4B' }} />
              <div>
                <p className="text-sm font-semibold">UVA Blue</p>
                <p className="text-xs text-gray-600">#232D4B</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-12 h-12 rounded" style={{ backgroundColor: '#E57200' }} />
              <div>
                <p className="text-sm font-semibold">UVA Orange</p>
                <p className="text-xs text-gray-600">#E57200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
