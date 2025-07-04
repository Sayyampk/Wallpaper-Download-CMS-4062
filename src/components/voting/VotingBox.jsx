import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useWallpaper } from '../../context/WallpaperContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const { FiStar, FiHeart } = FiIcons;

const VotingBox = ({ wallpaper }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const { voteWallpaper, votes } = useWallpaper();
  const { user } = useAuth();

  const userVote = votes.find(v => v.wallpaperId === wallpaper.id && v.userId === user?.id);
  const hasVoted = !!userVote;

  const handleVote = async (rating) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    if (hasVoted) {
      toast.error('You have already voted for this wallpaper');
      return;
    }

    setIsVoting(true);
    
    try {
      await voteWallpaper(wallpaper.id, rating, user.id);
      setSelectedRating(rating);
    } catch (error) {
      console.error('Voting failed:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Rate this wallpaper</h3>
        
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-2xl font-bold text-purple-600">{wallpaper.rating.toFixed(1)}</span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <SafeIcon
                key={star}
                icon={FiStar}
                className={`text-lg ${
                  star <= Math.round(wallpaper.rating) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500">{wallpaper.votes} votes</p>
      </div>

      {!hasVoted && user && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">Your rating:</p>
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleVote(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                disabled={isVoting}
                className="p-1 transition-colors disabled:opacity-50"
              >
                <SafeIcon
                  icon={FiStar}
                  className={`text-2xl ${
                    star <= (hoveredRating || selectedRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                />
              </motion.button>
            ))}
          </div>
          {isVoting && (
            <p className="text-sm text-gray-500">Submitting your vote...</p>
          )}
        </div>
      )}

      {hasVoted && (
        <div className="text-center">
          <p className="text-sm text-green-600 mb-2">✓ You rated this wallpaper</p>
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <SafeIcon
                key={star}
                icon={FiStar}
                className={`text-lg ${
                  star <= userVote.rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {!user && (
        <div className="text-center">
          <p className="text-sm text-gray-500">Sign in to rate this wallpaper</p>
        </div>
      )}
    </div>
  );
};

export default VotingBox;