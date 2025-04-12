import React from 'react';
import { User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavigationProps {
  user: User;
  onSignOut: () => void;
}

export function Navigation({ user, onSignOut }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dcvmvxbyf/image/upload/v1744473750/pknh0olqodl0ridcigw1.png"
              alt="MedicSecure Logo" 
              className="h-8 w-auto"
            />
            <span className="ml-2 text-xl font-semibold text-gray-900">
              MedicSecure
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="ml-2 text-sm font-medium text-gray-700">
                {user.full_name}
              </span>
            </div>
            <button
              onClick={onSignOut}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}