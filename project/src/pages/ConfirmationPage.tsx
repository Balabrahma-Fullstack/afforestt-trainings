import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Calendar, Clock, User, Mail, Copy,
  Printer, ArrowRight, BookOpen, Download,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createBooking } from '@/services/api';
import { generateBookingId, formatPrice, formatDate } from '@/utils/helpers';
import type { CartItem, CustomerDetails, PaymentMethod, Booking } from '@/types';
import Loader from '@/components/Loader';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { showToast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const cartData = sessionStorage.getItem('checkout_cart');
      const customerData = sessionStorage.getItem('checkout_customer');
      const paymentMethod = sessionStorage.getItem('payment_method') as PaymentMethod;
      const transactionId = sessionStorage.getItem('payment_transaction_id');

      if (!cartData || !customerData || !paymentMethod || !transactionId) {
        setError('Missing booking information. Please start the booking process again.');
        setLoading(false);
        return;
      }

      const items: CartItem[] = JSON.parse(cartData);
      const customer: CustomerDetails = JSON.parse(customerData);

      if (items.length === 0) {
        setError('No items in cart.');
        setLoading(false);
        return;
      }

      try {
        // Create a booking for each cart item (use the first one for display)
        const bookingId = generateBookingId();
        const firstItem = items[0];
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (session) {
          const created = await createBooking({
            bookingId,
            trainingId: firstItem.trainingId,
            trainingName: firstItem.name,
            selectedDate: firstItem.selectedDate,
            customer,
            amount: totalAmount,
            paymentMethod,
            transactionId,
            quantity: items.reduce((sum, item) => sum + item.quantity, 0),
          });
          setBooking(created);
        } else {
          // Not logged in — create a local booking record
          setBooking({
            id: 'local-' + Date.now(),
            booking_id: bookingId,
            user_id: null,
            training_id: firstItem.trainingId,
            training_name: items.map((i) => i.name).join(', '),
            selected_date: firstItem.selectedDate,
            customer_name: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            city: customer.city,
            country: customer.country,
            amount: totalAmount,
            payment_method: paymentMethod,
            payment_status: 'paid',
            booking_status: 'confirmed',
            transaction_id: transactionId,
            quantity: items.reduce((sum, item) => sum + item.quantity, 0),
            created_at: new Date().toISOString(),
          });
        }

        // Clear sessionStorage
        sessionStorage.removeItem('checkout_cart');
        sessionStorage.removeItem('checkout_customer');
        sessionStorage.removeItem('checkout_total');
        sessionStorage.removeItem('payment_method');
        sessionStorage.removeItem('payment_transaction_id');
      } catch (err) {
        console.error('Booking creation failed:', err);
        setError('Failed to create booking. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [session]);

  const copyBookingId = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.booking_id);
      showToast('Booking ID copied!', 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="pt-20"><Loader label="Confirming your booking..." /></div>;

  if (error || !booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 pt-20">
        <p className="text-lg text-charcoal-600">{error || 'Something went wrong.'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container-wide px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Success header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="card overflow-hidden"
          >
            <div className="bg-gradient-to-br from-forest-600 to-forest-800 p-8 text-center text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>
              <h1 className="mt-4 font-serif text-3xl font-semibold">Booking Confirmed!</h1>
              <p className="mt-2 text-sm text-cream-100/80">
                Your training has been successfully booked. A confirmation has been sent to your email.
              </p>
            </div>

            {/* Booking details */}
            <div className="p-6 sm:p-8">
              {/* Booking ID */}
              <div className="flex items-center justify-between rounded-xl bg-forest-50 p-4">
                <div>
                  <p className="text-xs text-charcoal-500">Booking ID</p>
                  <p className="font-mono text-lg font-bold text-forest-800">{booking.booking_id}</p>
                </div>
                <button
                  onClick={copyBookingId}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-forest-700 shadow-sm transition-colors hover:bg-forest-100"
                  aria-label="Copy booking ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              {/* Details grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-beige-100 p-4">
                  <div className="flex items-center gap-2 text-xs text-charcoal-500">
                    <BookOpen className="h-4 w-4 text-forest-600" />
                    Training
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-forest-900">{booking.training_name}</p>
                </div>
                <div className="rounded-xl border border-beige-100 p-4">
                  <div className="flex items-center gap-2 text-xs text-charcoal-500">
                    <Calendar className="h-4 w-4 text-forest-600" />
                    Date
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-forest-900">{formatDate(booking.selected_date)}</p>
                </div>
                <div className="rounded-xl border border-beige-100 p-4">
                  <div className="flex items-center gap-2 text-xs text-charcoal-500">
                    <Clock className="h-4 w-4 text-forest-600" />
                    Time
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-forest-900">Friday evening</p>
                </div>
                <div className="rounded-xl border border-beige-100 p-4">
                  <div className="flex items-center gap-2 text-xs text-charcoal-500">
                    <User className="h-4 w-4 text-forest-600" />
                    Customer
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-forest-900">{booking.customer_name}</p>
                </div>
                <div className="rounded-xl border border-beige-100 p-4">
                  <div className="flex items-center gap-2 text-xs text-charcoal-500">
                    <Mail className="h-4 w-4 text-forest-600" />
                    Email
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-forest-900">{booking.email}</p>
                </div>
                <div className="rounded-xl border border-beige-100 p-4">
                  <div className="flex items-center gap-2 text-xs text-charcoal-500">
                    <CheckCircle2 className="h-4 w-4 text-forest-600" />
                    Amount Paid
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-forest-900">{formatPrice(booking.amount)}</p>
                </div>
              </div>

              {/* Transaction details */}
              <div className="mt-4 rounded-xl bg-cream-100 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-600">Payment Method</span>
                  <span className="font-medium capitalize text-charcoal-800">{booking.payment_method}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-charcoal-600">Transaction ID</span>
                  <span className="font-mono font-medium text-charcoal-800">{booking.transaction_id}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-charcoal-600">Payment Status</span>
                  <span className="rounded-full bg-forest-100 px-3 py-0.5 text-xs font-semibold text-forest-700">Paid (Demo)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {session ? (
                  <button onClick={() => navigate('/my-bookings')} className="btn-primary flex-1">
                    View My Booking <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button onClick={() => navigate('/register')} className="btn-primary flex-1">
                    Create Account to Save Booking <ArrowRight className="h-4 w-4" />
                  </button>
                )}
                <button onClick={handlePrint} className="btn-secondary flex-1">
                  <Printer className="h-4 w-4" /> Print Booking
                </button>
              </div>

              <button
                onClick={() => navigate('/')}
                className="mt-4 block w-full text-center text-sm font-medium text-forest-700 hover:text-forest-800"
              >
                Back to Trainings
              </button>
            </div>
          </motion.div>

          {/* Email confirmation note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center gap-3 rounded-xl bg-white p-4 text-sm text-charcoal-600 shadow-sm"
          >
            <Download className="h-5 w-5 flex-shrink-0 text-forest-600" />
            <span>A booking confirmation has been sent to <strong>{booking.email}</strong>. You can print this page for your records.</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
