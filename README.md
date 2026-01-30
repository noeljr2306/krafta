# KRAFTA

A full-stack demo application that connects customers with verified local service providers (electricians, plumbers, cleaners, etc.). This README is tailored to the current codebase.

---

## 🚀 Quick overview

- Framework: **Next.js 16** (App Router, TypeScript)
- UI: **Tailwind CSS v4** (+ shadcn/ui components)
- Auth: **next-auth** (Credentials provider + Google OAuth support)
- ORM: **Prisma** (default: SQLite in development)
- DB seed + demo data included (see `prisma/seed.ts`)

---

## Features

- Email/password sign-up and sign-in (Credentials provider)
- Google OAuth (requires `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`)
- Role-based users: **CUSTOMER**, **PROFESSIONAL**, **ADMIN**
- Customer: browse technicians, create bookings, submit reviews
- Technician: manage profile, accept/reject bookings, view jobs
- Admin: view users, verify technicians, basic platform insights
- Protected routes via `middleware.ts`

---

## Local development (Windows / macOS / Linux) ✅

### Prerequisites

- Node.js 18+ (recommended)
- npm (or yarn)

### Install & run

1. Clone and install:

```bash
git clone <repository-url>
cd krafta
npm install
```

2. Copy example env and update values:

```bash
copy .env.example .env   # Windows (PowerShell/CMD)
# or
cp .env.example .env     # macOS / Linux
```

Important env variables used by the project:

- `DATABASE_URL` — defaults to a local SQLite file (`file:./dev.db`) in this repo
- `NEXTAUTH_SECRET` — set a long random string for production
- `NEXTAUTH_URL` — e.g. `http://localhost:3000`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional for OAuth

3. Generate Prisma client, run migrations and seed the DB:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

4. Start dev server:

```bash
npm run dev
```

Open http://localhost:3000

---

## Notes about the database and seeding 🔧

- This project is configured to use **SQLite** by default (see `prisma/schema.prisma`).
  - For local development this is the simplest option: `DATABASE_URL="file:./dev.db"`.
  - If you prefer PostgreSQL/Supabase, set `DATABASE_URL` to your Postgres connection string and run migrations.

- The seed script (`prisma/seed.ts`) creates demo users, technicians, bookings and reviews. The seeded users do not include plaintext passwords or hashed passwords by default. Use the app's signup flow to create password-based accounts, or update `hashedPassword` manually for test accounts.

- A development-only default admin login is implemented in the credentials provider for convenience (in `lib/auth.ts`):
  - Email: `admin@krafta.com`
  - Password: `krafta2026`

---

## Authentication details

- Uses `@next-auth/prisma-adapter` + `next-auth`.
- Credentials provider uses `bcryptjs` to compare passwords for users that have a `hashedPassword` value.
- Google OAuth provider is configured but requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` environment variables to work.

---

## Useful scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — run production server
- `npm run lint` — run ESLint
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate` — run `prisma migrate dev`
- `npm run prisma:studio` — opens Prisma Studio
- `npm run db:seed` — run the seed script (`prisma db seed`)

---

## Project structure (short)

- `app/` — Next.js App Router pages and server actions
- `components/` — UI components grouped by feature
- `lib/` — app utilities (auth, Prisma client)
- `prisma/` — `schema.prisma`, migrations and `seed.ts`
- `public/` — static assets

---

## Development tips 💡

- Use `npx prisma studio` to inspect and edit data in the DB during development.
- If you change the Prisma schema, run `npx prisma migrate dev` then `npx prisma generate`.
- When testing credentials sign-in, either set a `hashedPassword` for a seed user or use the signup UI.

---

## License

MIT
