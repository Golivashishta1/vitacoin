import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'medium', color = 'text-white' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-2 border-transparent border-t-current rounded-full ${color}`}
      />
    </div>
  );
}