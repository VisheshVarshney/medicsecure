import React from 'react';
import { Shield } from 'lucide-react';

export function WarningBanner() {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto py-3 px-4">
        <div className="flex items-center justify-center">
          <Shield className="h-5 w-5 text-yellow-600 mr-2" />
          <p className="text-yellow-700 text-sm font-medium">
            Demo Only: Not HIPAA Compliant - Do Not Use Real Patient Data
          </p>
        </div>
      </div>
    </div>
  );
}