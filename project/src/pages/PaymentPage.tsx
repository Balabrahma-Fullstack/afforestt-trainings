import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, ShieldCheck, Smartphone, CreditCard,
  Building2, Wallet, Check, Loader2, Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatPrice, formatDate, generateTransactionId } from '@/utils/helpers';
import type { PaymentMethod, CustomerDetails } from '@/types';

const methods: { id: PaymentMethod; label: string; icon: typeof Smartphone }[] = [
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'debit', label: 'Debit Card', icon: CreditCard },
  { id: 'credit', label: 'Credit Card', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

const banks = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Other'];
const wallets = ['Paytm', 'PhonePe', 'Other'];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [processing, setProcessing] = useState(false);

  // Form states
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [bank, setBank] = useState('');
  const [walletChoice, setWalletChoice] = useState('');

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream-50 pt-20">
        <p className="text-lg text-charcoal-600">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Browse Trainings</button>
      </div>
    );
  }

  const customer = JSON.parse(sessionStorage.getItem('checkout_customer') || '{}') as CustomerDetails;
  const checkoutTotal = parseInt(sessionStorage.getItem('checkout_total') || '0');

  const handlePay = async () => {
    // Validate per method
    if (method === 'upi' && (!upiId || !upiId.includes('@'))) {
      showToast('Please enter a valid UPI ID (e.g. name@upi).', 'error');
      return;
    }
    if ((method === 'debit' || method === 'credit') && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      showToast('Please fill in all card details.', 'error');
      return;
    }
    if (method === 'netbanking' && !bank) {
      showToast('Please select a bank.', 'error');
      return;
    }
    if (method === 'wallet' && !walletChoice) {
      showToast('Please select a wallet.', 'error');
      return;
    }

    setProcessing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);

    const transactionId = generateTransactionId();
    sessionStorage.setItem('payment_method', method);
    sessionStorage.setItem('payment_transaction_id', transactionId);

    clearCart();
    showToast('Demo payment successful!', 'success');
    navigate('/confirmation');
  };

  const displayTotal = checkoutTotal || total;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container-wide px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-charcoal-500">
          <button onClick={() => navigate('/checkout')} className="flex items-center gap-1 hover:text-forest-700">
            <ArrowLeft className="h-4 w-4" /> Checkout
          </button>
          <span>/</span>
          <span className="font-medium text-forest-700">Payment</span>
          <span>/</span>
          <span className="text-charcoal-400">Confirmation</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-semibold text-forest-900">Choose Payment Method</h1>

        {/* Demo notice */}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-amber-accent/10 px-4 py-3 text-sm text-amber-deep ring-1 ring-amber-accent/20">
          <ShieldCheck className="h-5 w-5 flex-shrink-0" />
          <span><strong>Demo Payment:</strong> This is a simulated checkout. No real money will be charged. Do not enter real card details.</span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left: payment methods */}
          <div className="lg:col-span-2">
            {/* Method tabs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {methods.map((m) => {
                const Icon = m.icon;
                const isActive = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      isActive ? 'border-forest-600 bg-forest-50' : 'border-beige-200 bg-white hover:border-forest-300'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isActive ? 'text-forest-600' : 'text-charcoal-500'}`} />
                    <span className={`text-xs font-medium ${isActive ? 'text-forest-700' : 'text-charcoal-600'}`}>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Method forms */}
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="card mt-6 p-6"
            >
              <AnimatePresence mode="wait">
                {method === 'upi' && (
                  <motion.div key="upi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="font-serif text-lg font-semibold text-forest-900">Pay via UPI</h3>
                    <p className="mt-1 text-sm text-charcoal-500">Enter your UPI ID to proceed.</p>
                    <div className="mt-4">
                      <label className="mb-1.5 block text-sm font-medium text-charcoal-700">UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="name@upi"
                        className="input-field"
                      />
                      <p className="mt-2 text-xs text-charcoal-400">Example: yourname@okhdfcbank, 9876543210@paytm</p>
                    </div>
                    <button
                      onClick={() => upiId.includes('@') ? showToast('UPI ID verified (demo).', 'success') : showToast('Enter a valid UPI ID.', 'error')}
                      className="btn-secondary mt-4"
                    >
                      Verify UPI
                    </button>
                  </motion.div>
                )}

                {(method === 'debit' || method === 'credit') && (
                  <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="font-serif text-lg font-semibold text-forest-900">
                      {method === 'credit' ? 'Credit' : 'Debit'} Card
                    </h3>
                    <p className="mt-1 text-sm text-charcoal-500">Enter dummy card details. Do not use real card information.</p>
                    <div className="mt-4 grid gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="4111 1111 1111 1111"
                          className="input-field font-mono"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Card Holder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="JANE DOE"
                          className="input-field uppercase"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="12/27"
                            className="input-field font-mono"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-charcoal-700">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="•••"
                            className="input-field font-mono"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {method === 'netbanking' && (
                  <motion.div key="netbanking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="font-serif text-lg font-semibold text-forest-900">Net Banking</h3>
                    <p className="mt-1 text-sm text-charcoal-500">Select your bank to proceed.</p>
                    <div className="mt-4 space-y-2">
                      {banks.map((b) => (
                        <button
                          key={b}
                          onClick={() => setBank(b)}
                          className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                            bank === b ? 'border-forest-600 bg-forest-50 text-forest-700' : 'border-beige-200 text-charcoal-600 hover:border-forest-300'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Building2 className="h-5 w-5" /> {b}
                          </span>
                          {bank === b && <Check className="h-4 w-4 text-forest-600" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {method === 'wallet' && (
                  <motion.div key="wallet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className="font-serif text-lg font-semibold text-forest-900">Wallet</h3>
                    <p className="mt-1 text-sm text-charcoal-500">Choose a wallet to pay.</p>
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {wallets.map((w) => (
                        <button
                          key={w}
                          onClick={() => setWalletChoice(w)}
                          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-all ${
                            walletChoice === w ? 'border-forest-600 bg-forest-50 text-forest-700' : 'border-beige-200 text-charcoal-600 hover:border-forest-300'
                          }`}
                        >
                          <Wallet className="h-5 w-5" /> {w}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: summary */}
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
              {customer.fullName && (
                <div className="mt-4 rounded-xl bg-cream-100 p-3 text-sm">
                  <p className="font-medium text-forest-900">{customer.fullName}</p>
                  <p className="text-xs text-charcoal-500">{customer.email}</p>
                  <p className="text-xs text-charcoal-500">{customer.phone}</p>
                </div>
              )}
              <div className="mt-4 border-t border-beige-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-forest-900">Total</span>
                  <span className="font-serif text-2xl font-semibold text-forest-800">{formatPrice(displayTotal)}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay {formatPrice(displayTotal)}
                  </>
                )}
              </button>

              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-charcoal-400">
                <ShieldCheck className="h-3.5 w-3.5 text-forest-500" />
                Demo payment — 100% secure simulation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
