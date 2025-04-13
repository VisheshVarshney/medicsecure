import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DoctorAuthModalProps {
  onClose: () => void;
}

export function DoctorAuthModal({ onClose }: DoctorAuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simple hardcoded check
    if (email === 'jamesmiller@medic.com' && password === 'doctor123') {
      navigate('/doctor-dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          layoutId="auth-modal"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <motion.h2 
                className="text-2xl font-bold text-gray-900"
                layoutId="auth-title"
              >
                Doctor Login
              </motion.h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"
              >
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <motion.form
              key="login-form"
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-sm text-center text-gray-600">
                For authorized doctors only. Please contact the administrator if you need assistance.
              </p>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}