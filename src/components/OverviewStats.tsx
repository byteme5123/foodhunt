import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Store, Pizza, Tag, Search, ThumbsUp, ThumbsDown } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { TopItemCard } from './TopItemCard';

interface OverviewStats {
  restaurant_count: number;
  food_count: number;
  food_category_count: number;
  restaurant_category_count: number;
}

interface TopVotedItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  likes: number;
  dislikes: number;
}

interface TopSearchedFood {
  id: string;
  name: string;
  category: string;
  image_url: string;
  searches: number;
}

export const OverviewStats = () => {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [topVotedFoods, setTopVotedFoods] = useState<TopVotedItem[]>([]);
  const [topVotedRestaurants, setTopVotedRestaurants] = useState<TopVotedItem[]>([]);
  const [topSearchedFoods, setTopSearchedFoods] = useState<TopSearchedFood[]>([]);

  useEffect(() => {
    fetchOverviewStats();
    fetchTopItems();

    // Set up real-time subscriptions
    const votesChannel = supabase.channel('votes_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'food_votes'
      }, () => {
        fetchTopItems();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'restaurant_votes'
      }, () => {
        fetchTopItems();
      })
      .subscribe();

    return () => {
      votesChannel.unsubscribe();
    };
  }, []);

  const fetchOverviewStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_overview_stats');
      if (error) throw error;
      if (data) setStats(data[0]);
    } catch (err) {
      console.error('Error fetching overview stats:', err);
    }
  };

  const fetchTopItems = async () => {
    try {
      // Fetch top voted foods
      const { data: topFoods, error: foodsError } = await supabase.rpc('get_top_voted_foods');
      if (foodsError) throw foodsError;
      setTopVotedFoods(topFoods);

      // Fetch top voted restaurants
      const { data: topRestaurants, error: restaurantsError } = await supabase.rpc('get_top_voted_restaurants');
      if (restaurantsError) throw restaurantsError;
      setTopVotedRestaurants(topRestaurants);

      // Fetch most searched foods
      const { data: searchedFoods, error: searchError } = await supabase.rpc('get_most_searched_foods');
      if (searchError) throw searchError;
      setTopSearchedFoods(searchedFoods);
    } catch (err) {
      console.error('Error fetching top items:', err);
    }
  };

  if (!stats) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading overview stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Restaurants"
          value={stats.restaurant_count}
          icon={Store}
        />
        <StatsCard
          title="Total Foods"
          value={stats.food_count}
          icon={Pizza}
        />
        <StatsCard
          title="Food Categories"
          value={stats.food_category_count}
          icon={Tag}
        />
        <StatsCard
          title="Restaurant Categories"
          value={stats.restaurant_category_count}
          icon={Tag}
        />
      </div>

      {/* Top Items */}
      <div className="space-y-8">
        {/* Most Liked Foods */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Most Liked Foods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topVotedFoods.map(food => (
              <TopItemCard
                key={food.id}
                id={food.id}
                type="food"
                name={food.name}
                category={food.category}
                imageUrl={food.image_url}
                likes={food.likes}
                dislikes={food.dislikes}
              />
            ))}
          </div>
        </div>

        {/* Most Liked Restaurants */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Most Liked Restaurants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topVotedRestaurants.map(restaurant => (
              <TopItemCard
                key={restaurant.id}
                id={restaurant.id}
                type="restaurant"
                name={restaurant.name}
                category={restaurant.category}
                imageUrl={restaurant.image_url}
                likes={restaurant.likes}
                dislikes={restaurant.dislikes}
              />
            ))}
          </div>
        </div>

        {/* Most Searched Foods */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Most Searched Foods</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topSearchedFoods.map(food => (
              <TopItemCard
                key={food.id}
                id={food.id}
                type="food"
                name={food.name}
                category={food.category}
                imageUrl={food.image_url}
                searches={food.searches}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};