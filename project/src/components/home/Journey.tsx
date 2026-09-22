import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import { journeySteps } from '@/utils/helpers';

export default function Journey() {
  return (
    <section id="journey" className="section-pad bg-forest-950 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <img
          src="https://images.pexels.com/photos/38040358/pexels-photo-38040358.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="container-wide relative">
        <SectionHeading
          eyebrow="Learning Journey"
          title="Your Path to Forest Creation"
          subtitle="Follow a structured journey from understanding the fundamentals to maintaining a thriving native forest."
          light
        />

        {/* Desktop horizontal timeline */}
        <div className="mt-16 hidden lg:block">
          <div className="relative">
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-forest-700" />
            <div className="grid grid-cols-5 gap-6">
              {journeySteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.12 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-forest-600 bg-forest-900 font-serif text-2xl font-semibold text-forest-300">
                    {step.step}
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-100/60">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="mt-12 lg:hidden">
          <div className="relative space-y-8">
            <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-forest-700" />
            {journeySteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative flex items-start gap-6"
              >
                <div className="relative z-10 flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-2 border-forest-600 bg-forest-900 font-serif text-xl font-semibold text-forest-300">
                  {step.step}
                </div>
                <div className="pt-6">
                  <h3 className="font-serif text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-100/60">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
