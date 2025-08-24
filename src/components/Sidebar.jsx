import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Gamepad2, 
  ShoppingBag, 
  Users, 
  Trophy, 
  Settings, 
  User,
  LogOut,
  Coins
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/games', icon: Gamepad2, label: 'Games' },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-gray-700/50 z-50"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 border-b border-gray-700/50"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Bolt
          </h1>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 border-b border-gray-700/50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-lg">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-white font-semibold">{user?.username}</p>
              <p className="text-gray-400 text-sm">Level {user?.level}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2 bg-yellow-500/10 px-3 py-2 rounded-lg">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-400 font-bold">{user?.coins?.toLocaleString() || 0}</span>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 text-yellow-400 shadow-lg shadow-yellow-500/10'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </NavLink>
              </motion.div>
            );
          })}
        </div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 border-t border-gray-700/50"
        >
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-all duration-200 w-full"
          >
            <LogOut className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}