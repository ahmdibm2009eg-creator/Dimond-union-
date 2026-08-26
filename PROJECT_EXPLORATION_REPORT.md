# Project Exploration Report: Diamond Union

## Executive Summary

**Diamond Union** is a bilingual (Arabic/English) corporate website for "Diamond Union Contracting Co." — a Saudi Arabian contracting company specializing in exhibition booths, interior design, signage, and general contracting. Built with React + Vite on the Base44 platform (a low-code app builder with backend-as-a-service), it's a single-page application with admin features for managing portfolio projects and site content.

**Confidence: High (85/100)** — direct code evidence supports all major conclusions.

---

## Project Identity and Purpose

| Field | Value |
|-------|-------|
| **Type** | Corporate marketing website with admin CMS |
| **Company** | Diamond Union Contracting Co. (شركة اتحاد الألماس للمقاولات) |
| **Region** | Saudi Arabia (Riyadh / Dammam) |
| **Language** | Bilingual Arabic (default) / English |
| **Platform** | Base44 (BaaS) + React frontend |
| **Route** | Single-page app (`/` only) |

---

## Verified Technology Stack

| Layer | Technology | Evidence |
|-------|-----------|----------|
| **Framework** | React 18 | `package.json:63` |
| **Build** | Vite 6 | `package.json:98`, `vite.config.js` |
| **Styling** | Tailwind CSS 3 + Radix UI | `tailwind.config.js`, 50+ UI components in `src/components/ui/` |
| **Routing** | React Router DOM 6 | `src/App.jsx:4` |
| **State** | React Context (Auth, Language, Theme) | `src/lib/AuthContext.jsx`, `LanguageContext.jsx`, `ThemeContext.jsx` |
| **Data Fetching** | TanStack React Query 5 | `package.json:48` |
| **Backend** | Base44 SDK (`@base44/sdk`) | `src/api/base44Client.js` |
| **3D** | Three.js | `src/components/Diamond3D.jsx` |
| **Animation** | Framer Motion | `package.json:55` |
| **Forms** | React Hook Form + Zod | `package.json:66`, `package.json:79` |
| **PDF** | jsPDF | `package.json:58` |
| **Maps** | React Leaflet | `package.json:68` |
| **Charts** | Recharts | `package.json:73` |
| **Payments** | Stripe (`@stripe/react-stripe-js`) | `package.json:46-47` |
| **Language** | IBM Plex Sans Arabic + IBM Plex Sans | `src/index.css:1` |

---

## Architecture and Runtime Flows

### Entry Point Chain

```
index.html → src/main.jsx → src/App.jsx → AuthenticatedApp → Routes
```

### Primary Runtime Flow: Page Load

1. **`index.html`** loads, Vite serves the SPA
2. **`src/main.jsx:6-8`** mounts `<App />` into `#root`
3. **`src/App.jsx:47-64`** wraps everything in:
   - `AuthProvider` → checks Base44 public settings + user auth
   - `QueryClientProvider` → TanStack Query client
   - `BrowserRouter` → routing
   - `LanguageProvider` → loads SiteContent overrides from Base44, defaults to Arabic
   - `ThemeProvider` → loads theme settings from Base44, applies CSS variables
4. **`src/App.jsx:14-44`** `AuthenticatedApp` handles auth state:
   - Loading spinner while checking auth
   - `user_not_registered` → shows error
   - `auth_required` → redirects to login
   - Otherwise → renders `<Home />`
5. **`src/pages/Home.jsx:11-26`** renders single-page sections:
   - Navbar → Hero (3D diamond) → About → Services → Portfolio → Contact → Footer

### Portfolio Admin Flow

1. User clicks pencil icon in Portfolio section (`src/components/sections/Portfolio.jsx:119-125`)
2. Password prompt appears (hardcoded: `1516`) — `Portfolio.jsx:62-72`
3. Admin mode enables: create projects, edit images, edit text content, edit design/theme
4. Projects stored in Base44 `Project` entity, fetched via `base44.entities.Project.list('order')`
5. Fallback to seed data in `src/lib/translations.js:192-377` when no entities exist

### Contact Flow

1. User fills form (name, phone, message) — `src/components/sections/Contact.jsx:14`
2. On submit, opens WhatsApp with pre-filled message — `Contact.jsx:20-30`
3. No backend submission — pure client-side WhatsApp redirect

---

## Domain Model and Glossary

| Term | Meaning |
|------|---------|
| **Project** | A portfolio item with bilingual names, category, and image array |
| **SiteContent** | CMS entity for overriding any translation string or storing theme |
| **Category** | One of: `stands`, `exhibition`, `interior`, `signage` |
| **Admin Mode** | Password-gated mode enabling CMS editing (password: `1516`) |
| **Theme Settings** | JSON stored in SiteContent with CSS variable overrides |
| **Overrides** | SiteContent entries that patch the base translations at runtime |

### Entities (Base44 Backend)

- **`Project`** (`base44/entities/Project.jsonc`): `name_ar`, `name_en`, `category` (enum), `images` (string[]), `order` (number)
- **`User`** (`base44/entities/User.jsonc`): `role` (admin|user)
- **`SiteContent`** (`base44/entities/SiteContent.jsonc`): `content_key`, `value_ar`, `value_en`

---

## Data Stores and Interfaces

| Store | Purpose | Access |
|-------|---------|--------|
| **Base44 Backend** | All persistent data (Projects, Users, SiteContent) | `base44.entities.*` SDK |
| **localStorage** | Auth tokens, app params | `src/lib/app-params.js:3-4` |
| **CSS Variables** | Runtime theme | `src/lib/ThemeContext.jsx:17-41` |
| **Translations** | Static bilingual content | `src/lib/translations.js` |
| **WhatsApp API** | Contact form submission | `https://wa.me/` redirect |
| **External Images** | Project photos (Unsplash URLs) | `src/lib/translations.js:198-376` |
| **Base44 Media** | Logo images | `Navbar.jsx:6`, `Footer.jsx:5` |

