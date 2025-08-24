import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Coins, Calendar, Star, Award, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Complete your first task', icon: Target, earned: true, date: '2024-01-15' },
    { id: 2, title: 'Coin Collector', description: 'Earn 1,000 coins', icon: Coins, earned: true, date: '2024-01-16' },
    { id: 3, title: 'Week Warrior', description: 'Login for 7 days straight', icon: Calendar, earned: true, date: '2024-01-22' },
    { id: 4, title: 'Game Master', description: 'Play 10 different games', icon: Trophy, earned: false, progress: 7 },
    { id: 5, title: 'Social Butterfly', description: 'Add 5 friends', icon: User, earned: false, progress: 3 },
    { id: 6, title: 'High Roller', description: 'Earn 10,000 coins', icon: Star, earned: false, progress: user?.coins || 0, total: 10000 }
  ];

  const stats = [
    { label: 'Total Coins Earned', value: (user?.coins || 0) + 2340, icon: Coins, color: 'text-yellow-400' },
    { label: 'Games Played', value: 47, icon: Trophy, color: 'text-purple-400' },
    { label: 'Tasks Completed', value: 156, icon: Target, color: 'text-green-400' },
    { label: 'Current Streak', value: user?.streak || 0, suffix: ' days', icon: Calendar, color: 'text-orange-400' },
    { label: 'Friends', value: 12, icon: User, color: 'text-blue-400' },
    { label: 'Achievements', value: achievements.filter(a => a.earned).length, suffix: `/${achievements.length}`, icon: Award, color: 'text-pink-400' }
  ];

  const recentActivity = [
    { type: 'game', description: 'Completed Puzzle Master', coins: 75, time: '2 hours ago' },
    { type: 'task', description: 'Daily login streak', coins: 50, time: '1 day ago' },
    { type: 'achievement', description: 'Unlocked "Week Warrior"', coins: 200, time: '2 days ago' },
    { type: 'friend', description: 'CoinMaster sent you a challenge', coins: 0, time: '3 days ago' },
    { type: 'shop', description: 'Redeemed $5 Amazon card', coins: -1000, time: '1 week ago' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'game': return '🎮';
      case 'task': return '✅';
      case 'achievement': return '🏆';
      case 'friend': return '👥';
      case 'shop': return '🛒';
      default: return '📌';
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
        <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
          {user?.username?.[0]?.toUpperCase() || 'U'}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
          {user?.username}
        </h1>
        <div className="flex items-center justify-center space-x-6 text-gray-400">
          <span>Level {user?.level}</span>
          <span>•</span>
          <span>Joined {new Date(user?.joinedAt || '').toLocaleDateString()}</span>
          <span>•</span>
          <span>Rank #{user?.rank}</span>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center space-x-4"
      >
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'activity', label: 'Recent Activity', icon: Calendar }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-gray-500/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-3 mb-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <h3 className="text-lg font-semibold text-white">{stat.label}</h3>
              </div>
              <p className="text-3xl font-bold text-white">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                <span className="text-lg text-gray-400">{stat.suffix || ''}</span>
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                achievement.earned
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/40'
                  : 'bg-black/40 border-gray-700/50 hover:border-gray-500/50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full ${
                  achievement.earned ? 'bg-yellow-500/20' : 'bg-gray-700/50'
                }`}>
                  <achievement.icon className={`w-8 h-8 ${
                    achievement.earned ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-bold ${
                      achievement.earned ? 'text-white' : 'text-gray-300'
                    }`}>
                      {achievement.title}
                    </h3>
                    {achievement.earned && (
                      <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full">
                        EARNED
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">{achievement.description}</p>
                  
                  {achievement.earned ? (
                    <p className="text-sm text-gray-500">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  ) : achievement.progress !== undefined && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {achievement.progress}/{achievement.total || 10}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(achievement.progress / (achievement.total || 10)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                className="flex items-center space-x-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-800/50 transition-colors"
              >
                <div className="text-2xl">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.description}</p>
                  <p className="text-gray-400 text-sm">{activity.time}</p>
                </div>
                {activity.coins !== 0 && (
                  <div className={`flex items-center space-x-1 font-bold ${
                    activity.coins > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <Coins className="w-4 h-4" />
                    <span>{activity.coins > 0 ? '+' : ''}{activity.coins}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}