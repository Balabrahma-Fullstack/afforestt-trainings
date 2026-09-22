import { useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trees, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Link } from 'react-router-dom';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const { session, signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (session) return <Navigate to="/my-bookings" replace />;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (mode === 'register' && !fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (mode === 'register' && password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          showToast(error, 'error');
        } else {
          showToast('Welcome back!', 'success');
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          showToast(error, 'error');
        } else {
          showToast('Account created successfully!', 'success');
        }
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="container-wide flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
          {/* Left: branding */}
          <div className="relative hidden bg-gradient-to-br from-forest-700 to-forest-950 p-10 lg:flex lg:flex-col lg:justify-between">
            <img
              src="https://images.pexels.com/photos/33164661/pexels-photo-33164661.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Forest"
              className="absolute inset-0 h-full w-full object-cover opacity-20"
            />
            <div className="relative">
              <div className="flex items-center gap-2 text-white">
                <Trees className="h-7 w-7" />
                <span className="font-serif text-xl font-semibold">Afforestt</span>
              </div>
            </div>
            <div className="relative text-white">
              <h2 className="font-serif text-3xl font-semibold leading-tight">
                {mode === 'login' ? 'Welcome back to the forest' : 'Start your forest journey'}
              </h2>
              <p className="mt-3 text-sm text-cream-100/70">
                {mode === 'login'
                  ? 'Log in to view your bookings and continue learning.'
                  : 'Create an account to book trainings and track your learning journey.'}
              </p>
            </div>
            <div className="relative flex gap-3">
              {['Miyawaki', 'Native Forest', 'Practical'].map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-cream-100 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="p-8 sm:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-serif text-2xl font-semibold text-forest-900">
                {mode === 'login' ? 'Log In' : 'Create Account'}
              </h1>
              <p className="mt-1 text-sm text-charcoal-500">
                {mode === 'login' ? 'Enter your credentials to continue.' : 'Fill in your details to get started.'}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jane Doe"
                        className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${
                          errors.fullName ? 'border-red-300 focus:ring-red-100' : 'border-beige-200 focus:border-forest-500 focus:ring-forest-200'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${
                        errors.email ? 'border-red-300 focus:ring-red-100' : 'border-beige-200 focus:border-forest-500 focus:ring-forest-200'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${
                        errors.password ? 'border-red-300 focus:ring-red-100' : 'border-beige-200 focus:border-forest-500 focus:ring-forest-200'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${
                          errors.confirmPassword ? 'border-red-300 focus:ring-red-100' : 'border-beige-200 focus:border-forest-500 focus:ring-forest-200'
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Please wait...' : (
                    <>
                      {mode === 'login' ? 'Log In' : 'Create Account'}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-charcoal-500">
                {mode === 'login' ? (
                  <>Don't have an account? <Link to="/register" className="font-semibold text-forest-700 hover:text-forest-800">Register</Link></>
                ) : (
                  <>Already have an account? <Link to="/login" className="font-semibold text-forest-700 hover:text-forest-800">Log In</Link></>
                )}
              </p>

              <div className="mt-4 rounded-lg bg-cream-100 px-4 py-2.5 text-center text-xs text-charcoal-500">
                Demo platform — your data is stored securely but no real authentication is enforced
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
