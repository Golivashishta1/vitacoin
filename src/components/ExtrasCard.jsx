import React from 'react';
import { motion } from 'framer-motion';

export default function ExtrasCard({ extra }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300"
    >
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${extra.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <extra.icon className="w-8 h-8 text-white" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{extra.title}</h3>
      <p className="text-gray-400 text-sm mb-6">{extra.description}</p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full bg-gradient-to-r ${extra.color} hover:shadow-lg text-white font-semibold py-3 rounded-lg transition-all duration-200`}
      >
        {extra.action}
      </motion.button>
    </motion.div>
  );
}