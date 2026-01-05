# KRAFTA

A production-ready full-stack web application that connects users with verified local service providers (electricians, plumbers, AC repair, mechanics, cleaners, etc.).

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** (v4)
- **shadcn/ui** (UI components)
- **NextAuth.js** (Credentials + OAuth ready)
- **PostgreSQL** (Prisma ORM)
- **Server Actions** + API Routes

## Features

### Authentication
- Email + password (Credentials provider)
- OAuth-ready (Google setup placeholder)
- Role-based auth (Customer, Technician, Admin)
- Protected routes and dashboards
- Session-based access control

### User Roles

#### Customer
- Sign up / login
- Browse service categories
- View nearby technicians (mock geolocation)
- View technician profile pages (skills, pricing, rating, availability)
- Book a service
- Track booking status (pending, accepted, completed)
- Submit reviews and ratings

#### Technician
- Register as a technician
- Create and update profile (skills, pricing, location)
- Accept or decline bookings
- Set pricing and schedule
- View job history
- See customer reviews

#### Admin
- View all users and technicians
- Approve / verify technicians
- View bookings and disputes
- Simple analytics (total users, bookings, active technicians)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase account - recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd krafta
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**For Supabase (Recommended):**
- See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions
- Get connection string from: Supabase Dashboard → Settings → Database
- Format: `postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require`

**For Local PostgreSQL:**
```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/krafta"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

After seeding, you can use these demo accounts:

- **Admin**: `admin@krafta.local` (password set in seed script)
- **Customer**: `customer@krafta.local` (password set in seed script)
- **Technician**: `maria@krafta.local` (password set in seed script)

Note: Passwords need to be set manually in the database or via the signup flow.

## Project Structure

```
krafta/
├── app/
│   ├── actions/          # Server actions
│   │   ├── auth.ts       # Authentication actions
│   │   ├── booking.ts    # Booking management
│   │   ├── review.ts     # Review submission
│   │   └── admin.ts      # Admin actions
│   ├── api/              # API routes
│   │   └── auth/         # NextAuth routes
│   ├── auth/             # Auth pages
│   │   ├── login/
│   │   └── signup/
│   ├── customer/         # Customer dashboard & pages
│   ├── technician/       # Technician dashboard
│   ├── admin/            # Admin dashboard
│   └── page.tsx          # Landing page
├── components/
│   ├── auth/             # Auth components
│   ├── booking/          # Booking components
│   ├── review/           # Review components
│   ├── admin/            # Admin components
│   └── layout/           # Layout components
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   └── prisma.ts         # Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── middleware.ts         # Route protection
```

## Key Features Implemented

✅ **Authentication & Authorization**
- NextAuth with credentials provider
- Role-based access control
- Protected routes via middleware
- Session management

✅ **Customer Features**
- Browse technicians
- View technician profiles
- Create booking requests
- Track booking status
- Submit reviews

✅ **Technician Features**
- View incoming bookings
- Accept/reject bookings
- Set pricing and schedule
- Mark jobs as completed
- View profile stats

✅ **Admin Features**
- Platform analytics
- Technician verification
- View all bookings
- User management

✅ **UI/UX**
- Modern SaaS-style design
- Fully responsive (mobile-first)
- Dark theme
- Loading states and error handling

## Database Schema

- **User**: Authentication and user data
- **Technician**: Service provider profiles
- **Booking**: Service requests and status
- **Review**: Customer ratings and feedback
- **Account/Session**: NextAuth tables

## Development

### Running Migrations

```bash
npx prisma migrate dev
```

### Seeding Database

```bash
npx prisma db seed
```

### Viewing Database

```bash
npx prisma studio
```

## Production Deployment

1. Set up production database
2. Update environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Build: `npm run build`
5. Start: `npm start`

## License

MIT
