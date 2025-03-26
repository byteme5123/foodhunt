import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TrendingUp, Store, Search as SearchIcon, Sparkles, X } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { TypeAnimation } from 'react-type-animation';

interface TrendingFood {
  id: string;
  name: string;
  category: string;
  searches: number;
  image_url: string;
}

interface Restaurant {
  id: string;
  name: string;
  category: string;
  visits: number;
  image_url: string;
}

interface RandomFood {
  id: string;
  name: string;
  category: string;
  image_url: string;
  restaurant_name: string;
}

const Home = () => {
  const [trendingFoods, setTrendingFoods] = useState<TrendingFood[]>([]);
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [randomFood, setRandomFood] = useState<RandomFood | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchTrendingFoods();
    fetchPopularRestaurants();
  }, []);

  const fetchTrendingFoods = async () => {
    const { data, error } = await supabase.rpc('get_top_foods');

    if (error) {
      console.error('Error fetching trending foods:', error);
    } else if (data) {
      setTrendingFoods(data);
    }
  };

  const fetchPopularRestaurants = async () => {
    const { data, error } = await supabase.rpc('get_top_restaurants');

    if (error) {
      console.error('Error fetching popular restaurants:', error);
    } else if (data) {
      setPopularRestaurants(data);
    }
  };

  const getRandomFood = async () => {
    try {
      const { data, error } = await supabase.rpc('get_random_restaurant_food');

      if (error) throw error;

      if (data && data[0]) {
        const food = {
          id: data[0].foods.id,
          name: data[0].foods.name,
          category: data[0].foods.category,
          image_url: data[0].foods.image_url,
          restaurant_name: data[0].restaurants.name
        };
        
        setRandomFood(food);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    } catch (err) {
      console.error('Error fetching random food:', err);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Modal and Confetti Container */}
      {randomFood && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setRandomFood(null)}
          />
          
          {/* Modal Content */}
          <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
            <button
              onClick={() => setRandomFood(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-600 hover:text-gray-900 transition-colors z-20"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2">
                <img
                  src={randomFood.image_url}
                  alt={randomFood.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 w-full md:w-1/2">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {randomFood.category || 'Traditional'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    at {randomFood.restaurant_name}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{randomFood.name}</h3>
                <p className="text-gray-600 mb-6">
                  We've found this delicious dish just for you! Click below to learn more about it.
                </p>
                <Link
                  to={`/food/${randomFood.id}`}
                  className="block w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white text-center rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Confetti */}
          {showConfetti && (
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.2}
              style={{ position: 'fixed', top: 0, left: 0, zIndex: 70 }}
            />
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            Travel Nepal, Eat Local
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover authentic Nepali cuisine and the best local restaurants across the country
          </p>
        </div>

        {/* Search and Surprise Me Section */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                className="w-full px-12 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className={`absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity ${searchQuery || isInputFocused ? 'opacity-0' : 'opacity-100'}`}>
                <TypeAnimation
                  sequence={[
                    'K khana maan lagyo ?',
                    2000,
                    'What are you craving for ?',
                    2000
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-gray-400"
                />
              </div>
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full hover:from-orange-600 hover:to-red-700 transition-all"
              >
                Search
              </button>
            </div>
          </div>

          {/* Surprise Me Button */}
          <div className="text-center">
            <button
              onClick={getRandomFood}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full hover:from-orange-600 hover:to-red-700 transition-all"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Surprise Me!
            </button>
          </div>
        </div>

        {/* Top Foods and Shops */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Top Foods */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Top 5 Foods</h2>
            </div>
            <div className="space-y-4">
              {trendingFoods.map((food, index) => (
                <Link
                  key={food.id}
                  to={`/food/${food.id}`}
                  className="block bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <div className="w-24 h-24">
                      <img 
                        src={food.image_url} 
                        alt={food.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-medium text-orange-500">{index + 1}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{food.name}</h3>
                            <span className="inline-block px-2 py-1 mt-1 bg-orange-50 text-sm text-orange-700 rounded-full">
                              {food.category || 'Traditional'}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{food.searches} searches</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top Shops */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Store className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold">Top 5 Shops</h2>
            </div>
            <div className="space-y-4">
              {popularRestaurants.map((restaurant, index) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurant/${restaurant.id}`}
                  className="block bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <div className="w-24 h-24">
                      <img 
                        src={restaurant.image_url} 
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-medium text-blue-500">{index + 1}</span>
                          <div>
                            <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                            <span className="inline-block px-2 py-1 mt-1 bg-blue-50 text-sm text-blue-700 rounded-full">
                              {restaurant.category || 'Local Restaurant'}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{restaurant.visits} visits</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;