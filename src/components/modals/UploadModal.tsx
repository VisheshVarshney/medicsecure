import React, { useState, useCallback, useEffect } from 'react';
import { X, FileUp, Upload as UploadIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Doctor } from '../../types';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

interface UploadModalProps {
  onClose: () => void;
  doctors: Doctor[];
  onUploadComplete: () => void;
  isPatient?: boolean;
  patientId?: string;
  doctorId?: string;
}

export function UploadModal({
  onClose,
  doctors,
  onUploadComplete,
  isPatient = false,
  patientId,
  doctorId,
}: UploadModalProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > 30 * 1024 * 1024) {
      setError('File size must be less than 30MB');
      return;
    }
    setFile(file);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || selectedRecipients.length === 0) {
      toast.error('Please select a file and at least one recipient');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get('title') as string;
      const type = formData.get('type') as string;

      // Create storage path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const storagePath = `uploads/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('medical-records')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

      // Create records for each selected recipient
      for (const recipientId of selectedRecipients) {
        const { error: recordError } = await supabase
          .from('records')
          .insert([
            {
              title,
              type,
              storage_path: storagePath,
              file_size: file.size,
              file_type: file.type,
              original_name: file.name,
              doctor_id: isPatient ? recipientId : doctorId,
              patient_id: isPatient ? patientId : recipientId,
              uploaded_by: isPatient ? patientId : doctorId,
              user_id: isPatient ? patientId : doctorId,
            },
          ]);

        if (recordError) throw recordError;
      }

      toast.success('Record uploaded successfully');
      onUploadComplete();
      onClose();
    } catch (error) {
      console.error('Error uploading record:', error);
      setError('Failed to upload record');
      toast.error('Failed to upload record');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isPatient ? 'Share Record with Doctor' : 'Upload Medical Record'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Record Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Record Type
            </label>
            <select
              id="type"
              name="type"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a type</option>
              <option value="Physical Examination">Physical Examination</option>
              <option value="Laboratory">Laboratory Results</option>
              <option value="Imaging">Imaging Results</option>
              <option value="Prescription">Prescription</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isPatient ? 'Share with Doctors' : 'Share with Patients'}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${
                    selectedRecipients.includes(doctor.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => {
                    setSelectedRecipients((prev) =>
                      prev.includes(doctor.id)
                        ? prev.filter((id) => id !== doctor.id)
                        : [...prev, doctor.id]
                    );
                  }}
                >
                  <h4 className="font-medium text-gray-900">
                    {doctor.full_name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {doctor.specialization}
                  </p>
                  <p className="text-sm text-gray-500">
                    {doctor.contact_email}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File
            </label>
            <div
              {...getRootProps()}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
            >
              <div className="space-y-1 text-center">
                <input {...getInputProps()} />
                {file ? (
                  <div className="text-sm text-gray-600">
                    <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">
                      Drag and drop a file here, or click to select
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, PNG, DOC up to 30MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || selectedRecipients.length === 0 || uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}