import { motion } from 'framer-motion';
import { Clock, Check, Calendar, Star } from 'lucide-react';
import type { Training } from '@/types';
import { formatPrice } from '@/utils/helpers';

interface TrainingCardProps {
  training: Training;
  onBook: (training: Training) => void;
  onDetails: (training: Training) => void;
  index: number;
}

export default function TrainingCard({ training, onBook, onDetails, index }: TrainingCardProps) {
  const seatsLeft = training.seats;
  const seatsPercent = Math.min((seatsLeft / training.seats) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {training.image_url && (
          <img
            src={training.image_url}
            alt={training.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/50 to-transparent" />
        {training.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-accent px-3 py-1 text-xs font-semibold text-charcoal-900">
            {training.badge}
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-forest-700 backdrop-blur-sm">
          {training.difficulty}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-charcoal-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{training.duration}</span>
          <span className="text-beige-300">•</span>
          <span className="capitalize">{training.format}</span>
        </div>

        <h3 className="mt-2 font-serif text-lg font-semibold text-forest-900">{training.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-600 line-clamp-3">{training.description}</p>

        {/* Features preview */}
        <ul className="mt-4 space-y-1.5">
          {training.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-charcoal-600">
              <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-forest-500" />
              <span>{feature}</span>
            </li>
          ))}
          {training.features.length > 3 && (
            <li className="text-xs font-medium text-forest-600">+{training.features.length - 3} more</li>
          )}
        </ul>

        {/* Seats indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-charcoal-500">Seats remaining</span>
            <span className="font-medium text-forest-700">{seatsLeft}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-beige-100">
            <div className="h-full rounded-full bg-forest-500" style={{ width: `${seatsPercent}%` }} />
          </div>
        </div>

        {/* Price + actions */}
        <div className="mt-5 flex items-center justify-between border-t border-beige-100 pt-4">
          <div>
            <span className="font-serif text-2xl font-semibold text-forest-800">{formatPrice(training.price)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDetails(training)}
              className="rounded-full px-3 py-2 text-xs font-medium text-forest-700 transition-colors hover:bg-forest-50"
            >
              Details
            </button>
            <button
              onClick={() => onBook(training)}
              className="rounded-full bg-forest-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-forest-700"
            >
              {training.slug === 'offline-workshop' ? 'Choose Date' : training.slug === 'monthly-webinar' ? 'Reserve Seat' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
