import { motion } from 'framer-motion';
import { ArrowRight, Play, Trees, Sprout, Hand } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const heroImage = 'https://images.pexels.com/photos/7867865/pexels-photo-7867865.jpeg?auto=compress&cs=tinysrgb&w=1920';

const floatingBadges = [
  { label: 'Native Forest', icon: Trees },
  { label: 'Miyawaki Method', icon: Sprout },
  { label: 'Practical Learning', icon: Hand },
];

export default function Hero() {
  const navigate = useNavigate();

  const scrollToTrainings = () => {
    document.getElementById('trainings')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWebinar = () => {
    document.getElementById('webinar')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Dense tropical rainforest canopy from above" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pt-20 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cream-100 backdrop-blur-sm ring-1 ring-white/20">
            Learn • Practice • Create
          </span>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
            Learn to Create<br />Native Forests
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/80 sm:text-lg">
            Practical training to understand, design and create native forests using the
            Miyawaki Method.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={scrollToTrainings} className="btn-primary group">
              Explore Trainings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={scrollToWebinar} className="btn-secondary border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              <Play className="h-4 w-4" />
              View Upcoming Webinar
            </button>
          </div>

          {/* Floating badges */}
          <div className="mt-12 flex flex-wrap gap-3">
            {floatingBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-cream-100 backdrop-blur-sm ring-1 ring-white/15 animate-float"
                  style={{ animationDelay: `${i * 1.5}s` }}
                >
                  <Icon className="h-4 w-4 text-forest-300" />
                  {badge.label}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-white/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
