import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function CoinCounter({ value, className = '', duration = 2 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const springValue = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(springValue, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    springValue.set(value);
    
    // Fallback for older browsers or if spring doesn't work
    const timer = setTimeout(() => {
      setDisplayValue(value);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [value, springValue, duration]);

  return (
    <motion.span 
      className={className}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
    >
      {display}
    </motion.span>
  );
}