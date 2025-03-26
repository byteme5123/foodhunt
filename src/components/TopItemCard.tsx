import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TopItemCardProps {
  id: string;
  type: 'food' | 'restaurant';
  name: string;
  category?: string;
  imageUrl: string;
  likes?: number;
  dislikes?: number;
  searches?: number;
}

export const TopItemCard: React.FC<TopItemCardProps> = ({
  id,
  type,
  name,
  category,
  imageUrl,
  likes,
  dislikes,
  searches
}) => {
  return (
    <Link
      to={`/${type}/${id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-video">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{name}</h3>
        {category && (
          <span className="inline-block px-2 py-1 mt-1 bg-gray-100 text-sm text-gray-700 rounded-full">
            {category}
          </span>
        )}
        <div className="mt-3 flex items-center gap-4">
          {likes !== undefined && dislikes !== undefined && (
            <>
              <div className="flex items-center gap-1 text-sm">
                <ThumbsUp className="h-4 w-4 text-green-600" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <ThumbsDown className="h-4 w-4 text-red-600" />
                <span>{dislikes}</span>
              </div>
            </>
          )}
          {searches !== undefined && (
            <div className="text-sm text-gray-500">
              {searches} searches
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};