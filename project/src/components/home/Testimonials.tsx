import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Review } from '@/types';
import SectionHeading from '@/components/SectionHeading';

interface TestimonialsProps {
  reviews: Review[];
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  const [index, setIndex] = useState(0);

  if (reviews.length === 0) return null;

  const visibleReviews = reviews.length <= 3 ? reviews : [reviews[index], reviews[(index + 1) % reviews.length], reviews[(index + 2) % reviews.length]];

  const next = () => setIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="section-pad bg-beige-50">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Learners Say"
          subtitle="Hear from participants who have trained with us and gone on to create their own native forests."
        />

        <div className="mt-12">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 lg:grid-cols-3"
              >
                {visibleReviews.map((review) => (
                  <div key={review.id} className="card card-hover flex flex-col p-6">
                    <Quote className="h-8 w-8 text-forest-200" />
                    <div className="mt-3 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? 'fill-amber-accent text-amber-accent' : 'text-beige-200'}`}
                        />
                      ))}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-charcoal-700">
                      "{review.content}"
                    </p>
                    <div className="mt-5 border-t border-beige-100 pt-4">
                      <p className="font-serif text-base font-semibold text-forest-900">{review.author_name}</p>
                      <p className="text-xs text-charcoal-500">{review.training_name}</p>
                      {review.is_sample && (
                        <span className="mt-1 inline-block rounded-full bg-beige-100 px-2 py-0.5 text-[10px] font-medium text-charcoal-500">
                          Sample testimonial
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {reviews.length > 3 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={prev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-beige-200 bg-white text-forest-700 transition-colors hover:bg-forest-50"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-1.5">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === index ? 'w-6 bg-forest-600' : 'w-2 bg-beige-300'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-beige-200 bg-white text-forest-700 transition-colors hover:bg-forest-50"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
