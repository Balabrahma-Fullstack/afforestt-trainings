import { Link } from 'react-router-dom';
import { Trees, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <Trees className="h-7 w-7 text-forest-300" />
              <span className="font-serif text-xl font-semibold text-white">Afforestt</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream-100/70">
              Bringing back native forests. Practical training to understand, design and create
              native forests using the Miyawaki Method.
            </p>
            <div className="mt-6 flex gap-3">
              {[Linkedin, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 transition-colors hover:bg-forest-700"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4 text-cream-100" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream-100/70">
              <li><Link to="/#trainings" className="transition-colors hover:text-forest-300">Trainings</Link></li>
              <li><Link to="/#journey" className="transition-colors hover:text-forest-300">Workshops</Link></li>
              <li><Link to="/#method" className="transition-colors hover:text-forest-300">Method</Link></li>
              <li><Link to="/#webinar" className="transition-colors hover:text-forest-300">Institute</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white">Support</h4>
            <ul className="mt-4 space-y-3 text-sm text-cream-100/70">
              <li><Link to="/#faq" className="transition-colors hover:text-forest-300">FAQ</Link></li>
              <li><a href="mailto:hello@afforestt.com" className="transition-colors hover:text-forest-300">Contact</a></li>
              <li><Link to="/#faq" className="transition-colors hover:text-forest-300">Booking Help</Link></li>
            </ul>
            <div className="mt-4 space-y-2 text-sm text-cream-100/60">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@afforestt.com</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 90000 00000</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Pune, India</p>
            </div>
          </div>

          {/* Newsletter / Demo Notice */}
          <div>
            <h4 className="font-serif text-base font-semibold text-white">Stay Updated</h4>
            <p className="mt-4 text-sm text-cream-100/70">
              Subscribe to receive updates about upcoming trainings and webinars.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-xl border border-forest-700 bg-forest-800 px-4 py-2.5 text-sm text-white placeholder:text-cream-100/40 focus:border-forest-500 focus:outline-none"
              />
              <button className="rounded-xl bg-amber-accent px-4 py-2.5 text-sm font-semibold text-charcoal-900 transition-colors hover:bg-amber-deep">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-forest-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-cream-100/50">
              © 2026 Afforestt Trainings Demo. All rights reserved.
            </p>
            <p className="rounded-full bg-forest-800 px-4 py-1.5 text-xs font-medium text-cream-100/60">
              Demo Project — No real payments processed
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
