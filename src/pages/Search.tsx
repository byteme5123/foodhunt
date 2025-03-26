import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search as SearchIcon, Filter, Sparkles } from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface SearchResult {
  id: string;
  name: string;
  type: 'restaurant' | 'food';
  image_url: string;
  location?: string;
  category?: string;
  restaurant_name?: string;
}

interface RandomFood {
  id: string;
  name: string;
  category: string;
  image_url: string;
  restaurant_name: string;
}

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [randomFood, setRandomFood] = useState<RandomFood | null>(null);

  useEffect(() => {
    if (searchParams.get('q')) {
      handleSearch();
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setResults([]);
    
    try {
      // Search in restaurants
      const { data: restaurantResults, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id, name, location, image_url, category')
        .ilike('name', `%${query}%`);

      if (restaurantError) throw restaurantError;

      // Search in foods
      const { data: foodResults, error: foodError } = await supabase
        .from('foods')
        .select(`
          id,
          name,
          category,
          image_url,
          restaurant_foods (
            restaurants (
              name
            )
          )
        `)
        .ilike('name', `%${query}%`);

      if (foodError) throw foodError;

      // Increment search count for found foods
      if (foodResults && foodResults.length > 0) {
        for (const food of foodResults) {
          await supabase.rpc('increment_food_search', { food_id: food.id });
        }
      }

      const combined = [
        ...(restaurantResults || []).map(r => ({
          id: r.id,
          name: r.name,
          type: 'restaurant' as const,
          image_url: r.image_url,
          location: r.location,
          category: r.category
        })),
        ...(foodResults || []).map(f => ({
          id: f.id,
          name: f.name,
          type: 'food' as const,
          image_url: f.image_url,
          category: f.category,
          restaurant_name: f.restaurant_foods?.[0]?.restaurants?.name
        }))
      ];

      setResults(combined);

      if (combined.length === 0) {
        toast.info('No results found');
      }
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Failed to perform search');
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomFood = async () => {
    setIsLoading(true);
    setRandomFood(null);

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
        toast.success('Found a delicious surprise for you!');
      }
    } catch (err) {
      console.error('Error fetching random food:', err);
      toast.error('Failed to get a random suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="K khana maan lagyo ?"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              disabled={isLoading}
            >
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>
          <button 
            type="button"
            onClick={getRandomFood}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors"
            disabled={isLoading}
          >
            <Sparkles className="h-5 w-5" />
            Surprise Me
          </button>
          <button 
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>
        </form>
      </div>

      {/* Random Food Suggestion */}
      {randomFood && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Surprise Suggestion</h2>
          <div 
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
            onClick={() => navigate(`/food/${randomFood.id}`)}
          >
            <div className="flex items-center">
              <div className="w-48 h-48">
                <img
                  src={randomFood.image_url}
                  alt={randomFood.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {randomFood.category || 'Traditional'}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Available at {randomFood.restaurant_name}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{randomFood.name}</h3>
                <p className="text-gray-600">
                  Click to view more details about this dish
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Looking for delicious options...</p>
        </div>
      ) : (
        results.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/${result.type}/${result.id}`)}
                >
                  <img
                    src={result.image_url}
                    alt={result.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                    {result.type === 'restaurant' && result.location && (
                      <p className="text-sm text-gray-500 mt-1">{result.location}</p>
                    )}
                    {result.type === 'food' && result.restaurant_name && (
                      <p className="text-sm text-gray-500 mt-1">Available at {result.restaurant_name}</p>
                    )}
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.type === 'restaurant' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {result.type}
                      </span>
                      {result.category && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {result.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
      
      <Toaster position="top-center" />
    </div>
  );
};

export default Search;