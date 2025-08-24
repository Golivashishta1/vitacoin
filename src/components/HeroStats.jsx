import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Target, CheckCircle, TrendingUp, Flame, Trophy } from 'lucide-react';
import CoinCounter from './CoinCounter';

export default function HeroStats({ user }) {
  const stats = [
    {
      icon: Coins,
      label: 'Total Coins',
      value: user?.coins || 0,
      color: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-500'
    },
    {
      icon: Target,
      label: 'Daily Tasks',
      value: `${user?.dailyTasks || 0}/5`,
      color: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-500'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: user?.completedTasks || 0,
      color: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-500'
    },
    {
      icon: Flame,
      label: 'Streak',
      value: `${user?.streak || 0} days`,
      color: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-500'
    },
    {
      icon: Trophy,
      label: 'Rank',
      value: `#${user?.rank || 999}`,
      color: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-500'
    }
  ];

  return (
    <section className="px-8 py-12 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-gray-400">Your gaming dashboard awaits</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
              <TrendingUp className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-white text-2xl font-bold">
                {typeof stat.value === 'number' ? (
                  <CoinCounter value={stat.value} />
                ) : (
                  stat.value
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}