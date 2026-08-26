# Commands: Diamond Union

## Setup

| Command | Status | Side Effects |
|---------|--------|--------------|
| `npm install` | Declared | Installs all dependencies |
| `npm install -g base44@latest` | Declared | Installs Base44 CLI globally |

## Development

| Command | Status | Side Effects |
|---------|--------|--------------|
| `base44 dev` | Declared | Starts Base44 backend + Vite frontend |
| `npm run dev` | Declared | Starts Vite dev server only (frontend) |

## Build & Preview

| Command | Status | Side Effects |
|---------|--------|--------------|
| `npm run build` | Declared | Builds to `dist/` |
| `npm run preview` | Declared | Previews production build locally |

## Quality

| Command | Status | Side Effects |
|---------|--------|--------------|
| `npm run lint` | Declared | ESLint check (quiet mode) |
| `npm run lint:fix` | Declared | ESLint auto-fix |
| `npm run typecheck` | Declared | TypeScript check via jsconfig |

## Base44 Platform

| Command | Status | Side Effects |
|---------|--------|--------------|
| `base44 dashboard open` | Declared | Opens Base44 dashboard in browser |
| `npx skills add base44/skills` | Declared | Installs Base44 agent skills |

## Notes

- **No tests configured** — no test script in `package.json`
- **No database migrations** — Base44 handles schema via entity JSONC files
- **No CI/CD pipeline** — no `.github/workflows` or similar found
- **No deployment scripts** — deployment managed via Base44 dashboard
