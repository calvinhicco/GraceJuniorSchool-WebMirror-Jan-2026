# Grace Junior School — Web Mirror

Read-only web mirror for **Grace Junior School** (My Students Track desktop app).

## Deployment Status
- Last updated: September 12, 2025, featuring real-time data synchronization and comprehensive staff log management.
- Git repository connected to Vercel - ready for deployment!

## Features

- **Dashboard Overview**: Real-time statistics and data visualization
- **Student Management**: View student records and information
- **Staff Log Sheet**: Daily attendance tracking with role-based grouping
- **Expenses Tracking**: Financial records and expense management
- **Extra Billing**: Additional billing and payment tracking
- **Outstanding Records**: Overdue payments and follow-ups

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Firebase Firestore (`my-students-track-staff-online`)
- **Deployment**: Vercel
- **Real-time**: Firestore `onSnapshot` subscriptions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project ([my-students-track-staff-online](https://console.firebase.google.com/project/my-students-track-staff-online))
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd web-mirror-with-staff-log
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` (copy from `.env.example`):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-students-track-staff-online.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-students-track-staff-online
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-students-track-staff-online.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

Deploy on Vercel from this repo: [GraceJuniorSchool-WebMirror-Jan-2026](https://github.com/calvinhicco/GraceJuniorSchool-WebMirror-Jan-2026).

### Environment Variables (Vercel)

Set all `NEXT_PUBLIC_FIREBASE_*` values from `.env.example` for project **my-students-track-staff-online**.

Do **not** use Madam Boss Firebase (`my-students-mirror`) on this project — you will see the wrong school's data.

Redeploy after saving env vars. The site footer must show `Firestore: my-students-track-staff-online`.

### Wrong school data?

| Repo | Firebase project | School |
|------|------------------|--------|
| [GraceJuniorSchool-WebMirror-Jan-2026](https://github.com/calvinhicco/GraceJuniorSchool-WebMirror-Jan-2026) | `my-students-track-staff-online` | Grace Junior School |
| [Madam-Boss-Kids-Corner-MTS-Web-Mirror](https://github.com/calvinhicco/Madam-Boss-Kids-Corner-MTS-Web-Mirror) | `my-students-mirror` | Madam Boss Kids Corner |

### Firestore security rules

Allow browser **read** on sync collections (see `firestore.rules.example`).

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── staff/             # Staff log pages
│   ├── students/          # Student management
│   ├── expenses/          # Expense tracking
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── Nav.tsx           # Navigation component
├── lib/                  # Utilities and configurations
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
```

## Contributing

This is a read-only mirror application. All data modifications should be done through the main desktop application.

## License

Private - Grace Junior School
