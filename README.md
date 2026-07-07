# Grace Junior School — Web Portals

Dual web portals for **Grace Junior School**, synced from the My Students Track desktop app.

- **Parent Portal** — view and download academic report cards (login with child name + student ID)
- **School Mirror** — staff read-only view of students, fees, expenses, and outstanding balances

Firebase project: **`jan-2026-webmirror-a1`** (must match the desktop app service account).

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

GitHub: [calvinhicco/GraceJuniorSchool-WebMirror-Jan-2026](https://github.com/calvinhicco/GraceJuniorSchool-WebMirror-Jan-2026)

Deploy on Vercel. Set all `NEXT_PUBLIC_FIREBASE_*` values from `.env.example` for project **jan-2026-webmirror-a1**.

Or run `scripts/setup-vercel-env.ps1` after `vercel link`.

The school mirror footer must show: `Firestore: jan-2026-webmirror-a1`.

## Firestore security rules

Allow browser **read** on sync collections (see `firestore.rules.example`), including academic report collections for the parent portal.

## Routes

| URL | Purpose |
|-----|---------|
| `/` | Portal chooser |
| `/parent` | Parent login |
| `/parent/report` | Academic report viewer + PDF |
| `/school/login` | School mirror staff login |
| `/school` | Financial dashboard |
| `/school/students` | Student list |
| `/school/expenses` | Expenses |
| `/school/extrabilling` | Extra billing |
| `/school/outstanding` | Outstanding balances |

## License

Private — Grace Junior School
