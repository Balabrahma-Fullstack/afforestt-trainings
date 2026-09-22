import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, IndianRupee, Calendar, Trash2, Plus, X,
  TrendingUp, CheckCircle2, Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  fetchAllBookingsAdmin, updateBookingStatus, fetchAllProfiles,
  fetchAllReviewsAdmin, deleteReview, createTraining, deleteTraining,
  fetchTrainings,
} from '@/services/api';
import { formatPrice, formatDateShort } from '@/utils/helpers';
import type { Booking, Review, Training } from '@/types';
import Loader from '@/components/Loader';
import { useToast } from '@/context/ToastContext';
import Modal from '@/components/Modal';

type Tab = 'overview' | 'bookings' | 'trainings' | 'users' | 'reviews';

export default function AdminPage() {
  const { profile, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profiles, setProfiles] = useState<{ id: string; full_name: string; role: string; created_at: string }[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTraining, setShowAddTraining] = useState(false);

  // New training form
  const [newTraining, setNewTraining] = useState({
    slug: '', name: '', duration: '', price: '', description: '',
    features: '', badge: '', category: 'online', difficulty: 'beginner',
    image_url: '', seats: '50',
  });

  useEffect(() => {
    if (!profile || profile.role !== 'admin') return;
    loadData();
  }, [profile]);

  const loadData = async () => {
    try {
      const [b, p, r, t] = await Promise.all([
        fetchAllBookingsAdmin(),
        fetchAllProfiles(),
        fetchAllReviewsAdmin(),
        fetchTrainings(),
      ]);
      setBookings(b);
      setProfiles(p);
      setReviews(r);
      setTrainings(t);
    } catch (err) {
      console.error('Admin data load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="pt-20"><Loader /></div>;
  if (!profile || profile.role !== 'admin') return <Navigate to="/my-bookings" replace />;

  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const stats = [
    { label: 'Total Users', value: profiles.length, icon: Users, color: 'bg-forest-600' },
    { label: 'Total Bookings', value: bookings.length, icon: BookOpen, color: 'bg-amber-accent' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: IndianRupee, color: 'bg-forest-700' },
    { label: 'Trainings', value: trainings.length, icon: Calendar, color: 'bg-charcoal-800' },
  ];

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'trainings', label: 'Trainings' },
    { id: 'users', label: 'Users' },
    { id: 'reviews', label: 'Reviews' },
  ];

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateBookingStatus(id, status);
      showToast('Booking status updated.', 'success');
      loadData();
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      showToast('Review deleted.', 'success');
      loadData();
    } catch {
      showToast('Failed to delete review.', 'error');
    }
  };

  const handleDeleteTraining = async (id: string) => {
    if (!confirm('Delete this training? This cannot be undone.')) return;
    try {
      await deleteTraining(id);
      showToast('Training deleted.', 'success');
      loadData();
    } catch {
      showToast('Failed to delete training.', 'error');
    }
  };

  const handleCreateTraining = async () => {
    try {
      await createTraining({
        slug: newTraining.slug,
        name: newTraining.name,
        duration: newTraining.duration,
        price: parseInt(newTraining.price),
        description: newTraining.description,
        features: newTraining.features.split(',').map((f) => f.trim()).filter(Boolean),
        badge: newTraining.badge || null,
        category: newTraining.category as 'online' | 'offline',
        format: newTraining.category === 'offline' ? 'offline' : 'online',
        difficulty: newTraining.difficulty,
        image_url: newTraining.image_url || null,
        seats: parseInt(newTraining.seats),
        sort_order: trainings.length + 1,
        is_active: true,
      } as Omit<Training, 'id' | 'created_at'>);
      showToast('Training created!', 'success');
      setShowAddTraining(false);
      setNewTraining({ slug: '', name: '', duration: '', price: '', description: '', features: '', badge: '', category: 'online', difficulty: 'beginner', image_url: '', seats: '50' });
      loadData();
    } catch (err) {
      showToast('Failed to create training.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container-wide px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-forest-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-charcoal-600">Manage trainings, bookings, users, and reviews.</p>

        {/* Stats cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-charcoal-500">{stat.label}</p>
                    <p className="mt-1 font-serif text-2xl font-semibold text-forest-900">{stat.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-forest-600 text-white' : 'bg-white text-charcoal-600 ring-1 ring-beige-200 hover:bg-forest-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <Loader label="Loading admin data..." />
          ) : (
            <>
              {/* Overview */}
              {tab === 'overview' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="card p-6">
                    <h3 className="font-serif text-lg font-semibold text-forest-900">Recent Bookings</h3>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-beige-100 text-left text-xs text-charcoal-500">
                            <th className="pb-3 pr-4">Booking ID</th>
                            <th className="pb-3 pr-4">Training</th>
                            <th className="pb-3 pr-4">Customer</th>
                            <th className="pb-3 pr-4">Amount</th>
                            <th className="pb-3 pr-4">Status</th>
                            <th className="pb-3">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.slice(0, 5).map((b) => (
                            <tr key={b.id} className="border-b border-beige-50">
                              <td className="py-3 pr-4 font-mono text-xs">{b.booking_id}</td>
                              <td className="py-3 pr-4 text-charcoal-700">{b.training_name}</td>
                              <td className="py-3 pr-4 text-charcoal-700">{b.customer_name}</td>
                              <td className="py-3 pr-4 font-medium text-forest-800">{formatPrice(b.amount)}</td>
                              <td className="py-3 pr-4">
                                <span className="rounded-full bg-forest-100 px-2 py-0.5 text-xs font-medium text-forest-700 capitalize">{b.booking_status}</span>
                              </td>
                              <td className="py-3 text-xs text-charcoal-500">{formatDateShort(b.selected_date)}</td>
                            </tr>
                          ))}
                          {bookings.length === 0 && (
                            <tr><td colSpan={6} className="py-8 text-center text-charcoal-400">No bookings yet.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="card p-6">
                      <h3 className="font-serif text-lg font-semibold text-forest-900">Upcoming Trainings</h3>
                      <div className="mt-4 space-y-3">
                        {trainings.slice(0, 4).map((t) => (
                          <div key={t.id} className="flex items-center justify-between text-sm">
                            <span className="text-charcoal-700">{t.name}</span>
                            <span className="font-medium text-forest-700">{formatPrice(t.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="card p-6">
                      <h3 className="font-serif text-lg font-semibold text-forest-900">Payment Status</h3>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-charcoal-700"><CheckCircle2 className="h-4 w-4 text-forest-600" /> Paid</span>
                          <span className="font-medium">{bookings.filter((b) => b.payment_status === 'paid').length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-charcoal-700"><Clock className="h-4 w-4 text-amber-accent" /> Pending</span>
                          <span className="font-medium">{bookings.filter((b) => b.payment_status === 'pending').length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-charcoal-700"><TrendingUp className="h-4 w-4 text-forest-600" /> Revenue</span>
                          <span className="font-medium">{formatPrice(totalRevenue)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Bookings tab */}
              {tab === 'bookings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-beige-100 text-left text-xs text-charcoal-500">
                          <th className="pb-3 pr-4">ID</th>
                          <th className="pb-3 pr-4">Training</th>
                          <th className="pb-3 pr-4">Customer</th>
                          <th className="pb-3 pr-4">Email</th>
                          <th className="pb-3 pr-4">Amount</th>
                          <th className="pb-3 pr-4">Payment</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id} className="border-b border-beige-50">
                            <td className="py-3 pr-4 font-mono text-xs">{b.booking_id}</td>
                            <td className="py-3 pr-4 text-charcoal-700">{b.training_name}</td>
                            <td className="py-3 pr-4 text-charcoal-700">{b.customer_name}</td>
                            <td className="py-3 pr-4 text-charcoal-500">{b.email}</td>
                            <td className="py-3 pr-4 font-medium text-forest-800">{formatPrice(b.amount)}</td>
                            <td className="py-3 pr-4 capitalize text-charcoal-600">{b.payment_method}</td>
                            <td className="py-3 pr-4">
                              <select
                                value={b.booking_status}
                                onChange={(e) => handleStatusChange(b.id, e.target.value)}
                                className="rounded-lg border border-beige-200 px-2 py-1 text-xs focus:border-forest-500 focus:outline-none"
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                            <td className="py-3 text-xs text-charcoal-500">{formatDateShort(b.selected_date)}</td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr><td colSpan={8} className="py-8 text-center text-charcoal-400">No bookings yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Trainings tab */}
              {tab === 'trainings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="mb-4 flex justify-end">
                    <button onClick={() => setShowAddTraining(true)} className="btn-primary">
                      <Plus className="h-4 w-4" /> Add Training
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {trainings.map((t) => (
                      <div key={t.id} className="card p-5">
                        {t.image_url && (
                          <div className="mb-3 h-32 overflow-hidden rounded-xl">
                            <img src={t.image_url} alt={t.name} className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-serif text-base font-semibold text-forest-900">{t.name}</h4>
                            <p className="text-xs text-charcoal-500">{t.duration} • {formatPrice(t.price)}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteTraining(t.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-charcoal-600 line-clamp-2">{t.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Users tab */}
              {tab === 'users' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-beige-100 text-left text-xs text-charcoal-500">
                          <th className="pb-3 pr-4">Name</th>
                          <th className="pb-3 pr-4">Role</th>
                          <th className="pb-3">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profiles.map((p) => (
                          <tr key={p.id} className="border-b border-beige-50">
                            <td className="py-3 pr-4 text-charcoal-700">{p.full_name || 'Unnamed'}</td>
                            <td className="py-3 pr-4">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                p.role === 'admin' ? 'bg-amber-accent/20 text-amber-deep' : 'bg-forest-100 text-forest-700'
                              }`}>
                                {p.role}
                              </span>
                            </td>
                            <td className="py-3 text-xs text-charcoal-500">{formatDateShort(p.created_at)}</td>
                          </tr>
                        ))}
                        {profiles.length === 0 && (
                          <tr><td colSpan={3} className="py-8 text-center text-charcoal-400">No users yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Reviews tab */}
              {tab === 'reviews' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                  <div className="space-y-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="flex items-start justify-between gap-4 border-b border-beige-50 pb-4 last:border-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-forest-900">{r.author_name}</p>
                            {r.is_sample && (
                              <span className="rounded-full bg-beige-100 px-2 py-0.5 text-[10px] font-medium text-charcoal-500">Sample</span>
                            )}
                          </div>
                          <p className="text-xs text-charcoal-500">{r.training_name}</p>
                          <p className="mt-2 text-sm text-charcoal-600">{r.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-charcoal-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {reviews.length === 0 && (
                      <p className="py-8 text-center text-charcoal-400">No reviews yet.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Training Modal */}
      <Modal isOpen={showAddTraining} onClose={() => setShowAddTraining(false)} maxWidth="max-w-xl">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-semibold text-forest-900">Add New Training</h3>
            <button onClick={() => setShowAddTraining(false)} className="text-charcoal-400 hover:text-charcoal-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Name</label>
              <input value={newTraining.name} onChange={(e) => setNewTraining({ ...newTraining, name: e.target.value })} className="input-field" placeholder="Training name" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Slug</label>
              <input value={newTraining.slug} onChange={(e) => setNewTraining({ ...newTraining, slug: e.target.value })} className="input-field" placeholder="training-slug" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Duration</label>
              <input value={newTraining.duration} onChange={(e) => setNewTraining({ ...newTraining, duration: e.target.value })} className="input-field" placeholder="2 Hours" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Price (₹)</label>
              <input type="number" value={newTraining.price} onChange={(e) => setNewTraining({ ...newTraining, price: e.target.value })} className="input-field" placeholder="3500" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Description</label>
              <textarea value={newTraining.description} onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })} className="input-field" rows={3} placeholder="Training description" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Features (comma-separated)</label>
              <input value={newTraining.features} onChange={(e) => setNewTraining({ ...newTraining, features: e.target.value })} className="input-field" placeholder="Feature 1, Feature 2, Feature 3" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Category</label>
              <select value={newTraining.category} onChange={(e) => setNewTraining({ ...newTraining, category: e.target.value })} className="input-field">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Difficulty</label>
              <select value={newTraining.difficulty} onChange={(e) => setNewTraining({ ...newTraining, difficulty: e.target.value })} className="input-field">
                <option value="beginner">Beginner</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Badge (optional)</label>
              <input value={newTraining.badge} onChange={(e) => setNewTraining({ ...newTraining, badge: e.target.value })} className="input-field" placeholder="Popular" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Seats</label>
              <input type="number" value={newTraining.seats} onChange={(e) => setNewTraining({ ...newTraining, seats: e.target.value })} className="input-field" placeholder="50" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-charcoal-700">Image URL</label>
              <input value={newTraining.image_url} onChange={(e) => setNewTraining({ ...newTraining, image_url: e.target.value })} className="input-field" placeholder="https://..." />
            </div>
          </div>
          <button onClick={handleCreateTraining} className="btn-primary mt-6 w-full">
            Create Training
          </button>
        </div>
      </Modal>
    </div>
  );
}
