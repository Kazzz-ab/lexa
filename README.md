# Lexa

> **Practice intelligence for law firms.** Every matter, in focus.

Lexa is where a firm's work lives: client intake, matter tracking, attorney scheduling, and billing in one system that knows how legal work actually flows. A matter isn't an appointment — it spans months, changes hands, accrues hours, and ends in an invoice that has to be right. Lexa models that lifecycle natively.

## Built around the matter

Everything in Lexa hangs off the case record:

- **Numbered automatically** — every matter gets an `LX-YYYY-NNNN` number on creation, so nothing is ever "that one from March."
- **Tracked through a real lifecycle** — `open → active → pending → closed` (with `on-hold` when the world intervenes), plus priority flags from `low` to `urgent`.
- **Tied to its people** — a client, a lead attorney, and the paralegals working it, each seeing exactly what their role allows.
- **Billed the way it was agreed** — hourly, flat-fee, retainer, or contingency. The invoice model is honest about all four.
- **Watched** — court dates and urgent matters surface in the notification bell before they become emergencies.

## What the firm gets

**Partners and admins** see the whole practice: revenue and intake analytics by practice area, a complete audit trail of every action in the system, user and role management, and bulk billing operations.

**Attorneys** get their caseload, their calendar, their court dates, and one-click PDF invoices that look like they came from a firm that has its act together.

**Paralegals** handle intake, keep matters current, and manage billing status without needing permissions they shouldn't have.

Quality-of-life throughout: dark mode, password reset by email (Resend), search and pagination on every list, and legal-profession pages (privacy, terms, professional ethics notice) included.

## Quick start

Prereqs: Node.js 20+, PostgreSQL 15+ (Supabase works).

```bash
git clone https://github.com/yourorg/lexa.git
cd lexa
npm run install:all

# backend/.env — see backend/.env.example
# DATABASE_URL, JWT_SECRET, CLIENT_ORIGIN=http://localhost:5174, PORT=4001

cd backend
npx prisma db push && npx prisma db seed   # schema + sample firm
cd ..
npm run dev                                 # API :4001 · UI :5174
```

Seeded login credentials are printed by the seed script. Rotate them immediately.

## Under the hood

| Layer | Choices |
|---|---|
| API | Express (ESM), JWT auth with role guards, Helmet, rate limiting, audit middleware |
| Data | PostgreSQL via Prisma — Users, Clients, Attorneys, Cases, Invoices |
| UI | React 18 + Vite, Tailwind, Framer Motion, Recharts, Zustand |
| Documents | jsPDF invoice export (all four billing types) |
| Email | Resend for password reset flows |

The API surface is conventional REST under `/api` — `clients`, `attorneys`, `cases`, `invoices`, `analytics`, `notifications`, `stats`, and admin-only `admin/users` + `admin/audit`. Case status transitions and role checks are enforced server-side; the audit middleware records every write with actor, action, and origin, stripping privileged content first.

```
backend/src
├── index.js          # middleware chain: helmet → cors → rate limit → audit → routes
├── middleware/       # auth.js (JWT + roles) · audit.js · errorHandler.js
├── routes/           # one file per resource
├── lib/              # prisma client · email helper
└── scripts/seed.js   # sample firm: attorneys, clients, 20 matters, invoices

frontend/src
├── theme.js          # Lexa brand tokens + UI copy
├── pages/            # Dashboard · Clients · Attorneys · Cases · Invoices · Analytics · admin
├── components/       # layout (Header, Footer, NotificationBell)
└── lib/              # api client · exportPDF
```

## The Lexa look

Ink-violet and porcelain: primary `#4C1D95`, accent `#8B5CF6`, light surfaces in cool off-whites, dark mode in deep violet ink. Fraunces for headings, Inter for everything else. Restrained motion, 8–12px radii, and a shimmer reserved for exactly one headline.

## License

MIT © Lexa.
