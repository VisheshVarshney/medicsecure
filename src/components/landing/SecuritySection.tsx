import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Lock, Key, UserCheck, Database, FileCheck, Bell, RefreshCw } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import velocity from 'velocity-animate';

export function SecuritySection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categories = [
    {
      title: "Data Encryption",
      icon: Lock,
      description: "Military-grade protection for your sensitive health information",
      features: [
        "End-to-End Encryption",
        "AES-256 Encryption",
        "Secure Key Management",
        "Zero-Knowledge Architecture"
      ],
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        animation: "slide-and-fade"
      }
    },
    {
      title: "Access Control",
      icon: UserCheck,
      description: "Granular control over who can access your medical records",
      features: [
        "Role-Based Access",
        "Multi-Factor Authentication",
        "Session Management",
        "Access Logs"
      ],
      style: {
        background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        animation: "scale-in"
      }
    },
    {
      title: "Compliance Standards",
      icon: Shield,
      description: "Meeting and exceeding healthcare privacy requirements",
      features: [
        "HIPAA Compliance",
        "GDPR Requirements",
        "Regular Audits",
        "Privacy Impact Assessments"
      ],
      style: {
        background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        animation: "rotate-in"
      }
    },
    {
      title: "Data Protection",
      icon: Database,
      description: "Comprehensive safeguards for your medical data",
      features: [
        "Automated Backups",
        "Disaster Recovery",
        "Version Control",
        "Data Integrity Checks"
      ],
      style: {
        background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        animation: "bounce-in"
      }
    }
  ];

  const getAnimation = (type: string, inView: boolean) => {
    switch (type) {
      case 'slide-and-fade':
        return {
          initial: { x: -100, opacity: 0 },
          animate: inView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 },
          transition: { type: "spring", stiffness: 100, damping: 20 }
        };
      case 'scale-in':
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 },
          transition: { type: "spring", stiffness: 200, damping: 15 }
        };
      case 'rotate-in':
        return {
          initial: { rotate: -180, opacity: 0 },
          animate: inView ? { rotate: 0, opacity: 1 } : { rotate: -180, opacity: 0 },
          transition: { type: "spring", stiffness: 150, damping: 25 }
        };
      case 'bounce-in':
        return {
          initial: { y: 100, opacity: 0 },
          animate: inView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 },
          transition: { type: "spring", stiffness: 300, damping: 10 }
        };
      default:
        return {};
    }
  };

  return (
    <div className="py-20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-24">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              {...getAnimation(category.style.animation, inView)}
              className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
            >
              <div style={{ background: category.style.background }} className="p-8">
                <div className="flex items-start justify-between">
                  <div className="text-white">
                    <h3 className="text-3xl font-bold mb-4">{category.title}</h3>
                    <p className="text-lg opacity-90 mb-8">{category.description}</p>
                  </div>
                  <category.icon className="h-12 w-12 text-white opacity-80" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {category.features.map((feature, featureIdx) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: featureIdx * 0.1 }}
                      className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-4"
                    >
                      <span className="text-white font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}