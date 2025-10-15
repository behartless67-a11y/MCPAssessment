'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export default function CollapsibleSection({
  title,
  subtitle,
  icon,
  defaultOpen = false,
  children,
  badge,
  badgeColor = 'bg-blue-500'
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-[#232D4B]">{icon}</div>}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-[#232D4B]">{title}</h3>
              {badge && (
                <span className={`${badgeColor} text-white text-xs px-2 py-1 rounded-full`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="text-gray-500">
          {isOpen ? (
            <ChevronDown className="w-6 h-6" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
