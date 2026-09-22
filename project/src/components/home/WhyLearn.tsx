import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import { whyLearnFeatures } from '@/utils/helpers';

export default function WhyLearn() {
  return (
    <section className="section-pad bg-white">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Why Learn With Afforestt?"
          subtitle="We combine scientific methodology with real-world experience to give you the skills to create thriving native forests."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyLearnFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group card card-hover p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest-600 transition-all duration-300 group-hover:bg-forest-600 group-hover:text-white group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-serif text-3xl font-semibold text-beige-200 transition-colors group-hover:text-forest-200">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-lg font-semibold text-forest-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
