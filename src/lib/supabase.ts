import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add type safety for database schema
export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          description: string;
          location: string;
          contact_number: string | null;
          website: string | null;
          image_url: string | null;
          rating: number;
          visits: number;
          category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          location: string;
          contact_number?: string | null;
          website?: string | null;
          image_url?: string | null;
          rating?: number;
          visits?: number;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          location?: string;
          contact_number?: string | null;
          website?: string | null;
          image_url?: string | null;
          rating?: number;
          visits?: number;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          searches: number;
          is_trending: boolean;
          category: string | null;
          created_at: string;
          updated_at: string;
          long_description: string | null;
          cultural_significance: string | null;
          ingredients: string | null;
          origin_of_dish: string | null;
          serving_size: string | null;
          prep_time: string | null;
          spice_level: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          searches?: number;
          is_trending?: boolean;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
          long_description?: string | null;
          cultural_significance?: string | null;
          ingredients?: string | null;
          origin_of_dish?: string | null;
          serving_size?: string | null;
          prep_time?: string | null;
          spice_level?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          searches?: number;
          is_trending?: boolean;
          category?: string | null;
          created_at?: string;
          updated_at?: string;
          long_description?: string | null;
          cultural_significance?: string | null;
          ingredients?: string | null;
          origin_of_dish?: string | null;
          serving_size?: string | null;
          prep_time?: string | null;
          spice_level?: string | null;
        };
      };
      vlogger_features: {
        Row: {
          id: string;
          restaurant_id: string;
          vlogger_name: string;
          content_type: 'image' | 'video';
          content_url: string;
          feature_date: string;
          platform: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          vlogger_name: string;
          content_type: 'image' | 'video';
          content_url: string;
          feature_date: string;
          platform: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          vlogger_name?: string;
          content_type?: 'image' | 'video';
          content_url?: string;
          feature_date?: string;
          platform?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      food_variations: {
        Row: {
          id: string;
          food_id: string;
          parent_food_id: string | null;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          food_id: string;
          parent_food_id?: string | null;
          name: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          food_id?: string;
          parent_food_id?: string | null;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      retail_availability: {
        Row: {
          id: string;
          food_id: string;
          store_name: string;
          product_type: string;
          price_range: string | null;
          location: string | null;
          availability_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          food_id: string;
          store_name: string;
          product_type: string;
          price_range?: string | null;
          location?: string | null;
          availability_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          food_id?: string;
          store_name?: string;
          product_type?: string;
          price_range?: string | null;
          location?: string | null;
          availability_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Export typed client
export type TypedSupabaseClient = ReturnType<typeof createClient<Database>>;