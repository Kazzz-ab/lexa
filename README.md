<div align="center">

# ⚖️ CounselFlow

**Modern case management for ambitious law firms.**

[![License: MIT](https://img.shields.io/badge/License-MIT-navy.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://prisma.io)

</div>

---

## Overview

CounselFlow is a full-stack legal case management platform built for modern law firms. It unifies client intake, matter management, attorney scheduling, and billing in one polished, ethics-aware interface — designed to help legal professionals focus on counsel, not administration.

<table>
<tr>
<td width="50%">

**For Managing Partners & Admins**
- Full user + role management
- Analytics: revenue, case intake, practice breakdown
- Full audit trail of every system action
- Bulk billing status management

</td>
<td width="50%">

**For Attorneys & Paralegals**
- Court date & urgent-case notifications
- One-click PDF invoice generation
- Auto case numbering (CF-YYYY-NNNN)
- Matter status tracking across practice areas

</td>
</tr>
</table>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Role-Based Access** | Three roles: Admin, Attorney, Paralegal — each with scoped permissions |
| 🔔 **Smart Notifications** | Bell dropdown for urgent cases, upcoming court dates & overdue invoices |
| 📄 **PDF Billing** | One-click branded invoice export — supports hourly, flat-fee, retainer, contingency |
| 🌙 **Dark Mode** | System-aware theme with manual toggle, persisted to localStorage |
| 📊 **Analytics** | Case intake trends, revenue charts, practice area breakdowns via Recharts |
| ☑️ **Bulk Actions** | Multi-select invoices → bulk status update in one click |
| 🛡️ **Admin Panel** | Create users, change roles, remove team members |
| 📋 **Audit Log** | Every write operation captured — who, what, when, from where |
| 🔑 **Password Reset** | Email-based reset flow via Resend |
| 📜 **Legal Pages** | Privacy Policy, Terms of Service, Professional Ethics Notice |

---

## 🏗️ Tech Stack

### Backend
```
Express.js (ESM)  ·  Prisma ORM  ·  PostgreSQL
JWT Auth  ·  bcryptjs  ·  Helmet  ·  CORS  ·  Rate Limiting
Resend (email)  ·  Morgan (logging)
```

### Frontend
```
React 18  ·  Vite  ·  Tailwind CSS  ·  Framer Motion
Recharts  ·  Lucide Icons  ·  jsPDF  ·  date-fns  ·  Zustand
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+ (or Supabase connection)
- A [Resend](https://resend.com) API key (optional — password reset emails)

### 1. Clone & install

```bash
git clone https://github.com/yourorg/counselflow.git
cd counselflow

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure environment

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/counselflow"
JWT_SECRET="your-strong-jwt-secret-min-32-chars"
CLIENT_ORIGIN="http://localhost:5174"
RESEND_API_KEY="re_..."          # optional
PORT=4001
NODE_ENV=development
```

### 3. Set up the database

```bash
cd backend
npx prisma db push        # push schema to your database
npx prisma db seed        # seed with sample data (optional)
```

### 4. Run development servers

```bash
# Terminal 1 — backend (port 4001)
cd backend && npm run dev

# Terminal 2 — frontend (port 5174)
cd frontend && npm run dev
```

Open [http://localhost:5174](http://localhost:5174)

After seeding, log in with the credentials you defined in `backend/src/scripts/seed.js`. Change all passwords immediately after first login.

---

## 📁 Project Structure

```
counselflow/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   └── src/
│       ├── index.js             # Express app entry point (port 4001)
│       ├── middleware/
│       │   ├── auth.js          # JWT + role guards
│       │   ├── audit.js         # Write-operation audit capture
│       │   └── errorHandler.js  # Central error handler
│       ├── routes/
│       │   ├── auth.js          # Login, register, password reset
│       │   ├── clients.js       # Client intake CRUD
│       │   ├── attorneys.js     # Attorney profile CRUD
│       │   ├── cases.js         # Matter management
│       │   ├── invoices.js      # Billing + bulk-status
│       │   ├── analytics.js     # Chart data
│       │   ├── notifications.js # Notification feed
│       │   ├── stats.js         # Dashboard KPIs
│       │   └── admin.js         # User mgmt + audit log
│       └── lib/
│           ├── prisma.js        # Prisma client
│           └── email.js         # Resend email helper
│
└── frontend/
    └── src/
        ├── App.jsx              # Route definitions
        ├── theme.js             # Brand tokens (colors, fonts, copy)
        ├── components/
        │   └── layout/
        │       ├── Header.jsx
        │       ├── Footer.jsx
        │       └── NotificationBell.jsx
        ├── hooks/
        │   ├── useAuth.js
        │   └── useDarkMode.js
        ├── lib/
        │   ├── api.js           # Axios instance
        │   └── exportPDF.js     # Invoice PDF generator (hourly + fixed)
        └── pages/
            ├── Dashboard.jsx
            ├── Clients.jsx
            ├── Attorneys.jsx
            ├── Cases.jsx
            ├── Invoices.jsx     # + Bulk actions
            ├── Analytics.jsx
            ├── AdminUsers.jsx   # Admin only
            ├── AuditLog.jsx     # Admin only
            └── legal/
                ├── Privacy.jsx
                ├── Terms.jsx
                └── Ethics.jsx
```

---

## 🔐 Security

- JWT tokens validated on every protected request
- Role-based access control on all write endpoints (admin / attorney / paralegal scoped)
- Passwords hashed with bcrypt (cost factor 12)
- Helmet HTTP security headers
- Rate limiting: 100 req/15 min global, 20 req/15 min on auth routes
- CORS restricted to `CLIENT_ORIGIN` environment variable
- Audit middleware strips sensitive fields (passwords, case notes, documents) before logging
- Input validation with search query length caps

---

## 🗂️ Data Model

```
User ──► Attorney ──► Cases (lead attorney)
                  └──► Invoices
Client ──► Cases
       └──► Invoices

Case number format: CF-YYYY-NNNN (auto-generated on creation)
```

**Case statuses**: `open` · `active` · `pending` · `closed` · `on-hold`  
**Case priorities**: `low` · `medium` · `high` · `urgent`  
**Practice areas**: Litigation · Corporate · Family · Criminal · Real Estate · Immigration · Other  
**Invoice billing types**: Hourly · Flat-fee · Retainer · Contingency

---

## 🗺️ API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticate user |
| `POST` | `/api/auth/register` | Public | Create account |
| `GET` | `/api/clients` | Auth | List clients (paginated, searchable) |
| `POST` | `/api/clients` | Admin/Attorney/Paralegal | Create client |
| `GET` | `/api/cases` | Auth | List matters |
| `GET` | `/api/invoices` | Auth | List invoices |
| `PATCH` | `/api/invoices/bulk-status` | Admin/Paralegal | Bulk status update |
| `GET` | `/api/analytics` | Auth | Chart data |
| `GET` | `/api/notifications` | Auth | Notification feed |
| `GET` | `/api/admin/users` | Admin | List users |
| `PUT` | `/api/admin/users/:id/role` | Admin | Change user role |
| `GET` | `/api/admin/audit` | Admin | Paginated audit log |

---

## 🎨 Design System

CounselFlow uses a premium legal-industry aesthetic throughout:

- **Primary**: Deep Navy `#1B3A6B`
- **Accent**: Gold `#C9A84C`
- **Headings**: Playfair Display
- **Body**: Source Serif 4
- **Radius**: 8–12px (lg/xl) — more refined than the clinical rounded style
- **Motion**: Framer Motion with subtle spring transitions
- **Dark mode**: CSS custom properties (`var(--bg)`, `var(--surface)`, `var(--text)`, `var(--muted)`)

---

## 🤝 Sister Project

CounselFlow shares its architecture with [**ClinicFlow**](../ClinicFlow) — a clinic management system for healthcare providers. Both are built from the same codebase with a shared `theme.js` token system that drives all copy and brand differentiation.

---

## 📜 License

MIT © CounselFlow. Built with care for legal professionals.
