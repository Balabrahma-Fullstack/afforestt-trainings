import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Calendar, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate, getUpcomingFridays, toDateInputValue } from '@/utils/helpers';
import { useState } from 'react';
import DatePicker from '@/components/DatePicker';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, updateDate, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [editingDateIndex, setEditingDateIndex] = useState<number | null>(null);

  const fridays = getUpcomingFridays(6);

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream-50 pt-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest-50">
          <ShoppingBag className="h-10 w-10 text-forest-300" />
        </div>
        <div className="text-center">
          <h2 className="font-serif text-2xl font-semibold text-forest-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-charcoal-600">Browse our trainings and add a program to get started.</p>
        </div>
        <button onClick={() => navigate('/')} className="btn-primary">
          Explore Trainings <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container-wide px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold text-forest-900">Your Cart</h1>
        <p className="mt-2 text-sm text-charcoal-600">{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card p-4 sm:p-5"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  {item.image_url && (
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-28">
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-base font-semibold text-forest-900">{item.name}</h3>
                        <p className="text-xs text-charcoal-500">{item.duration}</p>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(i);
                          showToast('Item removed from cart.', 'info');
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Date */}
                    <div className="mt-2 flex items-center gap-2 text-xs text-charcoal-600">
                      <Calendar className="h-3.5 w-3.5 text-forest-600" />
                      {editingDateIndex === i ? (
                        <select
                          value={item.selectedDate}
                          onChange={(e) => {
                            updateDate(i, e.target.value);
                            setEditingDateIndex(null);
                            showToast('Date updated.', 'success');
                          }}
                          className="rounded-lg border border-beige-200 px-2 py-1 text-xs focus:border-forest-500 focus:outline-none"
                        >
                          {fridays.map((f) => {
                            const val = toDateInputValue(f);
                            return (
                              <option key={val} value={val}>
                                {formatDate(val)}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingDateIndex(i)}
                          className="underline decoration-dotted hover:text-forest-700"
                        >
                          {formatDate(item.selectedDate)}
                        </button>
                      )}
                    </div>

                    {/* Quantity + price */}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(i, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-beige-200 text-charcoal-600 hover:bg-forest-50"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-forest-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(i, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-beige-200 text-charcoal-600 hover:bg-forest-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-lg font-semibold text-forest-800">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                        <div className="text-xs text-charcoal-500">{formatPrice(item.price)} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  clearCart();
                  showToast('Cart cleared.', 'info');
                }}
                className="text-sm font-medium text-charcoal-500 hover:text-red-600"
              >
                Clear cart
              </button>
              <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-sm font-medium text-forest-700 hover:text-forest-800">
                <ArrowLeft className="h-4 w-4" /> Continue shopping
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h3 className="font-serif text-lg font-semibold text-forest-900">Order Summary</h3>
              <div className="mt-4 space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium text-charcoal-800">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-beige-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal-600">Subtotal</span>
                  <span className="font-medium text-charcoal-800">{formatPrice(total)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-charcoal-600">Taxes</span>
                  <span className="font-medium text-charcoal-800">₹0</span>
                </div>
              </div>
              <div className="mt-4 border-t border-beige-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-forest-900">Total</span>
                  <span className="font-serif text-2xl font-semibold text-forest-800">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary mt-6 w-full"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
