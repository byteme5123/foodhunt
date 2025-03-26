import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { FormField, Input, TextArea, Select, Checkbox, Button } from '../components/FormField';
import Modal from '../components/Modal';
import { OverviewStats } from '../components/OverviewStats';

interface Restaurant {
  id?: string;
  name: string;
  description: string;
  location: string;
  contact_number: string;
  website: string;
  image_url: string;
  category: string;
  map_url: string;
}

interface Food {
  id?: string;
  name: string;
  description: string;
  category: string;
  image_url: string;
  is_trending: boolean;
  long_description: string;
  cultural_significance: string;
  ingredients: string;
  origin_of_dish: string;
  serving_size: string;
  prep_time: string;
  spice_level: string;
}

interface VloggerFeature {
  id?: string;
  restaurant_id: string;
  vlogger_name: string;
  content_type: 'video' | 'image';
  content_url: string;
  feature_date: string;
  platform: string;
  description: string;
  restaurants?: {
    name: string;
  };
}

interface RestaurantFood {
  id?: string;
  restaurant_id: string;
  food_id: string;
  price: number;
  restaurants?: {
    id: string;
    name: string;
  };
}

const FOOD_CATEGORIES = [
  'Momo', 'Chowmein', 'Thakali', 'Newari', 'Fast Food', 
  'Street Food', 'Dessert', 'Beverage', 'Traditional'
];

const RESTAURANT_CATEGORIES = [
  'Fine Dining', 'Casual Dining', 'Fast Food', 'Cafe',
  'Street Food', 'Traditional', 'Multi-Cuisine'
];

const SOCIAL_PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'Facebook'];

const SPICE_LEVELS = [
  'Mild',
  'Medium',
  'Medium Hot',
  'Hot',
  'Very Hot'
];

const SERVING_SIZES = [
  '1 Person',
  '2-3 People',
  '3-4 People',
  '4-6 People',
  'Family Size'
];

const PREP_TIMES = [
  '5-10 minutes',
  '10-15 minutes',
  '15-30 minutes',
  '30-45 minutes',
  '45-60 minutes',
  'Over 1 hour'
];

