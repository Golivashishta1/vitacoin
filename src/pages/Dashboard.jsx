import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Flame, CheckSquare, Gamepad2, ShoppingBag, Trophy, Gift, Users, Zap, ShipWheel as Wheel } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CoinCounter from '../components/CoinCounter';
import ProgressRing from '../components/ProgressRing';

export default function Dashboard() {
  const { user } = useAuth();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
          Dashboard
        </h1>
        <p className="text-gray-400">Welcome back, {user?.username}!</p>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Hero Card - Total Coins (2x2) */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-8 backdrop-blur-xl hover:border-yellow-500/40 transition-all duration-300 group"
        >
          <div className="text-center space-y-6">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Coins className="w-24 h-24 text-yellow-500 mx-auto drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300" />
            </motion.div>
            <div>
              <CoinCounter value={user?.coins || 0} className="text-6xl font-bold text-white mb-2" />
              <p className="text-xl text-gray-400">Your lifetime earnings 🚀</p>
            </div>
            <div className="pt-4 border-t border-yellow-500/20">
              <p className="text-sm text-gray-500">Level {user?.level} • Rank #{user?.rank}</p>
            </div>
          </div>
        </motion.div>

        {/* Streaks Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-black/40 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-xl hover:border-yellow-500/40 transition-all duration-300"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <ProgressRing 
                progress={(user?.streak || 0) / 30 * 100} 
                size={80}
                color="text-yellow-500"
              >
                <Flame className="w-8 h-8 text-yellow-500" />
              </ProgressRing>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{user?.streak || 0} Days</h3>
              <p className="text-yellow-400 font-medium">Fire Streak 🔥</p>
              <p className="text-sm text-gray-500 mt-2">Don't break your streak!</p>
            </div>
          </div>
        </motion.div>

        {/* Tasks Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="bg-black/40 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-xl hover:border-yellow-500/40 transition-all duration-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CheckSquare className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">{user?.dailyTasks || 0}/5</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Daily Tasks</h3>
              <p className="text-yellow-400 text-sm">Complete to earn coins</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((user?.dailyTasks || 0) / 5) * 100}%` }}
              ></div>
            </div>
            <button className="w-full text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
              View All Tasks →
            </button>
          </div>
        </motion.div>

        {/* Games Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="bg-black/40 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-xl hover:border-yellow-500/40 transition-all duration-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Gamepad2 className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">{user?.gamesPlayed || 0}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Games Today</h3>
              <p className="text-yellow-400 text-sm">Play to earn rewards</p>
            </div>
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 bg-yellow-500/20 rounded border border-yellow-500/40"></div>
              ))}
            </div>
            <button className="w-full text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
              Play Now →
            </button>
          </div>
        </motion.div>

        {/* Shop Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="bg-black/40 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-xl hover:border-yellow-500/40 transition-all duration-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <ShoppingBag className="w-8 h-8 text-yellow-500" />
              <span className="text-sm text-yellow-400 font-medium">500 coins</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Next Reward</h3>
              <p className="text-yellow-400 text-sm">Amazon Gift Card</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(((user?.coins || 0) / 500) * 100, 100)}%` }}
              ></div>
            </div>
            <button className="w-full text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
              Browse Shop →
            </button>
          </div>
        </motion.div>

        {/* Leaderboard Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="bg-black/40 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur-xl hover:border-yellow-500/40 transition-all duration-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-white">#{user?.rank || 999}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Your Rank</h3>
              <p className="text-yellow-400 text-sm">Global leaderboard</p>
            </div>
            <div className="space-y-2">
              {[
                { name: 'CoinMaster', coins: 15420 },
                { name: 'GoldRush', coins: 12830 },
                { name: 'BoltKing', coins: 9650 }
              ].map((player, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">#{i + 1} {player.name}</span>
                  <span className="text-yellow-400">{player.coins.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

              {/* Quick Actions Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: Wheel, label: 'Spin Wheel', color: 'from-yellow-500 to-yellow-600' },
            { icon: Gift, label: 'Daily Bonus', color: 'from-yellow-500 to-yellow-600' },
            { icon: Users, label: 'Invite Friends', color: 'from-yellow-500 to-yellow-600' },
            { icon: Zap, label: 'Quick Task', color: 'from-yellow-500 to-yellow-600' }
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 bg-gradient-to-r ${action.color} rounded-xl text-white font-medium hover:shadow-lg transition-all duration-200`}
            >
              <action.icon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>
    </div>
  );
}