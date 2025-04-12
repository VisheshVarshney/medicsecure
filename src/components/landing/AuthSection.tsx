import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Stethoscope, ShieldCheck } from 'lucide-react';

interface AuthSectionProps {
  onAuthModalOpen: (mode: 'signin' | 'signup' | 'doctor' | 'admin') => void;
}

export function AuthSection({ onAuthModalOpen }: AuthSectionProps) {
  return (
    <div className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Patient Authentication */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Patient Portal</h3>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAuthModalOpen('signin')}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAuthModalOpen('signup')}
                className="w-full flex items-center justify-center px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Create New Account
              </motion.button>
            </div>
          </motion.div>

          {/* Healthcare Provider Authentication */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Healthcare Providers</h3>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAuthModalOpen('doctor')}
                className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Stethoscope className="h-5 w-5 mr-2" />
                Doctor Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAuthModalOpen('admin')}
                className="w-full flex items-center justify-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <ShieldCheck className="h-5 w-5 mr-2" />
                Administrator Access
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}