### External Integrations

- **Base44 Auth**: Email/password, Google OAuth, token-based
- **Stripe**: Package included but not observed in active use
- **Leaflet**: Package included but not observed in active use
- **Three.js**: 3D diamond in Hero section

---

## Development and Operations Workflow

### Commands

| Command | Status | Side Effects |
|---------|--------|--------------|
| `npm install` | Declared | Installs deps |
| `npm run dev` | Declared | Starts Vite dev server (frontend only) |
| `base44 dev` | Declared | Starts Base44 backend + frontend |
| `npm run build` | Declared | Builds to `dist/` |
| `npm run lint` | Declared | ESLint check |
| `npm run lint:fix` | Declared | ESLint auto-fix |
| `npm run typecheck` | Declared | TypeScript check via jsconfig |
| `npm run preview` | Declared | Preview production build |

### Setup

1. Clone repo
2. `npm install`
3. Install Base44 CLI: `npm install -g base44@latest`
4. `base44 dev` for full stack, or `npm run dev` for frontend-only

### Environment Variables

- `VITE_BASE44_APP_ID` — Base44 app identifier
- `VITE_BASE44_APP_BASE_URL` — Base44 backend URL
- `VITE_BASE44_FUNCTIONS_VERSION` — Functions version
- `BASE44_LEGACY_SDK_IMPORTS` — Legacy SDK import support

---

## Quality and Risk Findings

### High Risk

1. **Hardcoded Admin Password** — `src/components/sections/Portfolio.jsx:64`: Password `1516` is hardcoded in client-side JavaScript. Anyone can view source to discover it. **Severity: High** (client-side only admin gate).

2. **No Input Sanitization on Contact Form** — Contact form passes user input directly to WhatsApp URL without sanitization. **Severity: Low** (WhatsApp handles encoding).

### Medium Risk

3. **Seed Data Fallback** — `Portfolio.jsx:50`: When Base44 entities fail to load, seed data with Unsplash URLs is shown. If Base44 is down, the site shows placeholder images, not real portfolio.

4. **No Error Boundaries** — No React error boundaries observed. A crash in any section takes down the whole app.

5. **Unused Dependencies** — Stripe, Leaflet, Recharts, jsPDF, react-quill, html2canvas are in `package.json` but not observed in use. Adds bundle bloat.

### Low Risk

6. **RTL/LTR Toggle** — Language toggle sets `document.documentElement.dir` but some components have hardcoded `dir="rtl"` (e.g., `Hero.jsx:79`).

7. **No Tests** — No test files or test configuration found.

8. **No TypeScript** — JSX files with jsconfig for type hints only.

---

## Contradictions and Unknowns

| Item | Status | Notes |
|------|--------|-------|
| Stripe integration | Unknown | Package installed, no usage found in components |
| Leaflet maps | Unknown | Package installed, no usage found |
| `dist/` committed | Contradiction | `.gitignore` excludes `dist/` but it exists in repo |
| Login/Register pages | Unused | Pages exist but aren't routed in `App.jsx` |
| OAuthConsent page | Unused | Page exists but isn't routed |
| ForgotPassword/ResetPassword | Unused | Pages exist but aren't routed |

---

## Confidence Table

| Conclusion | Score | Reason |
|-----------|-------|--------|
| Single-page corporate website | 95 | Direct code evidence |
| Base44 BaaS backend | 90 | SDK usage, entity definitions |
| Bilingual AR/EN | 95 | Translations file, LanguageContext |
| Admin CMS via password gate | 95 | Portfolio.jsx code |
| WhatsApp contact form | 95 | Contact.jsx code |
| No active auth flow | 85 | Auth pages exist but not routed |
| Unused dependencies | 70 | Packages in manifest, no imports found |
| No tests | 90 | No test files found |

---

## Recommended Next Actions

1. **Remove unused dependencies** (Stripe, Leaflet, Recharts, jsPDF, react-quill, html2canvas) to reduce bundle size
2. **Route auth pages** if login/register functionality is needed
3. **Move admin password** to Base44 backend or environment variable
4. **Add error boundaries** for resilient rendering
5. **Add tests** for critical flows (auth, portfolio CRUD, theme persistence)

---

## Evidence Index

| File | Lines | Evidence |
|------|-------|----------|
| `package.json` | 1-100 | Dependencies, scripts |
| `vite.config.js` | 1-19 | Build config, Base44 plugin |
| `src/App.jsx` | 1-66 | App structure, routing |
| `src/main.jsx` | 1-8 | Entry point |
| `src/api/base44Client.js` | 1-14 | SDK client setup |
| `src/lib/AuthContext.jsx` | 1-160 | Auth flow |
| `src/lib/LanguageContext.jsx` | 1-52 | Language/i18n |
| `src/lib/ThemeContext.jsx` | 1-100 | Theme management |
| `src/lib/translations.js` | 1-377 | All translations + seed data |
| `src/lib/contentUtils.js` | 1-78 | Translation override system |
| `src/pages/Home.jsx` | 1-26 | Page composition |
| `src/components/sections/Portfolio.jsx` | 1-271 | Portfolio + admin CMS |
| `src/components/sections/Contact.jsx` | 1-125 | WhatsApp contact form |
| `src/components/Diamond3D.jsx` | 1-129 | Three.js 3D diamond |
| `base44/entities/Project.jsonc` | 1-36 | Project entity schema |
| `base44/entities/SiteContent.jsonc` | 1-18 | CMS entity schema |
| `base44/config.jsonc` | 1-9 | Base44 project config |
