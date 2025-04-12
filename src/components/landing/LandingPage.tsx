import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { AuthSection } from './AuthSection';
import { SecuritySection } from './SecuritySection';
import { CookieConsent } from './CookieConsent';

interface LandingPageProps {
  onAuthModalOpen: (mode: 'signin' | 'signup' | 'doctor' | 'admin') => void;
}

export function LandingPage({ onAuthModalOpen }: LandingPageProps) {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <CookieConsent />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <animated.div style={fadeIn} className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center"
          >
            <img 
              src="https://res.cloudinary.com/dcvmvxbyf/image/upload/v1744473750/pknh0olqodl0ridcigw1.png"
              alt="MedicSecure Logo" 
              className="h-24 w-auto"
            />
          </motion.div>
          
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
            MedicSecure
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, seamless, and smart healthcare record management for the modern age.
            Your health data, protected by industry-leading security.
          </p>
        </animated.div>
      </div>

      {/* Authentication Section */}
      <AuthSection onAuthModalOpen={onAuthModalOpen} />

      {/* Security Features */}
      <SecuritySection />
    </div>
  );
}