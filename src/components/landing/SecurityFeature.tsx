import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Lock, Key, UserCheck } from 'lucide-react';

interface SecurityFeatureProps {
  title: string;
  description: string;
  icon: 'rbac' | 'gdpr' | 'hipaa' | 'encryption';
  delay: number;
}

export function SecurityFeature({ title, description, icon, delay }: SecurityFeatureProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const icons = {
    rbac: UserCheck,
    gdpr: Shield,
    hipaa: Lock,
    encryption: Key,
  };

  const Icon = icons[icon];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}