import React from 'react';
import { motion } from 'framer-motion';

export default function CoinAnimation({ 
  size = 'medium', 
  className = '', 
  coinSrc = 'src/components/coin.png' // your custom PNG path
}) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-200 h-200',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Spinning coin image */}
      <motion.img
        src={coinSrc}
        alt="Coin"
        className={`object-contain ${sizeClasses[size]}`}
        animate={{
          rotateY: [0, 360],   // flip around Y axis
          scale: [1, 1.05, 1] // little bounce effect
        }}
        transition={{
          rotateY: {
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        style={{
          transformStyle: "preserve-3d", // enables 3D flip look
          backfaceVisibility: "hidden"   // avoids seeing backside blur
        }}
      />

      {/* Optional glowing ring */}
      <motion.div
        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        className={`absolute rounded-full border-2 border-yellow-400 ${sizeClasses[size]}`}
      />
    </div>
  );
}
