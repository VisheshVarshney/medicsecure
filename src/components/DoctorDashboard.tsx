import React, { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Record, Doctor } from '../types';
import { toast } from 'react-hot-toast';

interface DoctorDashboardProps {
  doctor: Doctor;
  onSignOut: () => void;
}

export function DoctorDashboard({ doctor, onSignOut }: DoctorDashboardProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSharedRecords();
  }, [doctor.id]);

  const fetchSharedRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('records')
        .select(`
          *,
          record_shares!inner (
            doctor_id
          )
        `)
        .eq('record_shares.doctor_id', doctor.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching shared records:', error);
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

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
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">
                Doctor Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Dr. {doctor.full_name}
              </div>
              <button
                onClick={onSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Shared Medical Records
              </h2>
              <div className="relative w-64">
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

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No records found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredRecords.map(record => (
                  <div key={record.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {record.title}
                        </h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Type: {record.type}</p>
                          <p>Uploaded by: {record.uploaded_by}</p>
                          <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(record)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}