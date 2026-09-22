import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { faqItems } from '@/utils/helpers';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-pad bg-white">
      <div className="container-wide">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our training programs and booking process."
        />

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`rounded-xl border transition-colors ${
                  isOpen ? 'border-forest-300 bg-forest-50/50' : 'border-beige-200 bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className={`h-5 w-5 flex-shrink-0 ${isOpen ? 'text-forest-600' : 'text-charcoal-400'}`} />
                    <span className="text-sm font-semibold text-forest-900 sm:text-base">{item.question}</span>
                  </span>
                  <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen ? 'bg-forest-600 text-white' : 'bg-beige-100 text-charcoal-500'
                  }`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 pl-13 text-sm leading-relaxed text-charcoal-600 sm:pl-13">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
