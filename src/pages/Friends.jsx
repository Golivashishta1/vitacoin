import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Trophy, Coins, Crown, Swords, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Friends() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('friends');

  const friends = [
    {
      id: 1,
      username: 'CoinMaster',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      coins: 15420,
      level: 12,
      streak: 15,
      online: true,
      rank: 1
    },
    {
      id: 2,
      username: 'GoldRush',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      coins: 12830,
      level: 10,
      streak: 8,
      online: true,
      rank: 2
    },
    {
      id: 3,
      username: 'BoltKing',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      coins: 9650,
      level: 8,
      streak: 12,
      online: false,
      rank: 3
    },
    {
      id: 4,
      username: 'SpeedRunner',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      coins: 7890,
      level: 7,
      streak: 5,
      online: true,
      rank: 4
    },
    {
      id: 5,
      username: 'PuzzlePro',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
      coins: 6543,
      level: 6,
      streak: 3,
      online: false,
      rank: 5
    }
  ];

  const challenges = [
    {
      id: 1,
      from: 'CoinMaster',
      type: 'Coin Collection Race',
      target: 1000,
      reward: 500,
      timeLeft: '2h 30m'
    },
    {
      id: 2,
      from: 'GoldRush',
      type: 'Daily Task Sprint',
      target: 5,
      reward: 300,
      timeLeft: '1d 5h'
    }
  ];

  const leaderboard = [
    ...friends.sort((a, b) => b.coins - a.coins),
    { 
      id: 'user', 
      username: user?.username || 'You', 
      coins: user?.coins || 0, 
      level: user?.level || 1, 
      streak: user?.streak || 0, 
      online: true, 
      rank: user?.rank || 42,
      isCurrentUser: true
    }
  ].sort((a, b) => (a.rank || 999) - (b.rank || 999));

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Crown className="w-6 h-6 text-gray-400" />;
      case 3: return <Crown className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-gray-400 font-bold">#{rank}</span>;
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Friends
        </h1>
        <p className="text-gray-400">Connect, compete, and climb the leaderboard together</p>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center space-x-4"
      >
        {[
          { id: 'friends', label: 'My Friends', icon: Users },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'challenges', label: 'Challenges', icon: Swords }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Add Friend Button */}
          <div className="flex justify-center">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 transform hover:scale-105">
              <UserPlus className="w-5 h-5" />
              <span>Add Friend</span>
            </button>
          </div>

          {/* Friends List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={friend.avatar}
                      alt={friend.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-black ${
                      friend.online ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{friend.username}</h3>
                    <p className="text-sm text-gray-400">Level {friend.level}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Coins:</span>
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Coins className="w-4 h-4" />
                      <span className="font-bold">{friend.coins.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Streak:</span>
                    <span className="text-orange-400 font-bold">{friend.streak} days</span>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium">
                    <Swords className="w-4 h-4 inline mr-1" />
                    Challenge
                  </button>
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors font-medium">
                    <Gift className="w-4 h-4 inline mr-1" />
                    Gift
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-bold text-white text-center">Global Leaderboard</h2>
            </div>
            <div className="space-y-2 p-6">
              {leaderboard.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                    player.isCurrentUser
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                      : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-center w-10">
                    {getRankIcon(player.rank)}
                  </div>
                  
                  {player.isCurrentUser ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
                      {player.username[0]}
                    </div>
                  ) : (
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h3 className={`font-bold ${player.isCurrentUser ? 'text-yellow-400' : 'text-white'}`}>
                      {player.username}
                      {player.isCurrentUser && <span className="text-sm text-gray-400 ml-2">(You)</span>}
                    </h3>
                    <p className="text-sm text-gray-400">Level {player.level}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-yellow-400">
                      <Coins className="w-4 h-4" />
                      <span className="font-bold">{player.coins.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-400">{player.streak} day streak</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Challenges */}
            <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Swords className="w-6 h-6 mr-2 text-red-500" />
                Active Challenges
              </h2>
              
              {challenges.length > 0 ? (
                <div className="space-y-4">
                  {challenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white">{challenge.type}</h3>
                        <span className="text-sm text-red-400 font-medium">{challenge.timeLeft} left</span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">Challenged by {challenge.from}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Target: {challenge.target}</span>
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Coins className="w-4 h-4" />
                          <span className="font-bold">{challenge.reward}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                          Accept
                        </button>
                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                          Decline
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Swords className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No active challenges</p>
                </div>
              )}
            </div>

            {/* Challenge History */}
            <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                Recent Results
              </h2>
              
              <div className="space-y-4">
                {[
                  { opponent: 'CoinMaster', type: 'Speed Challenge', result: 'Won', coins: 200 },
                  { opponent: 'GoldRush', type: 'Puzzle Race', result: 'Lost', coins: -50 },
                  { opponent: 'BoltKing', type: 'Daily Tasks', result: 'Won', coins: 150 }
                ].map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-xl ${
                      result.result === 'Won' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-white">{result.type}</h3>
                        <p className="text-sm text-gray-400">vs {result.opponent}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${result.result === 'Won' ? 'text-green-400' : 'text-red-400'}`}>
                          {result.result}
                        </p>
                        <div className={`flex items-center space-x-1 ${result.coins > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <Coins className="w-4 h-4" />
                          <span className="font-bold">{result.coins > 0 ? '+' : ''}{result.coins}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}