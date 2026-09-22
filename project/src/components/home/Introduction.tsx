import { motion } from 'framer-motion';
import { Sprout, Layers, Trees, Shovel, Eye, TrendingUp, Ruler } from 'lucide-react';
import SectionHeading, { FadeIn } from '@/components/SectionHeading';

const introPoints = [
  { icon: Sprout, title: 'Miyawaki Method', desc: 'Understand the core principles of accelerated native forest growth.' },
  { icon: Layers, title: 'Native Species Selection', desc: 'Learn to identify and select the right native species for your region.' },
  { icon: Trees, title: 'Forest Design', desc: 'Master the art of designing dense, multi-layered forest layouts.' },
  { icon: Shovel, title: 'Soil Preparation', desc: 'Prepare soil with the right biomass, mulch and nutrition for growth.' },
  { icon: TrendingUp, title: 'Maintenance & Monitoring', desc: 'Track growth, health and biodiversity of your forest over time.' },
  { icon: Eye, title: 'Practical Implementation', desc: 'Apply your knowledge with real-world plantation techniques.' },
];

const introImage = 'https://images.pexels.com/photos/5027792/pexels-photo-5027792.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function Introduction() {
  return (
    <section id="method" className="section-pad bg-cream-50">
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Image */}
          <FadeIn>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={introImage}
                  alt="Hands holding a young seedling in soil"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-forest-700 p-6 text-white shadow-xl sm:block">
                <div className="font-serif text-3xl font-semibold">100%</div>
                <div className="text-sm text-cream-100/80">Native species</div>
              </div>
            </div>
          </FadeIn>

          {/* Content */}
          <div>
            <SectionHeading
              eyebrow="Introduction"
              title="Learn the Art and Science of Forest Creation"
              center={false}
              subtitle="Our training programs help participants understand every step of the process — from selecting the right native species to monitoring a thriving forest over years."
            />

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {introPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group flex items-start gap-3"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600 transition-colors group-hover:bg-forest-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-forest-900">{point.title}</h4>
                      <p className="mt-1 text-sm text-charcoal-600">{point.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
