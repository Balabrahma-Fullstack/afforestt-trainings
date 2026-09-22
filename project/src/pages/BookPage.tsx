import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Check, ArrowLeft, ShoppingCart, Calendar, Users, Star, MapPin } from 'lucide-react';
import type { Training } from '@/types';
import { fetchTrainingBySlug } from '@/services/api';
import { formatPrice } from '@/utils/helpers';
import DatePicker from '@/components/DatePicker';
import Loader from '@/components/Loader';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function BookPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [training, setTraining] = useState<Training | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      try {
        const t = await fetchTrainingBySlug(slug);
        setTraining(t);
      } catch (err) {
        console.error('Failed to load training:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleAddToCart = () => {
    if (!training) return;
    if (!selectedDate) {
      showToast('Please select a date first.', 'error');
      return;
    }
    addToCart(training, selectedDate, quantity);
    showToast(`${training.name} added to cart!`, 'success');
    navigate('/cart');
  };

  if (loading) return <div className="pt-20"><Loader label="Loading training details..." /></div>;

  if (!training) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-20">
        <p className="text-lg text-charcoal-600">Training not found.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const allowCustom = training.slug === 'offline-workshop';

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container-wide px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-forest-700 hover:text-forest-800">
          <ArrowLeft className="h-4 w-4" /> Back to Trainings
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Left: Image + details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="overflow-hidden rounded-2xl shadow-lg">
              {training.image_url && (
                <img src={training.image_url} alt={training.name} className="aspect-[16/10] w-full object-cover" />
              )}
            </div>

            <div className="mt-6 card p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm text-charcoal-600">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-forest-600" /> {training.duration}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-forest-600" /> <span className="capitalize">{training.format}</span></span>
                <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-forest-600" /> {training.difficulty}</span>
              </div>

              <h1 className="mt-4 font-serif text-2xl font-semibold text-forest-900 sm:text-3xl">{training.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{training.description}</p>

              {training.badge && (
                <span className="mt-4 inline-block rounded-full bg-amber-accent px-3 py-1 text-xs font-semibold text-charcoal-900">
                  {training.badge}
                </span>
              )}

              <h3 className="mt-6 font-serif text-base font-semibold text-forest-900">What you will learn</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {training.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-charcoal-700">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Booking panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="card p-6">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-charcoal-500">Price per person</span>
                <span className="font-serif text-3xl font-semibold text-forest-800">{formatPrice(training.price)}</span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-charcoal-500">
                <Users className="h-3.5 w-3.5" /> {training.seats} seats per session
              </div>

              {/* Date selection */}
              <div className="mt-6 border-t border-beige-100 pt-6">
                <DatePicker
                  selectedDate={selectedDate}
                  onSelect={setSelectedDate}
                  allowCustom={allowCustom}
                />
              </div>

              {/* Quantity */}
              <div className="mt-6 border-t border-beige-100 pt-6">
                <label className="mb-2 block text-sm font-medium text-charcoal-700">Number of seats</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-beige-200 text-lg font-medium text-charcoal-700 hover:bg-forest-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-serif text-xl font-semibold text-forest-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(training.seats, q + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-beige-200 text-lg font-medium text-charcoal-700 hover:bg-forest-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-xl bg-forest-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-600">Subtotal</span>
                  <span className="font-medium text-forest-800">{formatPrice(training.price * quantity)}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedDate}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart & Book
              </button>

              {!selectedDate && (
                <p className="mt-3 text-center text-xs text-charcoal-500">Please select a date to continue.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
