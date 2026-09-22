import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Mail, Phone, MapPin, Globe, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate } from '@/utils/helpers';
import type { CustomerDetails } from '@/types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total } = useCart();
  const { showToast } = useToast();
  const [form, setForm] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
  });
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 pt-20">
        <p className="text-lg text-charcoal-600">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Browse Trainings</button>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[+]?[\d\s-]{8,15}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) {
      showToast('Please fill in all required fields correctly.', 'error');
      return;
    }
    sessionStorage.setItem('checkout_customer', JSON.stringify(form));
    sessionStorage.setItem('checkout_cart', JSON.stringify(items));
    sessionStorage.setItem('checkout_total', String(total));
    navigate('/payment');
  };

  const fields: { key: keyof CustomerDetails; label: string; icon: typeof User; type: string; placeholder: string }[] = [
    { key: 'fullName', label: 'Full Name', icon: User, type: 'text', placeholder: 'Jane Doe' },
    { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'jane@example.com' },
    { key: 'phone', label: 'Phone', icon: Phone, type: 'tel', placeholder: '+91 90000 00000' },
    { key: 'city', label: 'City', icon: MapPin, type: 'text', placeholder: 'Pune' },
    { key: 'country', label: 'Country', icon: Globe, type: 'text', placeholder: 'India' },
  ];

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container-wide px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-charcoal-500">
          <button onClick={() => navigate('/cart')} className="flex items-center gap-1 hover:text-forest-700">
            <ArrowLeft className="h-4 w-4" /> Cart
          </button>
          <span>/</span>
          <span className="font-medium text-forest-700">Checkout</span>
          <span>/</span>
          <span className="text-charcoal-400">Payment</span>
          <span>/</span>
          <span className="text-charcoal-400">Confirmation</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-semibold text-forest-900">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left: form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card p-6"
            >
              <h2 className="font-serif text-xl font-semibold text-forest-900">Customer Details</h2>
              <p className="mt-1 text-sm text-charcoal-500">Please provide your details for the booking.</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {fields.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} className={field.key === 'fullName' || field.key === 'email' ? 'sm:col-span-2' : ''}>
                      <label className="mb-1.5 block text-sm font-medium text-charcoal-700">{field.label}</label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                        <input
                          type={field.type}
                          value={form[field.key]}
                          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 ${
                            errors[field.key]
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                              : 'border-beige-200 focus:border-forest-500 focus:ring-forest-200'
                          }`}
                        />
                      </div>
                      {errors[field.key] && <p className="mt-1 text-xs text-red-600">{errors[field.key]}</p>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right: order summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h3 className="font-serif text-lg font-semibold text-forest-900">Order Summary</h3>
              <div className="mt-4 space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {item.image_url && (
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal-800">{item.name}</p>
                      <p className="text-xs text-charcoal-500">{formatDate(item.selectedDate)}</p>
                      <p className="text-xs text-charcoal-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-forest-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-beige-100 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal-600">Subtotal</span>
                  <span className="font-medium text-charcoal-800">{formatPrice(total)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-charcoal-600">Taxes</span>
                  <span className="font-medium text-charcoal-800">₹0</span>
                </div>
              </div>
              <div className="mt-4 border-t border-beige-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-forest-900">Total</span>
                  <span className="font-serif text-2xl font-semibold text-forest-800">{formatPrice(total)}</span>
                </div>
              </div>

              <button onClick={handleContinue} className="btn-primary mt-6 w-full">
                Continue to Payment <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-charcoal-400">
                <Check className="h-3.5 w-3.5 text-forest-500" />
                Demo checkout — no real charges
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
