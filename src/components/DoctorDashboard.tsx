import React, { useState, useEffect } from 'react';
import { Download, Search, Upload, LogOut } from 'lucide-react';
import { Doctor, Record } from '../types';
import { toast } from 'react-hot-toast';
import { UploadModal } from './modals/UploadModal';
import { supabase } from '../lib/supabase';

interface DoctorDashboardProps {
  doctor: Doctor;
  onSignOut: () => void;
}

export function DoctorDashboard({ doctor, onSignOut }: DoctorDashboardProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorRecords();
  }, [doctor.id]);

  const fetchDoctorRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('records')
        .select('*')
        .eq('doctor_id', doctor.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching doctor records:', error);
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
              <img 
                src="https://res.cloudinary.com/dcvmvxbyf/image/upload/v1744473750/pknh0olqodl0ridcigw1.png"
                alt="MedicSecure Logo" 
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-semibold text-gray-900">
                Doctor Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{doctor.full_name}</p>
                <p className="text-gray-500">{doctor.specialization}</p>
              </div>
              <button
                onClick={onSignOut}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
            <p className="mt-1 text-sm text-gray-500">View and manage records for your patients</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Share Record with Patient
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="relative flex-1 max-w-lg">
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

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No records found</p>
                </div>
              ) : (
                filteredRecords.map(record => (
                  <div key={record.id} className="py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{record.title}</h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Type: {record.type}</p>
                          <p>Patient: {record.patient_name}</p>
                          <p>Date: {new Date(record.date).toLocaleDateString()}</p>
                          <p>Size: {(record.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(record)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          doctors={[]}
          onUploadComplete={() => {
            setShowUploadModal(false);
            fetchDoctorRecords();
            toast.success('Record shared successfully');
          }}
          isDoctor={true}
          doctorId={doctor.id}
        />
      )}
    </div>
  );
}