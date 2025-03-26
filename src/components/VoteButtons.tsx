import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface VoteButtonsProps {
  type: 'food' | 'restaurant';
  id: string;
  initialLikes?: number;
  initialDislikes?: number;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({ type, id, initialLikes = 0, initialDislikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

  const handleVote = async (liked: boolean) => {
    try {
      const table = type === 'food' ? 'food_votes' : 'restaurant_votes';
      const idField = type === 'food' ? 'food_id' : 'restaurant_id';

      const { error } = await supabase
        .from(table)
        .insert([{ [idField]: id, liked }]);

      if (error) throw error;

      // Update local state
      if (liked) {
        setLikes(prev => prev + 1);
        if (userVote === 'dislike') {
          setDislikes(prev => prev - 1);
        }
        setUserVote('like');
      } else {
        setDislikes(prev => prev + 1);
        if (userVote === 'like') {
          setLikes(prev => prev - 1);
        }
        setUserVote('dislike');
      }

      toast.success('Thank you for your vote!');
    } catch (err) {
      console.error('Error voting:', err);
      toast.error('Failed to submit vote');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => handleVote(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          userVote === 'like'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        disabled={userVote === 'like'}
      >
        <ThumbsUp className="h-5 w-5" />
        <span>{likes}</span>
      </button>

      <button
        onClick={() => handleVote(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
          userVote === 'dislike'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        disabled={userVote === 'dislike'}
      >
        <ThumbsDown className="h-5 w-5" />
        <span>{dislikes}</span>
      </button>
    </div>
  );
};