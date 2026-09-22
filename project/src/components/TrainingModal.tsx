import { motion } from 'framer-motion';
import { Clock, Check, Users, Star, Calendar, MapPin } from 'lucide-react';
import type { Training } from '@/types';
import { formatPrice } from '@/utils/helpers';
import Modal from './Modal';
import DatePicker from './DatePicker';

interface TrainingModalProps {
  training: Training | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (training: Training, date: string) => void;
}

const audiences: Record<string, string[]> = {
  'crash-course': ['Beginners curious about forest creation', 'Students and environmental enthusiasts', 'CSR team members seeking an overview'],
  'detailed-training': ['Landscape architects', 'NGO professionals', 'Environmental consultants'],
  'in-depth-training': ['Forest creators', 'CSR project managers', 'Environmental entrepreneurs'],
  'offline-workshop': ['Practitioners wanting hands-on experience', 'Forest project leads', 'Conservation professionals'],
  'monthly-webinar': ['Anyone new to the Miyawaki Method', 'Working professionals seeking a brief introduction', 'Students and nature enthusiasts'],
};

export default function TrainingModal({ training, isOpen, onClose, onBook }: TrainingModalProps) {
  if (!training) return null;

  const allowCustom = training.slug === 'offline-workshop';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl">
      <div className="relative">
        {/* Hero image */}
        <div className="relative h-56 overflow-hidden rounded-t-2xl sm:h-64">
          {training.image_url && (
            <img src={training.image_url} alt={training.name} className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {training.badge && (
              <span className="mb-2 inline-block rounded-full bg-amber-accent px-3 py-1 text-xs font-semibold text-charcoal-900">
                {training.badge}
              </span>
            )}
            <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">{training.name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-cream-100/80">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {training.duration}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> <span className="capitalize">{training.format}</span></span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4" /> {training.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[50vh] overflow-y-auto p-5 sm:p-6 scrollbar-hide">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <h3 className="font-serif text-base font-semibold text-forest-900">About this training</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{training.description}</p>

              <h3 className="mt-6 font-serif text-base font-semibold text-forest-900">What you will learn</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {training.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-charcoal-700">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-6 font-serif text-base font-semibold text-forest-900">Who should attend</h3>
              <ul className="mt-3 space-y-2">
                {(audiences[training.slug] || ['Anyone interested in native forest creation']).map((audience, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-charcoal-700">
                    <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-500" />
                    <span>{audience}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl bg-cream-100 p-4">
                <h3 className="font-serif text-sm font-semibold text-forest-900">Training format</h3>
                <p className="mt-1 text-sm text-charcoal-600">
                  {training.format === 'offline'
                    ? 'In-person, immersive training with accommodation and meals included.'
                    : 'Live online session with interactive Q&A. Recording access included.'}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="rounded-xl border border-beige-200 p-4">
                <div className="text-xs text-charcoal-500">Price</div>
                <div className="mt-1 font-serif text-3xl font-semibold text-forest-800">{formatPrice(training.price)}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-charcoal-500">
                  <Users className="h-3.5 w-3.5" /> {training.seats} seats per session
                </div>
              </div>

              <div className="rounded-xl border border-beige-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-forest-600" />
                  <span className="text-sm font-semibold text-forest-900">Available dates</span>
                </div>
                <DatePicker
                  selectedDate=""
                  onSelect={() => {}}
                  allowCustom={allowCustom}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-beige-100 bg-white p-4 sm:px-6">
          <div>
            <span className="text-xs text-charcoal-500">Starting from</span>
            <div className="font-serif text-xl font-semibold text-forest-800">{formatPrice(training.price)}</div>
          </div>
          <button
            onClick={() => {
              onBook(training, '');
              onClose();
            }}
            className="btn-primary flex-1 sm:flex-none"
          >
            {training.slug === 'offline-workshop' ? 'Choose Date & Book' : training.slug === 'monthly-webinar' ? 'Reserve Seat' : 'Book Now'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
