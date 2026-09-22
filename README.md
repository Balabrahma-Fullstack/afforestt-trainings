# Afforestt Trainings — Demo Platform

A premium, full-stack web application inspired by Afforestt, where users can explore forest creation training programs, select dates, book trainings, choose a payment method, and receive a booking confirmation. Built as a demo/assignment project — no real payments are processed.

## Project Overview

Afforestt Trainings is an eco-learning + e-commerce platform that lets visitors:

- Browse and filter training programs (Crash Course, Detailed, In-depth, Offline Workshop, Monthly Webinar)
- View detailed training information in a modal
- Select training dates (Fridays are dynamically generated)
- Add trainings to a cart with quantity and date management
- Complete a checkout flow with customer details
- Pay via a demo payment system (UPI, Debit Card, Credit Card, Net Banking, Wallet)
- Receive a booking confirmation with a unique booking ID
- Register/Login to view and manage bookings
- Access an admin dashboard for managing trainings, bookings, users, and reviews

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Routing | React Router DOM |
| Backend/DB | Supabase (PostgreSQL, Auth, RLS) |

## Features

- Premium forest-inspired design with deep green, cream, beige, and amber palette
- Sticky responsive navbar with transparent-to-solid transition
- Hero section with animated entrance and floating badges
- Interactive training catalog with search and filter (All, Online, Offline, Beginner, Advanced)
- Training detail modal with full course information
- Dynamic date picker generating upcoming Fridays
- Cart system persisted with localStorage
- Multi-step checkout: Cart → Customer Details → Demo Payment → Confirmation
- 5 demo payment methods with realistic UI (no real charges)
- Booking confirmation with printable summary and copyable booking ID
- User authentication (email/password via Supabase Auth)
- My Bookings page for logged-in users
- Admin dashboard with stats, bookings management, training CRUD, user list, review management
- Testimonials carousel with real + clearly-marked sample reviews
- FAQ accordion
- Countdown timer for upcoming webinar
- 404 page
- Toast notifications
- Back-to-top button
- Fully responsive (320px → 1440px+)
- Accessible (semantic HTML, ARIA labels, keyboard navigation, focus states)

## Folder Structure

```
project/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── home/
│   │   │   ├── FAQ.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Introduction.tsx
│   │   │   ├── Journey.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── TrainingGrid.tsx
│   │   │   ├── WebinarAnnouncement.tsx
│   │   │   └── WhyLearn.tsx
│   │   ├── BackToTop.tsx
│   │   ├── DatePicker.tsx
│   │   ├── Footer.tsx
│   │   ├── Loader.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── TrainingCard.tsx
│   │   └── TrainingModal.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── ToastContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── AdminPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── BookPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── ConfirmationPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── MyBookingsPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── PaymentPage.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase/
│   └── migrations/
│       ├── afforestt_trainings_schema.sql
│       └── afforestt_seed_data.sql
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Installation

```bash
npm install
npm run dev
```

The development server runs automatically. Supabase environment variables are pre-configured.

## Database

The application uses Supabase (PostgreSQL) with the following tables:

- **trainings** — Training catalog (prices, durations, features, badges)
- **webinars** — Upcoming webinar schedule
- **bookings** — User bookings with payment and booking status
- **reviews** — Testimonials (with `is_sample` flag for demo content)
- **profiles** — User profiles linked to Supabase Auth (with `role` for admin access)

Row Level Security (RLS) is enabled on all tables. Trainings, webinars, and reviews are publicly readable. Bookings are owner-scoped. Admin operations check `profiles.role = 'admin'`.

## API Endpoints (via Supabase)

The frontend communicates directly with Supabase tables and auth:

- **Auth**: `signUp`, `signInWithPassword`, `signOut`, `getSession`
- **Trainings**: `SELECT` from `trainings` (public), `INSERT/UPDATE/DELETE` (admin)
- **Bookings**: `INSERT` (authenticated), `SELECT` (owner + admin)
- **Reviews**: `SELECT` (public), `INSERT` (authenticated), `DELETE` (admin)
- **Webinars**: `SELECT` (public), admin CRUD

## Demo Payment

The payment system is a simulation. No real money is charged. Five methods are supported:

1. **UPI** — Enter a UPI ID (e.g., name@upi) with a verify button
2. **Debit Card** — Dummy card number, holder name, expiry, CVV
3. **Credit Card** — Same form as debit card
4. **Net Banking** — Select from SBI, HDFC, ICICI, Axis, Other
5. **Wallet** — Choose Paytm, PhonePe, or Other

After "payment," a transaction ID is generated and the user is taken to the confirmation page.

## Admin Access

The first registered user is automatically assigned the `admin` role. Admin users can access `/admin` to:

- View dashboard stats (total users, bookings, revenue, trainings)
- Manage bookings (change status)
- Add/delete trainings
- View all users
- Delete reviews

## Deployment

### Frontend (Vercel)
```bash
npm run build
```
Deploy the `dist/` folder to Vercel. Environment variables are pre-configured.

### Backend (Supabase)
Supabase is already provisioned. Migrations are applied via the Supabase MCP tools.

## Screenshots

The application renders a premium forest-themed UI with:
- Full-screen hero with rainforest canopy
- Training cards with hover effects
- Interactive date selection
- Animated countdown timer
- Glassmorphism navbar
- Dark green footer

## Future Improvements

- Real Razorpay test-mode integration (structured for environment variables)
- Email confirmation via Supabase Edge Functions
- Wishlist/favorites
- Training comparison feature
- Pagination for bookings
- Bulk booking for organizations
- Calendar integration for training reminders

---

**Disclaimer**: This is a demo project for assignment purposes. No real payments are processed. Afforestt is used only as visual/content inspiration — all UI is original.
