import { supabase } from '@/lib/supabase';
import type { Training, Booking, Review, Webinar, CustomerDetails, PaymentMethod } from '@/types';

export async function fetchTrainings(): Promise<Training[]> {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return (data || []) as Training[];
}

export async function fetchTrainingBySlug(slug: string): Promise<Training | null> {
  const { data, error } = await supabase
    .from('trainings')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Training | null;
}

export async function fetchWebinars(): Promise<Webinar[]> {
  const { data, error } = await supabase
    .from('webinars')
    .select('*')
    .eq('is_active', true)
    .order('webinar_date');
  if (error) throw error;
  return (data || []) as Webinar[];
}

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Review[];
}

export interface CreateBookingParams {
  bookingId: string;
  trainingId: string;
  trainingName: string;
  selectedDate: string;
  customer: CustomerDetails;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  quantity: number;
}

export async function createBooking(params: CreateBookingParams): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      booking_id: params.bookingId,
      training_id: params.trainingId,
      training_name: params.trainingName,
      selected_date: params.selectedDate,
      customer_name: params.customer.fullName,
      email: params.customer.email,
      phone: params.customer.phone,
      city: params.customer.city,
      country: params.customer.country,
      amount: params.amount,
      payment_method: params.paymentMethod,
      payment_status: 'paid',
      booking_status: 'confirmed',
      transaction_id: params.transactionId,
      quantity: params.quantity,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Booking;
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Booking[];
}

export async function fetchBookingById(bookingId: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_id', bookingId)
    .maybeSingle();
  if (error) throw error;
  return data as Booking | null;
}

export async function createReview(review: {
  trainingName: string;
  authorName: string;
  rating: number;
  content: string;
}): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      training_name: review.trainingName,
      author_name: review.authorName,
      rating: review.rating,
      content: review.content,
    })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as Review | null;
}

// Admin services
export async function fetchAllBookingsAdmin(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Booking[];
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ booking_status: status })
    .eq('id', bookingId);
  if (error) throw error;
}

export async function createTraining(training: Omit<Training, 'id' | 'created_at'>): Promise<Training | null> {
  const { data, error } = await supabase
    .from('trainings')
    .insert(training)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as Training | null;
}

export async function updateTraining(id: string, updates: Partial<Training>): Promise<void> {
  const { error } = await supabase.from('trainings').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteTraining(id: string): Promise<void> {
  const { error } = await supabase.from('trainings').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAllProfiles(): Promise<{ id: string; full_name: string; role: string; created_at: string }[]> {
  const { data, error } = await supabase.from('profiles').select('id, full_name, role, created_at').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchAllReviewsAdmin(): Promise<Review[]> {
  const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}
