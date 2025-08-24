import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Coins, Star, Crown } from 'lucide-react';

export default function ShopCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-300 w-80"
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex space-x-2">
          {item.popular && (
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold rounded-full flex items-center space-x-1">
              <Crown className="w-3 h-3" />
              <span>POPULAR</span>
            </span>
          )}
          {item.discount > 0 && (
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold rounded-full">
              -{item.discount}%
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-yellow-400">
              <Coins className="w-5 h-5" />
              <span className="text-xl font-bold">{item.coins.toLocaleString()}</span>
            </div>
            {item.discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {(item.coins / (1 - item.discount / 100)).toFixed(0)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">4.8</span>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Redeem Now</span>
        </button>
      </div>
    </motion.div>
  );
}