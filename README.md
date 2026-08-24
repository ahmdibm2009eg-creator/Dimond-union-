# Diamond Union — Corporate Website

Bilingual (Arabic/English) progressive web app for Diamond Union Contracting Co.

## Tech Stack

- React 18 + Vite 6
- Tailwind CSS 3 + shadcn/ui (Radix UI)
- React Router 6 + React Query 5
- localStorage data layer (no backend required)

## Quick Start

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |

## Admin Mode

Tap the invisible eye icon 5 times within 3 seconds to trigger the password prompt. Enter the password (default: `1516`, configurable via `VITE_ADMIN_PASSWORD` in `.env.local`).

Admin mode enables: project CRUD, text editing, theme customization, and data export/import.

## Data Persistence

All data is stored in the browser's localStorage. Use the Export/Import buttons in admin mode to back up and restore data.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | `1516` | Admin panel password |

Create a `.env.local` file for local overrides (never commit this file).

## License

MIT
