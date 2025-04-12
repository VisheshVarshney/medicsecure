import React from 'react';
import { X } from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
  onShare: (email: string, permission: string, expiry: string) => void;
}

export function ShareModal({ onClose, onShare }: ShareModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onShare(
      formData.get('email') as string,
      formData.get('permission') as string,
      formData.get('expiry') as string
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Share Medical Record</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Recipient Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="doctor@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="permission" className="block text-sm font-medium text-gray-700">
              Access Level
            </label>
            <select
              id="permission"
              name="permission"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="view">View Only</option>
              <option value="download">View & Download</option>
              <option value="full">Full Access</option>
            </select>
          </div>
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
              Access Expiry
            </label>
            <input
              type="date"
              id="expiry"
              name="expiry"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}