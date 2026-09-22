export interface Training {
  id: string;
  slug: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
  badge: string | null;
  category: 'online' | 'offline';
  format: string;
  difficulty: string;
  image_url: string | null;
  seats: number;
  sort_order: number;
  is_active: boolean;
}

export interface CartItem {
  trainingId: string;
  slug: string;
  name: string;
  duration: string;
  price: number;
  image_url: string | null;
  quantity: number;
  selectedDate: string;
  format: string;
}

export interface Booking {
  id: string;
  booking_id: string;
  user_id: string | null;
  training_id: string | null;
  training_name: string;
  selected_date: string;
  customer_name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  amount: number;
  payment_method: string;
  payment_status: string;
  booking_status: string;
  transaction_id: string | null;
  quantity: number;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string | null;
  training_name: string;
  author_name: string;
  rating: number;
  content: string;
  is_sample: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface Webinar {
  id: string;
  title: string;
  webinar_date: string;
  webinar_time: string;
  price: number;
  seats: number;
  seats_filled: number;
  is_active: boolean;
}

export interface Profile {
  id: string;
  full_name: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export type PaymentMethod = 'upi' | 'debit' | 'credit' | 'netbanking' | 'wallet';
