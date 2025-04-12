import React from 'react';
import { Upload, Users, Clock } from 'lucide-react';

interface SidebarProps {
  onUpload: () => void;
  onShare: () => void;
}

export function Sidebar({ onUpload, onShare }: SidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <button 
            onClick={onUpload}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Record
          </button>
          <button 
            onClick={onShare}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100"
          >
            <Users className="h-5 w-5 mr-2" />
            Share Records
          </button>
          <button className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100">
            <Clock className="h-5 w-5 mr-2" />
            Access History
          </button>
        </div>
      </div>
    </div>
  );
}