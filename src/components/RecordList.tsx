import React, { useState, useEffect } from 'react';
import { Share2, Trash2, Search, Download } from 'lucide-react';
import { Record } from '../types';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface RecordListProps {
  records: Record[];
  onShare: (recordId: string) => void;
  onDelete: (recordId: string) => void;
  userId: string;
}

export function RecordList({ records, onShare, onDelete, userId }: RecordListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [patientRecords, setPatientRecords] = useState<Record[]>([]);

  useEffect(() => {
    fetchPatientRecords();
  }, [userId]);

  const fetchPatientRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('records')
        .select(`
          *,
          doctors (
            full_name,
            specialization
          )
        `)
        .eq('patient_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatientRecords(data || []);
    } catch (error) {
      console.error('Error fetching patient records:', error);
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = patientRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? record.type === filterType : true;
    return matchesSearch && matchesType;
  });

  const recordTypes = Array.from(new Set(patientRecords.map(record => record.type)));

  const handleDownload = async (record: Record) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical-records')
        .download(record.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = record.original_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  return (
    <div className="lg:col-span-3">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">My Medical Records</h2>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {recordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No records found
            </div>
          ) : (
            filteredRecords.map(record => (
              <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {record.title}
                    </h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Type: {record.type}</p>
                      <p>Size: {(record.file_size / 1024 / 1024).toFixed(2)} MB</p>
                      <p>File: {record.original_name}</p>
                      {record.doctors && (
                        <p className="text-blue-600">
                          Uploaded by Dr. {record.doctors.full_name} ({record.doctors.specialization})
                        </p>
                      )}
                      <p className="text-gray-400">
                        Added on {new Date(record.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDownload(record)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button 
                    onClick={() => onShare(record.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
                        onDelete(record.id);
                      }
                    }}
                    className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
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