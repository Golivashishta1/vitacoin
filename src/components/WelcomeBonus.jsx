import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CoinAnimation from './CoinAnimation';

export default function WelcomeBonus() {
  const { hideWelcomeBonus } = useAuth();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={hideWelcomeBonus}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-black rounded-2xl p-10 max-w-md w-full text-center relative shadow-xl"
        >
          {/* Close button */}
          <button
            onClick={hideWelcomeBonus}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white-900 mb-6">
            Welcome Bonus 🎉
          </h1>

          {/* Coin Animation */}
          <div className="flex justify-center mb-6">
            <CoinAnimation size="large" />
          </div>

          {/* Bonus Amount */}
          <div className="mb-6">
            <p className="text-5xl font-extrabold text-yellow-500 mb-2">1000</p>
            <p className="text-base text-gray-600">Bonus Coins Added</p>
          </div>

          {/* Description */}
          <p className="text-gray-500 mb-10 leading-relaxed">
            To get you started, we’ve added{" "}
            <span className="text-yellow-500 font-semibold">1000 coins</span>{" "}
            to your account. Use them to explore Bolt, play games, and unlock rewards.
          </p>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={hideWelcomeBonus}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md"
          >
            Start Earning 🚀
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
