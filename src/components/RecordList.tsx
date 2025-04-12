import React, { useState } from 'react';
import { Share2, Trash2, Search, Download } from 'lucide-react';
import { Record } from '../types';
import { supabase } from '../lib/supabase';

interface RecordListProps {
  records: Record[];
  onShare: (recordId: string) => void;
  onDelete: (recordId: string) => void;
}

export function RecordList({ records, onShare, onDelete }: RecordListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? record.type === filterType : true;
    return matchesSearch && matchesType;
  });

  const recordTypes = Array.from(new Set(records.map(record => record.type)));

  const handleDownload = async (record: Record) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical-records')
        .download(record.storage_path);

      if (error) throw error;

      // Create a download link for the file
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = record.original_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Medical Records</h2>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No records found
            </div>
          ) : (
            filteredRecords.map(record => (
              <div key={record.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {record.title}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                      <p>Type: {record.type}</p>
                      <p>Size: {(record.file_size / 1024 / 1024).toFixed(2)} MB</p>
                      <p>Original File: {record.original_name}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleDownload(record)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button 
                    onClick={() => onShare(record.id)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this record?')) {
                        onDelete(record.id);
                      }
                    }}
                    className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}