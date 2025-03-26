import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Phone, Globe, Star, Menu, Video, Camera } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Restaurant {
  id: string;
  name: string;
  description: string;
  location: string;
  contact_number: string;
  website: string;
  image_url: string;
  rating: number;
  visits: number;
  latitude: number;
  longitude: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

interface VloggerFeature {
  id: string;
  vlogger_name: string;
  content_type: 'image' | 'video';
  content_url: string;
  feature_date: string;
  platform: string;
  description: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

const Restaurant = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [vloggerFeatures, setVloggerFeatures] = useState<VloggerFeature[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        // Increment visit count
        await supabase.rpc('increment_restaurant_visit', { restaurant_id: id });

        // Fetch restaurant details
        const { data: restaurantData } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .single();

        if (restaurantData) {
          setRestaurant(restaurantData);
        }

        // Fetch menu categories
        const { data: categoriesData } = await supabase
          .from('menu_categories')
          .select('*')
          .eq('restaurant_id', id);

        if (categoriesData) {
          setMenuCategories(categoriesData);
          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0].id);
          }
        }

        // Fetch vlogger features
        const { data: featuresData } = await supabase
          .from('vlogger_features')
          .select('*')
          .eq('restaurant_id', id)
          .order('feature_date', { ascending: false });

        if (featuresData) {
          setVloggerFeatures(featuresData);
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!id) return;

      try {
        const { data } = await supabase
          .from('restaurant_foods')
          .select(`
            food_id,
            price,
            foods (
              id,
              name,
              image_url,
              category
            )
          `)
          .eq('restaurant_id', id);

        if (data) {
          const items: MenuItem[] = data.map((item: any) => ({
            id: item.foods.id,
            name: item.foods.name,
            price: item.price,
            image_url: item.foods.image_url,
            category: item.foods.category
          }));

          // Filter items by category if one is selected
          const filteredItems = selectedCategory
            ? items.filter(item => {
                const category = menuCategories.find(c => c.id === selectedCategory);
                return category && item.category === category.name;
              })
            : items;

          setMenuItems(filteredItems);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [selectedCategory, id, menuCategories]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return <div className="text-center py-8">Restaurant not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="relative h-96">
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">{restaurant.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < restaurant.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span>({restaurant.visits} visits)</span>
            </div>
            <p className="text-lg text-white/90">{restaurant.description}</p>
          </div>
        </div>
      </div>

      {/* Info and Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {restaurant.location}
            </div>
            {restaurant.contact_number && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                {restaurant.contact_number}
              </div>
            )}
            {restaurant.website && (
              <div className="flex items-center text-gray-600">
                <Globe className="h-5 w-5 mr-2" />
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600"
                >
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
          {restaurant.latitude && restaurant.longitude && (
            <MapContainer
              center={[restaurant.latitude, restaurant.longitude]}
              zoom={15}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[restaurant.latitude, restaurant.longitude]}>
                <Popup>{restaurant.name}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
      </div>

      {/* Menu Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Menu className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Menu</h2>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                <p className="text-orange-500 font-medium mt-2">
                  Rs. {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vlogger Features Section */}
      {vloggerFeatures.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Video className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Featured By Food Vloggers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vloggerFeatures.map((feature) => (
              <div
                key={feature.id}
                className="bg-gray-50 rounded-lg overflow-hidden"
              >
                {feature.content_type === 'video' ? (
                  <div className="relative pt-[56.25%]">
                    <iframe
                      src={feature.content_url}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={feature.content_url}
                    alt={`Featured by ${feature.vlogger_name}`}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {feature.content_type === 'video' ? (
                      <Video className="h-4 w-4 text-red-500" />
                    ) : (
                      <Camera className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="font-medium text-gray-900">
                      {feature.vlogger_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{feature.platform}</span>
                    <span>{new Date(feature.feature_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurant;