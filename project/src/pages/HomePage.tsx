import { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import Introduction from '@/components/home/Introduction';
import TrainingGrid from '@/components/home/TrainingGrid';
import WhyLearn from '@/components/home/WhyLearn';
import Journey from '@/components/home/Journey';
import WebinarAnnouncement from '@/components/home/WebinarAnnouncement';
import Testimonials from '@/components/home/Testimonials';
import FAQ from '@/components/home/FAQ';
import Loader from '@/components/Loader';
import { fetchTrainings, fetchWebinars, fetchReviews } from '@/services/api';
import type { Training, Webinar, Review } from '@/types';

export default function HomePage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, w, r] = await Promise.all([
          fetchTrainings(),
          fetchWebinars(),
          fetchReviews(),
        ]);
        setTrainings(t);
        setWebinars(w);
        setReviews(r);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="pt-20"><Loader label="Loading trainings..." /></div>;

  return (
    <>
      <Hero />
      <Introduction />
      <TrainingGrid trainings={trainings} />
      <WhyLearn />
      <Journey />
      <WebinarAnnouncement webinars={webinars} />
      <Testimonials reviews={reviews} />
      <FAQ />
    </>
  );
}
