import React, { useState, useEffect } from 'react';
import { Download, Search, Upload, LogOut, Trash2 } from 'lucide-react';
import { User, Record } from '../types';
import { toast } from 'react-hot-toast';
import { UploadModal } from './modals/UploadModal';
import { supabase } from '../lib/supabase';

interface PatientDashboardProps {
  user: User;
  onSignOut: () => void;
}

export function PatientDashboard({ user, onSignOut }: PatientDashboardProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchRecords();
    fetchDoctors();
  }, [user.id]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('records')
        .select(`
          *,
          doctors (
            id,
            full_name,
            specialization,
            contact_email,
            contact_phone
          )
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
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
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      toast.success('Record deleted successfully');
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? record.type === filterType : true;
    return matchesSearch && matchesType;
  });

  const recordTypes = Array.from(new Set(records.map(record => record.type)));

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
                Patient Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.full_name}</p>
                <p className="text-gray-500">{user.email}</p>
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
            <h1 className="text-2xl font-bold text-gray-900">My Medical Records</h1>
            <p className="mt-1 text-sm text-gray-500">View and manage your medical records</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Record to Doctor
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
                              Shared with Dr. {record.doctors.full_name} ({record.doctors.specialization})
                            </p>
                          )}
                          <p className="text-gray-400">
                            Added on {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleDownload(record)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
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
      </main>

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          doctors={doctors}
          onUploadComplete={() => {
            setShowUploadModal(false);
            fetchRecords();
            toast.success('Record uploaded successfully');
          }}
          isPatient={true}
          patientId={user.id}
        />
      )}
    </div>
  );
}