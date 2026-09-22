import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trees, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-forest-950 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-center gap-3 text-forest-300">
          <Trees className="h-12 w-12" />
        </div>
        <h1 className="mt-8 font-serif text-7xl font-bold text-white sm:text-9xl">404</h1>
        <p className="mt-4 font-serif text-2xl font-semibold text-cream-100">Page not found</p>
        <p className="mt-2 max-w-md text-sm text-cream-100/60">
          The page you're looking for seems to have wandered off into the forest. Let's find your way back.
        </p>
        <Link to="/" className="btn-amber mt-8 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
