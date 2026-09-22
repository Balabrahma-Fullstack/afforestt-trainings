import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import type { Webinar } from '@/types';
import { formatPrice } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';

interface WebinarAnnouncementProps {
  webinars: Webinar[];
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function WebinarAnnouncement({ webinars }: WebinarAnnouncementProps) {
  const navigate = useNavigate();
  const webinar = webinars[0];
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const timeLeft = useCountdown(webinar ? `${webinar.webinar_date}T18:30:00` : '');

  useEffect(() => {
    setCountdown(timeLeft);
  }, [timeLeft]);

  if (!webinar) return null;

  const seatsLeft = webinar.seats - webinar.seats_filled;

  const timeUnits = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ];

  return (
    <section id="webinar" className="section-pad bg-gradient-to-br from-forest-800 to-forest-950">
      <div className="container-wide">
        <div className="overflow-hidden rounded-3xl bg-forest-900/50 ring-1 ring-forest-700/50">
          <div className="grid lg:grid-cols-2">
            {/* Left: content */}
            <div className="p-8 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-accent/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-accent">
                Upcoming Monthly Webinar
              </span>
              <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Live Online Session
              </h2>
              <p className="mt-4 text-base leading-relaxed text-cream-100/70">
                Learn the fundamentals of native forest creation in our live online session.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-forest-800/50 p-4">
                  <div className="flex items-center gap-2 text-forest-300">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium">Date</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {new Date(webinar.webinar_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="rounded-xl bg-forest-800/50 p-4">
                  <div className="flex items-center gap-2 text-forest-300">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">Time</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{webinar.webinar_time}</p>
                </div>
                <div className="rounded-xl bg-forest-800/50 p-4">
                  <span className="text-xs font-medium text-forest-300">Fee</span>
                  <p className="mt-2 text-sm font-semibold text-white">{formatPrice(webinar.price)} only</p>
                </div>
                <div className="rounded-xl bg-forest-800/50 p-4">
                  <div className="flex items-center gap-2 text-forest-300">
                    <Users className="h-4 w-4" />
                    <span className="text-xs font-medium">Seats</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{seatsLeft} remaining</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/book/monthly-webinar')}
                className="btn-amber mt-8 group"
              >
                Reserve My Seat
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Right: countdown */}
            <div className="flex flex-col justify-center bg-forest-800/30 p-8 sm:p-12">
              <h3 className="text-center font-serif text-lg font-semibold text-cream-100">
                Countdown to webinar
              </h3>
              <div className="mt-6 grid grid-cols-4 gap-3">
                {timeUnits.map((unit) => (
                  <div key={unit.label} className="text-center">
                    <motion.div
                      key={unit.value}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="rounded-2xl bg-forest-950/60 p-3 ring-1 ring-forest-700/50"
                    >
                      <div className="font-serif text-2xl font-bold text-white sm:text-3xl">
                        {String(unit.value).padStart(2, '0')}
                      </div>
                    </motion.div>
                    <p className="mt-2 text-xs text-cream-100/60">{unit.label}</p>
                  </div>
                ))}
              </div>

              {/* Seats progress */}
              <div className="mt-8">
                <div className="flex items-center justify-between text-xs text-cream-100/60">
                  <span>Seats filled</span>
                  <span>{webinar.seats_filled}/{webinar.seats}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-forest-950/60">
                  <div
                    className="h-full rounded-full bg-amber-accent"
                    style={{ width: `${(webinar.seats_filled / webinar.seats) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-xs font-medium text-amber-accent">
                  Limited seats — book now!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
