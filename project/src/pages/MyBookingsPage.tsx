import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, CheckCircle2, Clock, IndianRupee, Copy, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchMyBookings } from '@/services/api';
import { formatPrice, formatDate, formatDateShort } from '@/utils/helpers';
import type { Booking } from '@/types';
import Loader from '@/components/Loader';
import { useToast } from '@/context/ToastContext';

export default function MyBookingsPage() {
  const { session, profile, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    (async () => {
      try {
        const data = await fetchMyBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  if (authLoading) return <div className="pt-20"><Loader /></div>;
  if (!session) return <Navigate to="/login" replace />;

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    showToast('Booking ID copied!', 'success');
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container-wide px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-forest-900">
              {isAdmin ? 'Admin Dashboard' : 'My Bookings'}
            </h1>
            <p className="mt-2 text-sm text-charcoal-600">
              Welcome back, {profile?.full_name || 'Learner'}
            </p>
          </div>
          {isAdmin && (
            <Link to="/admin" className="btn-primary">
              Go to Admin Panel
            </Link>
          )}
        </div>

        {loading ? (
          <Loader label="Loading your bookings..." />
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex flex-col items-center justify-center gap-6 rounded-2xl bg-white p-16 text-center shadow-sm"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest-50">
              <Package className="h-10 w-10 text-forest-300" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-forest-900">No bookings yet</h3>
              <p className="mt-2 text-sm text-charcoal-600">Browse our trainings and make your first booking.</p>
            </div>
            <Link to="/" className="btn-primary">Explore Trainings</Link>
          </motion.div>
        ) : (
          <div className="mt-8 space-y-4">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-forest-900">{booking.training_name}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-charcoal-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {formatDateShort(booking.selected_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Friday evening
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" /> {formatPrice(booking.amount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-700">
                        <span className="capitalize">{booking.booking_status}</span>
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <span className="capitalize">{booking.payment_status}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => copyId(booking.booking_id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-charcoal-500 hover:text-forest-700"
                    >
                      <span className="font-mono">{booking.booking_id}</span>
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
