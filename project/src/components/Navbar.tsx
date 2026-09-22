import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Trees, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Trainings', path: '/#trainings' },
  { label: 'Method', path: '/#method' },
  { label: 'Workshops', path: '/#journey' },
  { label: 'Reviews', path: '/#reviews' },
  { label: 'FAQ', path: '/#faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { session, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (path: string) => {
    setMobileOpen(false);
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (location.pathname !== route) {
        navigate(route);
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? 'bg-transparent' : 'bg-cream-50/95 backdrop-blur-md shadow-sm'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <button onClick={() => handleNavClick('/')} className="flex items-center gap-2">
            <Trees className={`h-7 w-7 ${isTransparent ? 'text-white' : 'text-forest-600'}`} />
            <span className={`font-serif text-xl font-semibold ${isTransparent ? 'text-white' : 'text-forest-800'}`}>
              Afforestt
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.path)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isTransparent
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-charcoal-700 hover:bg-forest-50 hover:text-forest-700'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/my-bookings"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isTransparent ? 'text-white/90 hover:bg-white/10' : 'text-charcoal-700 hover:bg-forest-50'
                  }`}
                >
                  {profile?.role === 'admin' ? 'Admin' : 'My Bookings'}
                </Link>
                <button
                  onClick={() => signOut()}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isTransparent ? 'text-white/90 hover:bg-white/10' : 'text-charcoal-700 hover:bg-forest-50'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  to="/login"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isTransparent ? 'text-white/90 hover:bg-white/10' : 'text-charcoal-700 hover:bg-forest-50'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    isTransparent
                      ? 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25'
                      : 'bg-forest-600 text-white hover:bg-forest-700'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              className={`relative rounded-full p-2 transition-colors ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-charcoal-700 hover:bg-forest-50'
              }`}
              aria-label="View cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-accent px-1 text-[10px] font-bold text-charcoal-900">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`rounded-full p-2 lg:hidden ${
                isTransparent ? 'text-white hover:bg-white/10' : 'text-charcoal-700 hover:bg-forest-50'
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-forest-100">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path)}
                  className="rounded-xl px-4 py-3 text-left text-sm font-medium text-charcoal-700 hover:bg-forest-50"
                >
                  {link.label}
                </button>
              ))}
              <div className="my-2 h-px bg-beige-200" />
              {session ? (
                <>
                  <Link to="/my-bookings" className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal-700 hover:bg-forest-50">
                    {profile?.role === 'admin' ? 'Admin Dashboard' : 'My Bookings'}
                  </Link>
                  <button onClick={() => signOut()} className="rounded-xl px-4 py-3 text-left text-sm font-medium text-charcoal-700 hover:bg-forest-50">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-xl px-4 py-3 text-sm font-medium text-charcoal-700 hover:bg-forest-50">
                    Login
                  </Link>
                  <Link to="/register" className="mt-1 rounded-xl bg-forest-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-forest-700">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
