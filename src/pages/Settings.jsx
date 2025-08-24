import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Volume2, Globe, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      challenges: true,
      achievements: false
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: true,
      allowFriendRequests: true
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      soundEnabled: true,
      volume: 75
    }
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-400">Customize your Bolt experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span>{section.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
            
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <User className="w-6 h-6" />
                  <span>Profile Information</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                    <input
                      type="text"
                      value={user?.level || 1}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Total Coins</label>
                    <input
                      type="text"
                      value={user?.coins?.toLocaleString() || 0}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                      readOnly
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Bell className="w-6 h-6" />
                  <span>Notification Settings</span>
                </h2>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                        <p className="text-sm text-gray-400">
                          {key === 'email' && 'Receive notifications via email'}
                          {key === 'push' && 'Browser push notifications'}
                          {key === 'challenges' && 'Friend challenges and invites'}
                          {key === 'achievements' && 'Achievement and milestone alerts'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Shield className="w-6 h-6" />
                  <span>Privacy Settings</span>
                </h2>
                
                <div className="space-y-4">
                  {Object.entries(settings.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                      <div>
                        <h3 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                        <p className="text-sm text-gray-400">
                          {key === 'profileVisible' && 'Make your profile visible to other players'}
                          {key === 'showOnlineStatus' && 'Show when you are online'}
                          {key === 'allowFriendRequests' && 'Allow others to send friend requests'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Palette className="w-6 h-6" />
                  <span>Preferences</span>
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['dark', 'light'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSettingChange('preferences', 'theme', theme)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 capitalize ${
                            settings.preferences.theme === theme
                              ? 'border-blue-500 bg-blue-500/10'
                              : 'border-gray-600 bg-gray-900/30'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Language</label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-white">Sound Effects</h3>
                        <p className="text-sm text-gray-400">Enable game and UI sounds</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.preferences.soundEnabled}
                        onChange={(e) => handleSettingChange('preferences', 'soundEnabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Volume: {settings.preferences.volume}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.preferences.volume}
                      onChange={(e) => handleSettingChange('preferences', 'volume', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            {activeSection === 'help' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <HelpCircle className="w-6 h-6" />
                  <span>Help & Support</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">FAQ</h3>
                    <p className="text-gray-400 mb-4">Find answers to common questions</p>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      View FAQ →
                    </button>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Contact Support</h3>
                    <p className="text-gray-400 mb-4">Get help from our support team</p>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      Contact Us →
                    </button>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Terms of Service</h3>
                    <p className="text-gray-400 mb-4">Read our terms and conditions</p>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      View Terms →
                    </button>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Privacy Policy</h3>
                    <p className="text-gray-400 mb-4">Learn about data protection</p>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      View Policy →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}