const Admin = () => {
  const [session, setSession] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [vloggerFeatures, setVloggerFeatures] = useState<VloggerFeature[]>([]);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [editingVloggerFeature, setEditingVloggerFeature] = useState<VloggerFeature | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'foods' | 'vloggers'>('overview');
  const [editingRestaurantFood, setEditingRestaurantFood] = useState<RestaurantFood | null>(null);
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [restaurantFoods, setRestaurantFoods] = useState<RestaurantFood[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchRestaurants();
      fetchFoods();
      fetchVloggerFeatures();
    }
  }, [session]);

  useEffect(() => {
    if (selectedFood) {
      fetchRestaurantFoods();
    }
  }, [selectedFood]);

  const fetchRestaurants = async () => {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Error fetching restaurants');
    } else {
      setRestaurants(data);
    }
  };

  const fetchFoods = async () => {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .order('name');

    if (error) {
      toast.error('Error fetching foods');
    } else {
      setFoods(data);
    }
  };

  const fetchVloggerFeatures = async () => {
    const { data, error } = await supabase
      .from('vlogger_features')
      .select(`
        *,
        restaurants (
          name
        )
      `)
      .order('feature_date', { ascending: false });

    if (error) {
      toast.error('Error fetching vlogger features');
    } else {
      setVloggerFeatures(data);
    }
  };

  const fetchRestaurantFoods = async () => {
    if (!selectedFood) return;

    const { data, error } = await supabase
      .from('restaurant_foods')
      .select(`
        id,
        price,
        restaurants (
          id,
          name
        )
      `)
      .eq('food_id', selectedFood);

    if (error) {
      toast.error('Error fetching restaurant foods');
    } else {
      setRestaurantFoods(data);
    }
  };

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRestaurant) return;

    try {
      const { id, ...restaurantData } = editingRestaurant;

      const { error } = id
        ? await supabase
            .from('restaurants')
            .update(restaurantData)
            .eq('id', id)
        : await supabase
            .from('restaurants')
            .insert([restaurantData]);

      if (error) {
        console.error('Error saving restaurant:', error);
        toast.error('Error saving restaurant');
      } else {
        toast.success('Restaurant saved successfully');
        fetchRestaurants();
        setEditingRestaurant(null);
      }
    } catch (err) {
      console.error('Error saving restaurant:', err);
      toast.error('Error saving restaurant');
    }
  };

  const handleFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood) return;

    const { error } = editingFood.id
      ? await supabase
          .from('foods')
          .update(editingFood)
          .eq('id', editingFood.id)
      : await supabase
          .from('foods')
          .insert([editingFood]);

    if (error) {
      toast.error('Error saving food');
    } else {
      toast.success('Food saved successfully');
      fetchFoods();
      setEditingFood(null);
    }
  };

  const handleVloggerFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVloggerFeature) return;

    if (editingVloggerFeature.content_type === 'video') {
      const videoId = extractYouTubeVideoId(editingVloggerFeature.content_url);
      if (!videoId) {
        toast.error('Invalid YouTube URL');
        return;
      }
      editingVloggerFeature.content_url = `https://www.youtube.com/embed/${videoId}`;
    }

    const { error } = editingVloggerFeature.id
      ? await supabase
          .from('vlogger_features')
          .update(editingVloggerFeature)
          .eq('id', editingVloggerFeature.id)
      : await supabase
          .from('vlogger_features')
          .insert([editingVloggerFeature]);

    if (error) {
      toast.error('Error saving vlogger feature');
    } else {
      toast.success('Vlogger feature saved successfully');
      fetchVloggerFeatures();
      setEditingVloggerFeature(null);
    }
  };

  const handleRestaurantFoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRestaurantFood || !selectedFood) return;

    setIsSubmitting(true);
    try {
      const { error } = editingRestaurantFood.id
        ? await supabase
            .from('restaurant_foods')
            .update({
              restaurant_id: editingRestaurantFood.restaurant_id,
              price: editingRestaurantFood.price
            })
            .eq('id', editingRestaurantFood.id)
        : await supabase
            .from('restaurant_foods')
            .insert([{
              restaurant_id: editingRestaurantFood.restaurant_id,
              food_id: selectedFood,
              price: editingRestaurantFood.price
            }]);

      if (error) throw error;

      toast.success('Restaurant food saved successfully');
      await fetchRestaurantFoods();
      setEditingRestaurantFood(null);
    } catch (err) {
      console.error('Error saving restaurant food:', err);
      toast.error('Error saving restaurant food');
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const deleteRestaurant = async (id: string) => {
    const { error } = await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error deleting restaurant');
    } else {
      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
    }
  };

  const deleteFood = async (id: string) => {
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error deleting food');
    } else {
      toast.success('Food deleted successfully');
      fetchFoods();
    }
  };

  const deleteVloggerFeature = async (id: string) => {
    const { error } = await supabase
      .from('vlogger_features')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error deleting vlogger feature');
    } else {
      toast.success('Vlogger feature deleted successfully');
      fetchVloggerFeatures();
    }
  };

  const deleteRestaurantFood = async (id: string) => {
    const { error } = await supabase
      .from('restaurant_foods')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Error removing restaurant food');
    } else {
      toast.success('Restaurant food removed successfully');
      fetchRestaurantFoods();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button
          onClick={() => supabase.auth.signOut()}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Sign Out
        </Button>
      </div>

      <div className="flex gap-4 mb-8">
        <Button
          onClick={() => setActiveTab('overview')}
          className={activeTab === 'overview'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
          }
        >
          Overview
        </Button>
        <Button
          onClick={() => setActiveTab('restaurants')}
          className={activeTab === 'restaurants'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
          }
        >
          Restaurants
        </Button>
        <Button
          onClick={() => setActiveTab('foods')}
          className={activeTab === 'foods'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
          }
        >
          Foods
        </Button>
        <Button
          onClick={() => setActiveTab('vloggers')}
          className={activeTab === 'vloggers'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700'
          }
        >
          Vlogger Features
        </Button>
      </div>

      {activeTab === 'overview' && <OverviewStats />}

      {activeTab === 'restaurants' && (
        <div>
          <Button
            onClick={() => setEditingRestaurant({
              name: '',
              description: '',
              location: '',
              contact_number: '',
              website: '',
              image_url: '',
              category: '',
              map_url: ''
            })}
            className="mb-6 bg-green-500 text-white hover:bg-green-600"
          >
            <Plus className="h-5 w-5" />
            Add Restaurant
          </Button>

          <Modal
            isOpen={!!editingRestaurant}
            onClose={() => setEditingRestaurant(null)}
            title={editingRestaurant?.id ? 'Edit Restaurant' : 'Add Restaurant'}
          >
            <form onSubmit={handleRestaurantSubmit} className="space-y-4">
              <FormField label="Restaurant Name">
                <Input
                  type="text"
                  value={editingRestaurant?.name}
                  onChange={e => setEditingRestaurant({...editingRestaurant!, name: e.target.value})}
                  required
                />
              </FormField>

              <FormField label="Description">
                <TextArea
                  value={editingRestaurant?.description}
                  onChange={e => setEditingRestaurant({...editingRestaurant!, description: e.target.value})}
                  rows={4}
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Location">
                  <Input
                    type="text"
                    value={editingRestaurant?.location}
                    onChange={e => setEditingRestaurant({...editingRestaurant!, location: e.target.value})}
                    required
                  />
                </FormField>

                <FormField label="Category">
                  <Select
                    value={editingRestaurant?.category}
                    onChange={e => setEditingRestaurant({...editingRestaurant!, category: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    {RESTAURANT_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Contact Number">
                  <Input
                    type="tel"
                    value={editingRestaurant?.contact_number}
                    onChange={e => setEditingRestaurant({...editingRestaurant!, contact_number: e.target.value})}
                  />
                </FormField>

                <FormField label="Website">
                  <Input
                    type="url"
                    value={editingRestaurant?.website}
                    onChange={e => setEditingRestaurant({...editingRestaurant!, website: e.target.value})}
                  />
                </FormField>
              </div>

              <FormField label="Image URL">
                <Input
                  type="url"
                  value={editingRestaurant?.image_url}
                  onChange={e => setEditingRestaurant({...editingRestaurant!, image_url: e.target.value})}
                  required
                />
              </FormField>

              <FormField label="Map URL (Google Maps Embed URL)">
                <Input
                  type="url"
                  value={editingRestaurant?.map_url}
                  onChange={e => setEditingRestaurant({...editingRestaurant!, map_url: e.target.value})}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </FormField>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => setEditingRestaurant(null)}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <Save className="h-5 w-5" />
                  Save
                </Button>
              </div>
            </form>
          </Modal>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurants.map(restaurant => (
                  <tr key={restaurant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{restaurant.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{restaurant.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{restaurant.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        onClick={() => setEditingRestaurant(restaurant)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => deleteRestaurant(restaurant.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'foods' && (
        <div>
          <Button
            onClick={() => setEditingFood({
              name: '',
              description: '',
              category: '',
              image_url: '',
              is_trending: false,
              long_description: '',
              cultural_significance: '',
              ingredients: '',
              origin_of_dish: '',
              serving_size: '',
              prep_time: '',
              spice_level: ''
            })}
            className="mb-6 bg-green-500 text-white hover:bg-green-600"
          >
            <Plus className="h-5 w-5" />
            Add Food
          </Button>

          <Modal
            isOpen={!!editingFood}
            onClose={() => setEditingFood(null)}
            title={editingFood?.id ? 'Edit Food' : 'Add Food'}
          >
            <form onSubmit={handleFoodSubmit} className="space-y-4">
              <FormField label="Food Name">
                <Input
                  type="text"
                  value={editingFood?.name}
                  onChange={e => setEditingFood({...editingFood!, name: e.target.value})}
                  required
                />
              </FormField>

              <FormField label="Short Description">
                <TextArea
                  value={editingFood?.description}
                  onChange={e => setEditingFood({...editingFood!, description: e.target.value})}
                  rows={2}
                  required
                />
              </FormField>

              <FormField label="Long Description">
                <TextArea
                  value={editingFood?.long_description}
                  onChange={e => setEditingFood({...editingFood!, long_description: e.target.value})}
                  rows={4}
                  required
                />
              </FormField>

              <FormField label="Origin of the Dish">
                <TextArea
                  value={editingFood?.origin_of_dish}
                  onChange={e => setEditingFood({...editingFood!, origin_of_dish: e.target.value})}
                  rows={3}
                  required
                />
              </FormField>

              <FormField label="Cultural Significance">
                <TextArea
                  value={editingFood?.cultural_significance}
                  onChange={e => setEditingFood({...editingFood!, cultural_significance: e.target.value})}
                  rows={3}
                  required
                />
              </FormField>

              <FormField label="Main Ingredients">
                <TextArea
                  value={editingFood?.ingredients}
                  onChange={e => setEditingFood({...editingFood!, ingredients: e.target.value})}
                  rows={2}
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Serving Size">
                  <Select
                    value={editingFood?.serving_size}
                    onChange={e => setEditingFood({...editingFood!, serving_size: e.target.value})}
                    required
                  >
                    <option value="">Select serving size</option>
                    {SERVING_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Preparation Time">
                  <Select
                    value={editingFood?.prep_time}
                    onChange={e => setEditingFood({...editingFood!, prep_time: e.target.value})}
                    required
                  >
                    <option value="">Select prep time</option>
                    {PREP_TIMES.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Spice Level">
                  <Select
                    value={editingFood?.spice_level}
                    onChange={e => setEditingFood({...editingFood!, spice_level: e.target.value})}
                    required
                  >
                    <option value="">Select spice level</option>
                    {SPICE_LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <FormField label="Category">
                <Select
                  value={editingFood?.category}
                  onChange={e => setEditingFood({...editingFood!, category: e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  {FOOD_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Image URL">
                <Input
                  type="url"
                  value={editingFood?.image_url}
                  onChange={e => setEditingFood({...editingFood!, image_url: e.target.value})}
                  required
                />
              </FormField>

              <Checkbox
                id="is_trending"
                label="Is Trending"
                checked={editingFood?.is_trending}
                onChange={e => setEditingFood({...editingFood!, is_trending: e.target.checked})}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => setEditingFood(null)}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <Save className="h-5 w-5" />
                  Save
                </Button>
              </div>
            </form>
          </Modal>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trending</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {foods.map(food => (
                  <tr key={food.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{food.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{food.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {food.is_trending ? '✓' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        onClick={() => setSelectedFood(food.id)}
                        className="text-orange-600 hover:text-orange-900 mr-4"
                      >
                        Restaurants
                      </Button>
                      <Button
                        onClick={() => setEditingFood(food)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => deleteFood(food.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedFood && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Restaurants serving: {foods.find(f => f.id === selectedFood)?.name}
                </h3>
                <Button
                  onClick={() => setEditingRestaurantFood({
                    restaurant_id: '',
                    food_id: selectedFood,
                    price: 0
                  })}
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <Plus className="h-5 w-5" />
                  Add Restaurant
                </Button>
              </div>

              <Modal
                isOpen={!!editingRestaurantFood}
                onClose={() => setEditingRestaurantFood(null)}
                title="Add Restaurant for Food"
              >
                <form onSubmit={handleRestaurantFoodSubmit} className="space-y-4">
                  <FormField label="Restaurant">
                    <Select
                      value={editingRestaurantFood?.restaurant_id}
                      onChange={e => setEditingRestaurantFood({
                        ...editingRestaurantFood!,
                        restaurant_id: e.target.value
                      })}
                      required
                    >
                      <option value="">Select a restaurant</option>
                      {restaurants.map(restaurant => (
                        <option key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <FormField label="Price">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingRestaurantFood?.price}
                      onChange={e => setEditingRestaurantFood({
                        ...editingRestaurantFood!,
                        price: parseFloat(e.target.value)
                      })}
                      required
                    />
                  </FormField>

                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      onClick={() => setEditingRestaurantFood(null)}
                      className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-500 text-white hover:bg-green-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </form>
              </Modal>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {restaurantFoods.map(rf => (
                      <tr key={rf.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {rf.restaurants?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          Rs. {rf.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            onClick={() => setEditingRestaurantFood({
                              id: rf.id,
                              restaurant_id: rf.restaurants?.id || '',
                              food_id: selectedFood!,
                              price: rf.price
                            })}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            onClick={() => deleteRestaurantFood(rf.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'vloggers' && (
        <div>
          <Button
            onClick={() => setEditingVloggerFeature({
              restaurant_id: '',
              vlogger_name: '',
              content_type: 'video',
              content_url: '',
              feature_date: new Date().toISOString().split('T')[0],
              platform: 'YouTube',
              description: ''
            })}
            className="mb-6 bg-green-500 text-white hover:bg-green-600"
          >
            <Plus className="h-5 w-5" />
            Add Vlogger Feature
          </Button>

          <Modal
            isOpen={!!editingVloggerFeature}
            onClose={() => setEditingVloggerFeature(null)}
            title={editingVloggerFeature?.id ? 'Edit Vlogger Feature' : 'Add Vlogger Feature'}
          >
            <form onSubmit={handleVloggerFeatureSubmit} className="space-y-4">
              <FormField label="Restaurant">
                <Select
                  value={editingVloggerFeature?.restaurant_id}
                  onChange={e => setEditingVloggerFeature({...editingVloggerFeature!, restaurant_id: e.target.value})}
                  required
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Vlogger Name">
                <Input
                  type="text"
                  value={editingVloggerFeature?.vlogger_name}
                  onChange={e => setEditingVloggerFeature({...editingVloggerFeature!, vlogger_name: e.target.value})}
                  required
                />
              </FormField>

              <FormField label="Content Type">
                <Select
                  value={editingVloggerFeature?.content_type}
                  onChange={e => setEditingVloggerFeature({
                    ...editingVloggerFeature!,
                    content_type: e.target.value as 'video' | 'image'
                  })}
                  required
                >
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                </Select>
              </FormField>

              <FormField label="Content URL">
                <Input
                  type="url"
                  value={editingVloggerFeature?.content_url}
                  onChange={e => setEditingVloggerFeature({...editingVloggerFeature!, content_url: e.target.value})}
                  required
                />
              </FormField>

              <FormField label="Feature Date">
                <Input
                  type="date"
                  value={editingVloggerFeature?.feature_date}
                  onChange={e => setEditingVloggerFeature({...editingVloggerFeature!, feature_date: e.target.value})}
                  required
                />
              </FormField>

              <FormField label="Platform">
                <Select
                  value={editingVloggerFeature?.platform}
                  onChange={e => setEditingVloggerFeature({...editingVloggerFeature!, platform: e.target.value})}
                  required
                >
                  <option value="">Select a platform</option>
                  {SOCIAL_PLATFORMS.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Description">
                <TextArea
                  value={editingVloggerFeature?.description}
                  onChange={e => setEditingVloggerFeature({...editingVloggerFeature!, description: e.target.value})}
                  rows={4}
                  required
                />
              </FormField>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => setEditingVloggerFeature(null)}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  <X className="h-5 w-5" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <Save className="h-5 w-5" />
                  Save
                </Button>
              </div>
            </form>
          </Modal>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vlogger</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vloggerFeatures.map(feature => (
                  <tr key={feature.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{feature.restaurants?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{feature.vlogger_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{feature.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(feature.feature_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        onClick={() => setEditingVloggerFeature(feature)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={() => deleteVloggerFeature(feature.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
    </div>
  );
};

export default Admin;