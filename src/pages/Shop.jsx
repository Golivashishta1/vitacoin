import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Coins, Star, Crown, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Shop() {
  const { user, updateCoins } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items', icon: ShoppingBag },
    { id: 'gift-cards', name: 'Gift Cards', icon: Gift },
    { id: 'subscriptions', name: 'Subscriptions', icon: Crown },
    { id: 'crypto', name: 'Crypto', icon: Coins }
  ];

  const shopItems = [
    {
      id: 1,
      title: '$10 Amazon Gift Card',
      category: 'gift-cards',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg',
      coins: 2000,
      originalCoins: 2200,
      discount: 10,
      popular: true,
      rating: 4.9,
      purchases: 2341,
      description: 'Perfect for shopping on Amazon'
    },
    {
      id: 2,
      title: '$5 Starbucks Card',
      category: 'gift-cards',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
      coins: 1000,
      originalCoins: 1000,
      discount: 0,
      popular: false,
      rating: 4.7,
      purchases: 1876,
      description: 'Enjoy your favorite coffee'
    },
    {
      id: 3,
      title: 'Netflix 1 Month',
      category: 'subscriptions',
      image: 'https://images.pexels.com/photos/1353368/pexels-photo-1353368.jpeg',
      coins: 2500,
      originalCoins: 2950,
      discount: 15,
      popular: true,
      rating: 4.8,
      purchases: 1543,
      description: 'Stream unlimited movies & shows'
    },
    {
      id: 4,
      title: 'Spotify Premium',
      category: 'subscriptions',
      image: 'https://images.pexels.com/photos/3971985/pexels-photo-3971985.jpeg',
      coins: 1500,
      originalCoins: 1500,
      discount: 0,
      popular: false,
      rating: 4.6,
      purchases: 987,
      description: 'Ad-free music streaming'
    },
    {
      id: 5,
      title: '0.01 Bitcoin',
      category: 'crypto',
      image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg',
      coins: 15000,
      originalCoins: 16000,
      discount: 5,
      popular: true,
      rating: 4.9,
      purchases: 234,
      description: 'Cryptocurrency investment'
    },
    {
      id: 6,
      title: '$25 PayPal Cash',
      category: 'gift-cards',
      image: 'https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg',
      coins: 5000,
      originalCoins: 5000,
      discount: 0,
      popular: false,
      rating: 4.8,
      purchases: 1234,
      description: 'Direct cash to your PayPal'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item) => {
    if (user.coins >= item.coins) {
      updateCoins(-item.coins);
      alert(`Successfully purchased ${item.title}!`);
    } else {
      alert(`Not enough coins! You need ${item.coins - user.coins} more coins.`);
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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent mb-2">
          Shop
        </h1>
        <p className="text-gray-400 mb-4">Redeem your coins for amazing rewards</p>
        <div className="flex items-center justify-center space-x-2 text-yellow-400">
          <Coins className="w-6 h-6" />
          <span className="text-2xl font-bold">{user?.coins?.toLocaleString() || 0}</span>
          <span className="text-gray-400">coins available</span>
        </div>
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
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
            }`}
          >
            <category.icon className="w-5 h-5" />
            <span>{category.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Shop Items Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="group bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300"
          >
            {/* Item Image */}
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
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                    POPULAR
                  </span>
                )}
                {item.discount > 0 && (
                  <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    -{item.discount}%
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{item.rating}</span>
                <span className="text-xs text-gray-300">({item.purchases})</span>
              </div>
            </div>

            {/* Item Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{item.description}</p>
              
              {/* Price */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Coins className="w-5 h-5" />
                    <span className="text-xl font-bold">{item.coins.toLocaleString()}</span>
                  </div>
                  {item.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      {item.originalCoins.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handlePurchase(item)}
                disabled={user?.coins < item.coins}
                className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 ${
                  user?.coins >= item.coins
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-blue-500/25'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{user?.coins >= item.coins ? 'Redeem Now' : 'Not Enough Coins'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* No items message */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </motion.div>
      )}
    </div>
  );
}