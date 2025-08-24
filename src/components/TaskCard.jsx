import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Calendar, Clock } from 'lucide-react';

export default function TaskCard({ task }) {
  const isCompleted = task.progress >= task.total;
  const progressPercentage = (task.progress / task.total) * 100;

  const getTypeColor = (type) => {
    switch (type) {
      case 'daily': return 'from-yellow-500 to-yellow-600';
      case 'weekly': return 'from-yellow-500 to-yellow-600';
      default: return 'from-yellow-500 to-yellow-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'daily': return Calendar;
      case 'weekly': return Clock;
      default: return Calendar;
    }
  };

  const TypeIcon = getTypeIcon(task.type);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className={`group bg-black/40 backdrop-blur-xl border rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 ${
        isCompleted ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-gray-700/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(task.type)} bg-opacity-20`}>
          <TypeIcon className="w-6 h-6 text-yellow-400" />
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
          {task.type.toUpperCase()}
        </span>
      </div>

      <h3 className={`text-lg font-bold mb-2 ${isCompleted ? 'text-yellow-400' : 'text-white'}`}>
        {task.title}
      </h3>
      <p className="text-gray-400 text-sm mb-4">{task.description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className={`font-bold ${isCompleted ? 'text-yellow-400' : 'text-white'}`}>
            {task.progress}/{task.total}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2 rounded-full ${
              isCompleted 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
            }`}
          />
        </div>
      </div>

      {/* Reward */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-yellow-400">
          <Coins className="w-5 h-5" />
          <span className="font-bold">{task.coins}</span>
          <span className="text-sm text-gray-400">reward</span>
        </div>
        <button
          disabled={isCompleted}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isCompleted
              ? 'bg-yellow-600 text-black cursor-default'
              : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black transform hover:scale-105'
          }`}
        >
          {isCompleted ? 'Complete!' : 'Start'}
        </button>
      </div>
    </motion.div>
  );
}