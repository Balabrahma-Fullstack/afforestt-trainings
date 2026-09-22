import {
  BookOpen,
  Sprout,
  Hand,
  Mountain,
  Eye,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateShort = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const generateBookingId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let id = 'AFT-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const generateTransactionId = (): string => {
  const chars = '0123456789';
  let id = 'TXN';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const getUpcomingFridays = (count: number = 8): Date[] => {
  const fridays: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextFriday = new Date(today);
  const daysUntilFriday = (5 - today.getDay() + 7) % 7;
  nextFriday.setDate(today.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday));

  for (let i = 0; i < count; i++) {
    const friday = new Date(nextFriday);
    friday.setDate(nextFriday.getDate() + i * 7);
    fridays.push(friday);
  }

  return fridays;
};

export const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isFriday = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return date.getDay() === 5;
};

export const isPastDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const whyLearnFeatures: Feature[] = [
  {
    icon: BookOpen,
    title: 'Practical Knowledge',
    description: 'Learn actionable techniques that you can apply immediately to your own forest creation projects.',
  },
  {
    icon: Sprout,
    title: 'Native Forest Approach',
    description: 'Understand the Miyawaki Method and why native species are critical for biodiversity and resilience.',
  },
  {
    icon: Hand,
    title: 'Hands-on Learning',
    description: 'Go beyond theory with practical exercises, site visits, and real-world forest creation experience.',
  },
  {
    icon: Mountain,
    title: 'Experienced Guidance',
    description: 'Learn from practitioners who have created dozens of native forests across diverse geographies.',
  },
  {
    icon: Eye,
    title: 'Real Project Insights',
    description: 'Gain insights from actual forest creation projects, including challenges, solutions, and outcomes.',
  },
  {
    icon: Users,
    title: 'Community & Continued Learning',
    description: 'Join a community of forest creators and access ongoing support and learning resources.',
  },
];

export interface JourneyStep {
  step: string;
  title: string;
  description: string;
}

export const journeySteps: JourneyStep[] = [
  {
    step: '01',
    title: 'Understand',
    description: 'Learn the fundamentals of native forest creation and the science behind the Miyawaki Method.',
  },
  {
    step: '02',
    title: 'Plan',
    description: 'Understand site conditions, select appropriate native species, and design your forest layout.',
  },
  {
    step: '03',
    title: 'Prepare',
    description: 'Learn soil preparation techniques, biomass mixing, and implementation planning.',
  },
  {
    step: '04',
    title: 'Plant',
    description: 'Understand plantation techniques, spacing patterns, and proper execution methodology.',
  },
  {
    step: '05',
    title: 'Maintain',
    description: 'Learn maintenance schedules, monitoring practices, and long-term forest care strategies.',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: 'What is the Miyawaki Method?',
    answer: 'The Miyawaki Method is an afforestation technique that creates dense, fast-growing native forests by planting multiple native species close together. It accelerates natural succession, producing a self-sustaining forest in 20-30 years compared to the centuries natural forests take.',
  },
  {
    question: 'Who can attend the training?',
    answer: 'Anyone interested in native forest creation — from beginners and hobbyists to landscape architects, CSR teams, and environmental professionals. No prior experience is required for our beginner-level courses.',
  },
  {
    question: 'Are the trainings online or offline?',
    answer: 'Most trainings are conducted online via live sessions. The Offline Workshop is a 5-day in-person immersive experience. The monthly webinar is a live online session.',
  },
  {
    question: 'How do I choose a Friday?',
    answer: 'Regular online training sessions are offered every Friday evening. You can select from upcoming Fridays during the booking process. The date selector automatically shows available future Fridays.',
  },
  {
    question: 'Can I change my booking date?',
    answer: 'Yes, you can change your booking date from the cart before completing checkout. Once a booking is confirmed, date changes are handled on a case-by-case basis — please contact our support team.',
  },
  {
    question: 'What is included in the offline workshop?',
    answer: 'The 5-day offline workshop includes training, food, accommodation, training materials, practical forest creation experience, and expert guidance throughout the program.',
  },
  {
    question: 'Is payment refundable?',
    answer: 'This is a demo platform and no real payments are processed. In a real scenario, our refund policy would cover cancellations made at least 7 days before the scheduled training date.',
  },
  {
    question: 'How will I receive my booking confirmation?',
    answer: 'After completing your booking, you will see a confirmation screen with your unique booking ID and all details. You can also view your bookings from the "My Bookings" page when logged in.',
  },
];
