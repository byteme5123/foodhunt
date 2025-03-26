import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Star, Clock, Tag, Utensils, Users, Clock3, Flame, ShoppingBag, ChefHat, History, Scroll } from 'lucide-react';
import { VoteButtons } from '../components/VoteButtons';
import { Toaster, toast } from 'sonner';

interface Food {
  id: string;
  name: string;
  description: string;
  long_description: string;
  origin_of_dish: string;
  cultural_significance: string;
  ingredients: string;
  image_url: string;
  category: string;
  searches: number;
  serving_size: string;
  prep_time: string;
  spice_level: string;
}

interface FoodVariation {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  image_url: string;
  map_url: string;
  price: number;
}

interface RetailAvailability {
  id: string;
  store_name: string;
  product_type: string;
  price_range: string;
  location: string;
  availability_notes: string;
}

interface VoteCount {
  likes: number;
  dislikes: number;
}

const Food = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState<Food | null>(null);
  const [variations, setVariations] = useState<FoodVariation[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [retailAvailability, setRetailAvailability] = useState<RetailAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votes, setVotes] = useState<VoteCount>({ likes: 0, dislikes: 0 });

  useEffect(() => {
    if (id) {
      fetchFoodDetails();
      fetchVotes();
    }
  }, [id]);

  useEffect(() => {
    if (food) {
      fetchFoodVariations();
      fetchRestaurants();
      fetchRetailAvailability();
    }
  }, [food]);

  const fetchFoodDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError('Food not found');
        return;
      }

      setFood(data);
    } catch (err) {
      console.error('Error fetching food:', err);
      setError('Failed to load food details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVotes = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .rpc('get_food_votes', { p_food_id: id });

      if (error) throw error;
      if (data && data[0]) {
        setVotes({
          likes: Number(data[0].likes) || 0,
          dislikes: Number(data[0].dislikes) || 0
        });
      }
    } catch (err) {
      console.error('Error fetching votes:', err);
    }
  };

  const fetchFoodVariations = async () => {
    if (!food) return;

    try {
      const { data: variationData } = await supabase
        .from('food_variations')
        .select('parent_food_id')
        .eq('food_id', food.id)
        .maybeSingle();

      const parentId = variationData?.parent_food_id || food.id;

      const { data: variations } = await supabase
        .from('food_variations')
        .select(`
          id,
          name,
          description,
          image_url
        `)
        .eq('parent_food_id', parentId);

      if (variations) {
        setVariations(variations);
      }
    } catch (err) {
      console.error('Error fetching variations:', err);
    }
  };

  const fetchRestaurants = async () => {
    if (!food) return;

    try {
      const { data } = await supabase
        .from('restaurant_foods')
        .select(`
          restaurants (
            id,
            name,
            location,
            rating,
            image_url,
            map_url
          ),
          price
        `)
        .eq('food_id', food.id);

      if (data) {
        const restaurantsData = data.map((item: any) => ({
          id: item.restaurants.id,
          name: item.restaurants.name,
          location: item.restaurants.location,
          rating: item.restaurants.rating,
          image_url: item.restaurants.image_url,
          map_url: item.restaurants.map_url,
          price: item.price
        }));
        setRestaurants(restaurantsData);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      toast.error('Failed to load restaurant information');
    }
  };

  const fetchRetailAvailability = async () => {
    if (!food) return;

    try {
      const { data, error } = await supabase
        .from('retail_availability')
        .select('*')
        .eq('food_id', food.id);

      if (error) throw error;
      if (data) setRetailAvailability(data);
    } catch (err) {
      console.error('Error fetching retail availability:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading food details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!food) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="relative h-96">
          <img
            src={food?.image_url}
            alt={food?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                {food?.category}
              </span>
              <span className="px-2 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                {food?.searches} searches
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{food?.name}</h1>
            <p className="text-lg text-white/90">{food?.description}</p>
          </div>
        </div>
      </div>

      {/* Vote Section */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Did you like this dish?</h2>
        <VoteButtons
          type="food"
          id={food.id}
          initialLikes={votes.likes}
          initialDislikes={votes.dislikes}
        />
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Cuisine Type</h3>
              <p className="text-gray-600">Traditional Nepali</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Serving Size</h3>
              <p className="text-gray-600">{food.serving_size}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Clock3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Prep Time</h3>
              <p className="text-gray-600">{food.prep_time}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Spice Level</h3>
              <p className="text-gray-600">{food.spice_level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About the Dish */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scroll className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold">About the Dish</h2>
            </div>
            <div className="prose prose-orange">
              <p className="text-gray-600 mb-4">{food?.long_description}</p>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Main Ingredients</h3>
              <p className="text-gray-600 mb-4">{food?.ingredients}</p>
            </div>
          </div>

          {/* Cultural Significance and Origin */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold">Origin of the Dish</h2>
            </div>
            <p className="text-gray-600 mb-6">{food?.origin_of_dish}</p>

            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold">Cultural Significance</h2>
            </div>
            <p className="text-gray-600">{food?.cultural_significance}</p>
          </div>
        </div>
      </div>

      {/* Retail Availability */}
      {retailAvailability.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Where to Buy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retailAvailability.map((retail) => (
              <div key={retail.id} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-2">{retail.store_name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Type:</span> {retail.product_type}
                  </p>
                  <p>
                    <span className="font-medium">Price Range:</span> {retail.price_range}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {retail.location}
                  </p>
                  {retail.availability_notes && (
                    <p className="text-gray-500 italic">{retail.availability_notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variations Section */}
      {variations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Variations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {variations.map((variation) => (
              <Link
                key={variation.id}
                to={`/food/${variation.id}`}
                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square">
                  <img
                    src={variation.image_url}
                    alt={variation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 mb-1">{variation.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{variation.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Restaurants Section */}
      {restaurants.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Where to Eat</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={restaurant.image_url}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2">{restaurant.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{restaurant.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{restaurant.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-green-600 flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        <span>Rs. {restaurant.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default Food;