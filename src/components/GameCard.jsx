import React from 'react';
import { motion } from 'framer-motion';
import { Play, Users, Coins, Star } from 'lucide-react';

export default function GameCard({ game }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-yellow-400 bg-yellow-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 w-80"
    >
      <div className="relative overflow-hidden">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Difficulty badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(game.difficulty)}`}>
            {game.difficulty}
          </span>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-yellow-600 hover:bg-yellow-700 text-black p-4 rounded-full shadow-xl"
          >
            <Play className="w-8 h-8 fill-current" />
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
        
        <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{game.players.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.5</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-yellow-400">
            <Coins className="w-5 h-5" />
            <span className="font-bold">{game.coins}</span>
            <span className="text-sm text-gray-400">coins</span>
          </div>
          <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
            Play
          </button>
        </div>
      </div>
    </motion.div>
  );
}