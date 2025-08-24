import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Target, CheckCircle, Trophy, Play, ShoppingCart, Gift, Shuffle, Gamepad2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import HeroStats from '../components/HeroStats';
import GameCard from '../components/GameCard';
import TaskCard from '../components/TaskCard';
import ShopCard from '../components/ShopCard';
import ExtrasCard from '../components/ExtrasCard';

export default function Home() {
  const { user } = useAuth();

  const games = [
    {
      id: 1,
      title: 'Coin Collector',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      coins: 50,
      difficulty: 'Easy',
      players: 1247
    },
    {
      id: 2,
      title: 'Puzzle Master',
      image: 'https://images.pexels.com/photos/276452/pexels-photo-276452.jpeg',
      coins: 75,
      difficulty: 'Medium',
      players: 892
    },
    {
      id: 3,
      title: 'Speed Runner',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
      coins: 100,
      difficulty: 'Hard',
      players: 634
    },
    {
      id: 4,
      title: 'Memory Game',
      image: 'https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg',
      coins: 60,
      difficulty: 'Easy',
      players: 1156
    }
  ];

  const tasks = [
    {
      id: 1,
      title: 'Complete 3 Games',
      description: 'Play any 3 games to completion',
      coins: 150,
      progress: 2,
      total: 3,
      type: 'daily'
    },
    {
      id: 2,
      title: 'Login Streak',
      description: 'Maintain your daily login streak',
      coins: 100,
      progress: 7,
      total: 7,
      type: 'daily'
    },
    {
      id: 3,
      title: 'Invite Friends',
      description: 'Invite 2 friends to join Bolt',
      coins: 500,
      progress: 0,
      total: 2,
      type: 'weekly'
    },
    {
      id: 4,
      title: 'Spend Coins',
      description: 'Purchase any item from shop',
      coins: 200,
      progress: 0,
      total: 1,
      type: 'weekly'
    }
  ];

  const shopItems = [
    {
      id: 1,
      title: '$10 Amazon Gift Card',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
      coins: 2000,
      discount: 10,
      popular: true
    },
    {
      id: 2,
      title: '$5 Starbucks Card',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
      coins: 1000,
      discount: 0,
      popular: false
    },
    {
      id: 3,
      title: 'Netflix 1 Month',
      image: 'https://images.pexels.com/photos/1353368/pexels-photo-1353368.jpeg',
      coins: 2500,
      discount: 15,
      popular: true
    },
    {
      id: 4,
      title: 'Spotify Premium',
      image: 'https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg',
      coins: 1500,
      discount: 0,
      popular: false
    }
  ];

  const extras = [
    {
      id: 1,
      title: 'Mystery Box',
      description: 'Random coins 100-1000',
      icon: Gift,
      color: 'from-yellow-500 to-yellow-600',
      action: 'Open Box'
    },
    {
      id: 2,
      title: 'Spin Wheel',
      description: 'Spin for bonus coins',
      icon: Shuffle,
      color: 'from-yellow-500 to-yellow-600',
      action: 'Spin Now'
    },
    {
      id: 3,
      title: 'Referral Bonus',
      description: 'Earn 1000 per friend',
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      action: 'Invite'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Stats Section */}
      <HeroStats user={user} />

      {/* Games Section */}
      <section className="px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 mb-8"
        >
          <Gamepad2 className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-white">Games</h2>
          <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-sm">
            Earn coins by playing
          </span>
        </motion.div>
        
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tasks Section */}
      <section className="px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 mb-8"
        >
          <CheckCircle className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-white">Tasks</h2>
          <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-sm">
            Daily & Weekly Missions
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TaskCard task={task} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shop Section */}
      <section className="px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 mb-8"
        >
          <ShoppingCart className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-white">Shop</h2>
          <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-sm">
            Redeem your coins
          </span>
        </motion.div>
        
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {shopItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <ShopCard item={item} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Extras Section */}
      <section className="px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 mb-8"
        >
          <Gift className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold text-white">Extras</h2>
          <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-sm">
            Bonus opportunities
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {extras.map((extra, index) => (
            <motion.div
              key={extra.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ExtrasCard extra={extra} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}