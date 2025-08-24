import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Play, Users, Clock, Star } from 'lucide-react';

export default function Games() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Games', count: 12 },
    { id: 'arcade', name: 'Arcade', count: 5 },
    { id: 'puzzle', name: 'Puzzle', count: 4 },
    { id: 'strategy', name: 'Strategy', count: 3 }
  ];

  const games = [
    {
      id: 1,
      title: 'Coin Collector',
      category: 'arcade',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      coins: 50,
      difficulty: 'Easy',
      players: 1247,
      rating: 4.5,
      duration: '5-10 min',
      description: 'Collect golden coins while avoiding obstacles'
    },
    {
      id: 2,
      title: 'Puzzle Master',
      category: 'puzzle',
      image: 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg',
      coins: 75,
      difficulty: 'Medium',
      players: 892,
      rating: 4.7,
      duration: '10-15 min',
      description: 'Solve challenging puzzles to unlock rewards'
    },
    {
      id: 3,
      title: 'Speed Runner',
      category: 'arcade',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      coins: 100,
      difficulty: 'Hard',
      players: 634,
      rating: 4.3,
      duration: '3-8 min',
      description: 'Race against time in this fast-paced runner'
    },
    {
      id: 4,
      title: 'Memory Game',
      category: 'puzzle',
      image: 'https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg',
      coins: 60,
      difficulty: 'Easy',
      players: 1156,
      rating: 4.6,
      duration: '5-12 min',
      description: 'Test your memory with colorful patterns'
    },
    {
      id: 5,
      title: 'Tower Defense',
      category: 'strategy',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      coins: 120,
      difficulty: 'Hard',
      players: 456,
      rating: 4.8,
      duration: '15-25 min',
      description: 'Defend your base against waves of enemies'
    },
    {
      id: 6,
      title: 'Color Match',
      category: 'puzzle',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      coins: 40,
      difficulty: 'Easy',
      players: 892,
      rating: 4.2,
      duration: '3-7 min',
      description: 'Match colors in this relaxing puzzle game'
    }
  ];

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-yellow-400 bg-yellow-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
          Games
        </h1>
        <p className="text-gray-400">Play games and earn coins!</p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </motion.div>

      {/* Games Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="group bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300"
          >
            {/* Game Image */}
            <div className="relative overflow-hidden">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{game.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{game.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{game.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{game.players.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-yellow-400 font-bold">
                  <span>{game.coins}</span>
                  <Gamepad2 className="w-4 h-4" />
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Play Now</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No games message */}
      {filteredGames.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Gamepad2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No games found</h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </motion.div>
      )}
    </div>
  );
}