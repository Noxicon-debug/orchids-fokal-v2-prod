import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Instagram, Facebook, Twitter, MessageCircle, Heart, Share2 } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface SocialComment {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  platform: 'instagram' | 'facebook' | 'twitter';
  timestamp: string;
  likes: number;
  verified?: boolean;
  rating?: number;
}

// Mock data simulating live social media feeds
const mockSocialComments: SocialComment[] = [
  {
    id: '1',
    username: '@sarah_johnson_png',
    displayName: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Just received our corporate video from @fokalltd and WOW! The quality is absolutely incredible. Professional, creative, and exactly what we envisioned. Highly recommend! 🎥✨',
    platform: 'instagram',
    timestamp: '2 hours ago',
    likes: 47,
    verified: false,
    rating: 5
  },
  {
    id: '2',
    username: '@michael_chen_business',
    displayName: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'FOKAL MULTIMEDIA handled our product launch event flawlessly! From photography to videography, every moment was captured perfectly. The team is professional and creative. Thank you! 📸🎬',
    platform: 'facebook',
    timestamp: '4 hours ago',
    likes: 32,
    verified: true,
    rating: 5
  },
  {
    id: '3',
    username: '@jessica_creative',
    displayName: 'Jessica Martinez',
    avatar: 'https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Working with FOKAL on our brand redesign was amazing! They understood our vision and delivered beyond expectations. The new brand identity is perfect! 🎨💼',
    platform: 'twitter',
    timestamp: '6 hours ago',
    likes: 28,
    verified: false,
    rating: 5
  },
  {
    id: '4',
    username: '@david_events_png',
    displayName: 'David Kila',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Best event management team in PNG! FOKAL made our conference seamless and memorable. The attention to detail was outstanding. Will definitely book again! 🏆',
    platform: 'facebook',
    timestamp: '8 hours ago',
    likes: 56,
    verified: false,
    rating: 5
  },
  {
    id: '5',
    username: '@maria_lifestyle',
    displayName: 'Maria Temu',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'The photography session with FOKAL was incredible! They made me feel comfortable and the results are stunning. Professional service with a personal touch! 📷💕',
    platform: 'instagram',
    timestamp: '12 hours ago',
    likes: 73,
    verified: false,
    rating: 5
  },
  {
    id: '6',
    username: '@james_tech_png',
    displayName: 'James Wilson',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'FOKAL created an amazing promotional video for our startup. The storytelling and visual quality exceeded our expectations. Highly professional team! 🚀🎥',
    platform: 'twitter',
    timestamp: '1 day ago',
    likes: 41,
    verified: true,
    rating: 5
  },
  {
    id: '7',
    username: '@lisa_wedding_png',
    displayName: 'Lisa Namaliu',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Our wedding photos and video are absolutely perfect! FOKAL captured every precious moment beautifully. Thank you for making our special day even more memorable! 💒✨',
    platform: 'facebook',
    timestamp: '1 day ago',
    likes: 89,
    verified: false,
    rating: 5
  },
  {
    id: '8',
    username: '@robert_business',
    displayName: 'Robert Agarobe',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Content creation services from FOKAL are top-notch! Our social media engagement has increased significantly since working with them. Creative and strategic! 📈💡',
    platform: 'instagram',
    timestamp: '2 days ago',
    likes: 35,
    verified: false,
    rating: 5
  }
];

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'instagram':
      return <Instagram size={16} className="text-pink-500" />;
    case 'facebook':
      return <Facebook size={16} className="text-blue-500" />;
    case 'twitter':
      return <Twitter size={16} className="text-blue-400" />;
    default:
      return <MessageCircle size={16} className="text-accent-500" />;
  }
};

const SocialTestimonials: React.FC = () => {
  const [currentComments, setCurrentComments] = useState<SocialComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate fetching live social media comments
  const fetchSocialComments = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Randomly select 3 comments from the mock data
    const shuffled = [...mockSocialComments].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    setCurrentComments(selected);
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  // Initial load and set up 5-minute refresh interval
  useEffect(() => {
    fetchSocialComments();
    
    const interval = setInterval(() => {
      fetchSocialComments();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    fetchSocialComments();
  };

  return (
    <div className="space-y-6">
      {/* Header with live indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-2xl font-bold text-white">Live Client Feedback</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-sm font-medium">LIVE</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-dark-400 text-sm">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-accent-500 hover:text-accent-400 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>

      {/* Social Media Comments Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-dark-800 rounded-xl p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-dark-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-dark-700 rounded mb-2"></div>
                    <div className="h-3 bg-dark-700 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-dark-700 rounded"></div>
                  <div className="h-3 bg-dark-700 rounded"></div>
                  <div className="h-3 bg-dark-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="comments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {currentComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-dark-800 rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-dark-700 hover:border-dark-600"
              >
                {/* Header with user info and platform */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <OptimizedImage
                      src={comment.avatar}
                      alt={comment.displayName}
                      className="w-12 h-12 rounded-full object-cover"
                      width={48}
                      height={48}
                      quality={75}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white text-sm">
                          {comment.displayName}
                        </h4>
                        {comment.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-dark-400 text-xs">
                        {comment.username}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getPlatformIcon(comment.platform)}
                    <span className="text-dark-400 text-xs">
                      {comment.timestamp}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                {comment.rating && (
                  <div className="flex space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`${
                          i < comment.rating!
                            ? 'text-accent-500 fill-accent-500'
                            : 'text-dark-600'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Comment content */}
                <p className="text-dark-200 text-sm leading-relaxed mb-4">
                  {comment.content}
                </p>

                {/* Engagement metrics */}
                <div className="flex items-center justify-between text-dark-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart size={14} className="text-red-500" />
                      <span className="text-xs">{comment.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={14} />
                      <span className="text-xs">Reply</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 size={14} />
                      <span className="text-xs">Share</span>
                    </div>
                  </div>
                  
                  <span className="text-xs capitalize">
                    {comment.platform}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Social Media Links */}
      <div className="text-center pt-6 border-t border-dark-800">
        <p className="text-dark-300 mb-4">Follow us for more updates and behind-the-scenes content</p>
        <div className="flex justify-center space-x-6">
          <a
            href="https://www.instagram.com/officialfokal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-dark-400 hover:text-pink-500 transition-colors"
          >
            <Instagram size={20} />
            <span className="text-sm">@officialfokal</span>
          </a>
          <a
            href="https://www.facebook.com/fokallimited"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-dark-400 hover:text-blue-500 transition-colors"
          >
            <Facebook size={20} />
            <span className="text-sm">FOKAL Limited</span>
          </a>
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-dark-400 hover:text-blue-400 transition-colors"
          >
            <Twitter size={20} />
            <span className="text-sm">@fokalltd</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialTestimonials;