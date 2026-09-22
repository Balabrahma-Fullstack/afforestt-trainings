import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Training } from '@/types';
import TrainingCard from '@/components/TrainingCard';
import TrainingModal from '@/components/TrainingModal';
import SectionHeading from '@/components/SectionHeading';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

interface TrainingGridProps {
  trainings: Training[];
}

type FilterCategory = 'all' | 'online' | 'offline' | 'beginner' | 'advanced';

const filters: { label: string; value: FilterCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Advanced', value: 'advanced' },
];

export default function TrainingGrid({ trainings }: TrainingGridProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [modalTraining, setModalTraining] = useState<Training | null>(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return trainings.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'online' && t.category === 'online') ||
        (filter === 'offline' && t.category === 'offline') ||
        (filter === 'beginner' && t.difficulty === 'beginner') ||
        (filter === 'advanced' && t.difficulty === 'advanced');
      return matchesSearch && matchesFilter;
    });
  }, [trainings, search, filter]);

  const handleBook = (training: Training) => {
    navigate(`/book/${training.slug}`);
  };

  const handleDetails = (training: Training) => {
    setModalTraining(training);
  };

  const handleModalBook = (training: Training, _date: string) => {
    addToCart(training, new Date().toISOString().split('T')[0]);
    showToast(`${training.name} added to cart!`, 'success');
  };

  return (
    <section id="trainings" className="section-pad bg-beige-50">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Training Programs"
          title="Choose Your Training"
          subtitle="Choose a learning experience that matches your goals."
        />

        {/* Search + Filter */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search training..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-beige-200 bg-white py-2.5 pl-10 pr-4 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-200"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-charcoal-500" />
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f.value
                    ? 'bg-forest-600 text-white'
                    : 'bg-white text-charcoal-600 ring-1 ring-beige-200 hover:bg-forest-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((training, i) => (
              <TrainingCard
                key={training.id}
                training={training}
                onBook={handleBook}
                onDetails={handleDetails}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-charcoal-500">No trainings match your search. Try a different filter.</p>
          </div>
        )}
      </div>

      <TrainingModal
        training={modalTraining}
        isOpen={!!modalTraining}
        onClose={() => setModalTraining(null)}
        onBook={handleModalBook}
      />
    </section>
  );
}
