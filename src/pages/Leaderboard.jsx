import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Coins, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState('all-time');

  const leaderboardData = {
    'all-time': [
      { rank: 1, username: 'CoinMaster', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', coins: 45620, level: 25, change: 0 },
      { rank: 2, username: 'GoldRush', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', coins: 38430, level: 22, change: 1 },
      { rank: 3, username: 'BoltKing', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', coins: 32150, level: 19, change: -1 },
      { rank: 4, username: 'SpeedRunner', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg', coins: 28890, level: 18, change: 2 },
      { rank: 5, username: 'PuzzlePro', avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg', coins: 26543, level: 17, change: -1 },
      { rank: 6, username: 'CryptoNinja', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg', coins: 24321, level: 16, change: 0 },
      { rank: 7, username: 'GameChanger', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', coins: 22156, level: 15, change: 3 },
      { rank: 8, username: 'TaskMaster', avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg', coins: 19876, level: 14, change: -1 }
    ],
    'weekly': [
      { rank: 1, username: 'SpeedRunner', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg', coins: 3420, level: 18, change: 3 },
      { rank: 2, username: 'GoldRush', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', coins: 3210, level: 22, change: 0 },
      { rank: 3, username: 'CoinMaster', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', coins: 2980, level: 25, change: -2 },
      { rank: 4, username: 'TaskMaster', avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg', coins: 2750, level: 14, change: 4 },
      { rank: 5, username: 'PuzzlePro', avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg', coins: 2543, level: 17, change: 0 }
    ],
    'monthly': [
      { rank: 1, username: 'CoinMaster', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', coins: 12620, level: 25, change: 0 },
      { rank: 2, username: 'GoldRush', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', coins: 11430, level: 22, change: 0 },
      { rank: 3, username: 'GameChanger', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', coins: 10890, level: 15, change: 4 },
      { rank: 4, username: 'SpeedRunner', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg', coins: 9876, level: 18, change: 0 },
      { rank: 5, username: 'BoltKing', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg', coins: 8650, level: 19, change: -2 }
    ]
  };

  const currentData = leaderboardData[timeFrame];
  const userRank = user?.rank || 42;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-500" />;
      case 2: return <Medal className="w-8 h-8 text-gray-400" />;
      case 3: return <Medal className="w-8 h-8 text-amber-600" />;
      default: return <div className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold">#{rank}</div>;
    }
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-600 rounded-full"></div>;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent mb-2">
          Leaderboard
        </h1>
        <p className="text-gray-400">Compete with players worldwide and climb to the top!</p>
      </motion.div>

      {/* Time Frame Selector */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center space-x-4"
      >
        {[
          { id: 'all-time', label: 'All Time', icon: Trophy },
          { id: 'monthly', label: 'This Month', icon: Calendar },
          { id: 'weekly', label: 'This Week', icon: TrendingUp }
        ].map((frame) => (
          <button
            key={frame.id}
            onClick={() => setTimeFrame(frame.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              timeFrame === frame.id
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
            }`}
          >
            <frame.icon className="w-5 h-5" />
            <span>{frame.label}</span>
          </button>
        ))}
      </motion.div>

      {/* User's Current Position */}
      {userRank > 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-black font-bold">
              #{userRank}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{user?.username} (You)</h3>
              <p className="text-gray-300">Level {user?.level}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-yellow-400">
                <Coins className="w-5 h-5" />
                <span className="text-xl font-bold">{user?.coins?.toLocaleString() || 0}</span>
              </div>
              <p className="text-gray-400 text-sm">Your current coins</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-6 mb-8"
      >
        {currentData.slice(0, 3).map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`relative ${
              index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
            }`}
          >
            <div className={`bg-gradient-to-br p-6 rounded-2xl text-center relative ${
              player.rank === 1 ? 'from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40' :
              player.rank === 2 ? 'from-gray-400/20 to-gray-600/20 border-2 border-gray-400/40' :
              'from-amber-600/20 to-amber-800/20 border-2 border-amber-600/40'
            }`}>
              {player.rank === 1 && (
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <Crown className="w-8 h-8 text-yellow-500" />
                </motion.div>
              )}
              
              <img
                src={player.avatar}
                alt={player.username}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-current"
              />
              <h3 className="text-xl font-bold text-white mb-1">{player.username}</h3>
              <p className="text-gray-300 mb-3">Level {player.level}</p>
              <div className="flex items-center justify-center space-x-1 text-yellow-400">
                <Coins className="w-5 h-5" />
                <span className="text-lg font-bold">{player.coins.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Top Players</span>
          </h2>
        </div>
        
        <div className="divide-y divide-gray-700/30">
          {currentData.map((player, index) => (
            <motion.div
              key={`${player.username}-${timeFrame}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`p-6 hover:bg-gray-800/30 transition-all duration-200 ${
                player.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center min-w-[50px]">
                  {getRankIcon(player.rank)}
                </div>
                
                <img
                  src={player.avatar}
                  alt={player.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{player.username}</h3>
                    {getChangeIcon(player.change)}
                    {player.change !== 0 && (
                      <span className={`text-sm font-medium ${
                        player.change > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {Math.abs(player.change)}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400">Level {player.level}</p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Coins className="w-5 h-5" />
                    <span className="text-xl font-bold">{player.coins.toLocaleString()}</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {timeFrame === 'all-time' ? 'total coins' : `${timeFrame} coins`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}