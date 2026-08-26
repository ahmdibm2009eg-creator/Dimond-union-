# Project Map: Diamond Union

## Directory Structure

```
Dimond-union-/
├── base44/                    # Base44 platform config
│   ├── config.jsonc           # Project config (install, build, serve commands)
│   └── entities/              # Backend entity schemas
│       ├── Project.jsonc      # Portfolio project entity
│       ├── SiteContent.jsonc  # CMS content entity
│       └── User.jsonc         # User entity with roles
├── src/
│   ├── api/
│   │   └── base44Client.js    # Base44 SDK client initialization
│   ├── components/
│   │   ├── sections/          # Page sections (compose Home page)
│   │   │   ├── Hero.jsx       # Hero with 3D diamond
│   │   │   ├── About.jsx      # Company info, vision, mission, values
│   │   │   ├── Services.jsx   # Service offerings grid
│   │   │   ├── Portfolio.jsx  # Project gallery + admin CMS
│   │   │   ├── Contact.jsx    # WhatsApp contact form
│   │   │   └── Footer.jsx     # Site footer
│   │   ├── ui/                # 50 Radix UI components (shadcn/ui)
│   │   ├── Diamond3D.jsx      # Three.js 3D diamond rendering
│   │   ├── Navbar.jsx         # Fixed navigation with language toggle
│   │   ├── ProjectLightbox.jsx    # Image viewer with zoom/pan/swipe
│   │   ├── ProjectImageEditor.jsx # Admin: edit project images
│   │   ├── ProjectCreateModal.jsx # Admin: create new project
│   │   ├── ContentEditorModal.jsx # Admin: edit site text content
│   │   ├── StyleEditorModal.jsx   # Admin: edit theme/colors
│   │   ├── ScrollReveal.jsx       # Scroll animation wrapper
│   │   ├── ScrollToTop.jsx        # Scroll restoration
│   │   ├── AuthLayout.jsx         # Auth page layout
│   │   ├── GoogleIcon.jsx         # Google OAuth icon
│   │   ├── ProtectedRoute.jsx     # Auth route guard
│   │   ├── UserNotRegisteredError.jsx
│   │   └── WhatsAppButton.jsx     # Floating WhatsApp CTA
│   ├── hooks/                 # Custom React hooks (empty)
│   ├── lib/
│   │   ├── app-params.js      # Base44 app parameter resolution
│   │   ├── AuthContext.jsx     # Authentication state management
│   │   ├── authReturnTo.js    # Safe redirect URL handling
│   │   ├── contentUtils.js    # Translation flattening/override utilities
│   │   ├── LanguageContext.jsx # Bilingual language state
│   │   ├── PageNotFound.jsx   # 404 page
│   │   ├── query-client.js    # TanStack Query client instance
│   │   ├── ThemeContext.jsx    # Theme state + CSS variable application
│   │   ├── translations.js    # All bilingual content + seed project data
│   │   └── utils.js           # General utilities
│   ├── pages/
│   │   ├── Home.jsx           # Main landing page (composed of sections)
│   │   ├── Login.jsx          # Email/password + Google login (unused)
│   │   ├── Register.jsx       # Registration page (unused)
│   │   ├── ForgotPassword.jsx # Password reset request (unused)
│   │   ├── ResetPassword.jsx  # Password reset form (unused)
│   │   └── OAuthConsent.jsx   # OAuth consent page (unused)
│   ├── App.jsx                # Root component with providers + routing
│   ├── main.jsx               # React DOM entry point
│   └── index.css              # Global styles + CSS variables + dark mode
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite + Base44 plugin config
├── tailwind.config.js         # Tailwind CSS config
├── postcss.config.js          # PostCSS config
├── eslint.config.js           # ESLint config
├── jsconfig.json              # JS/TS path aliases
├── components.json            # shadcn/ui component config
├── AGENTS.md                  # AI agent instructions
├── CLAUDE.md                  # Claude agent instructions
└── README.md                  # Project documentation
```

## Entry Points

| Entry | File | Purpose |
|-------|------|---------|
| **HTML** | `index.html` | Vite SPA entry |
| **JS** | `src/main.jsx` | React mount point |
| **App** | `src/App.jsx` | Component tree + providers |
| **Page** | `src/pages/Home.jsx` | Only rendered page |

## Component Relationships

```
App.jsx
├── AuthProvider (AuthContext.jsx)
│   └── QueryClientProvider
│       └── BrowserRouter
│           └── LanguageProvider (LanguageContext.jsx)
│               └── ThemeProvider (ThemeContext.jsx)
│                   └── AuthenticatedApp
│                       ├── Loading spinner
│                       ├── Auth error handling
│                       └── Routes
│                           ├── "/" → Home.jsx
│                           └── "*" → PageNotFound
└── Toaster

Home.jsx
├── Navbar (fixed, language toggle)
├── Hero (3D Diamond, scroll animations)
├── About (vision, mission, values)
├── Services (6-item grid)
├── Portfolio (project gallery + admin CMS)
│   ├── ProjectLightbox (image viewer)
│   ├── ProjectImageEditor (admin)
│   ├── ProjectCreateModal (admin)
│   ├── ContentEditorModal (admin)
│   └── StyleEditorModal (admin)
├── Contact (WhatsApp form)
├── Footer
└── WhatsAppButton (floating)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                    BASE44 BACKEND                    │
│  ┌──────────┐  ┌────────────┐  ┌─────────────────┐  │
│  │ Project  │  │ SiteContent│  │ User (auth)     │  │
│  │ entity   │  │ entity     │  │ entity          │  │
│  └────┬─────┘  └─────┬──────┘  └────────┬────────┘  │
└───────┼──────────────┼──────────────────┼────────────┘
        │              │                  │
        ▼              ▼                  ▼
┌─────────────────────────────────────────────────────┐
│                  BASE44 SDK CLIENT                   │
│            src/api/base44Client.js                   │
└─────────────────────────────────────────────────────┘
        │              │                  │
        ▼              ▼                  ▼
┌─────────────────────────────────────────────────────┐
│                  REACT CONTEXTS                      │
│  ┌────────────┐ ┌──────────────┐ ┌───────────────┐  │
│  │ AuthContext│ │LanguageCtx   │ │ ThemeContext   │  │
│  │ (user,auth)│ │(lang,overrides│ │(theme,save)  │  │
│  └─────┬──────┘ └──────┬───────┘ └───────┬───────┘  │
└────────┼───────────────┼─────────────────┼───────────┘
         │               │                 │
         ▼               ▼                 ▼
┌─────────────────────────────────────────────────────┐
│                  UI COMPONENTS                       │
│  Portfolio ←── projects (from entity or seed)       │
│  Navbar ←── t (translations)                        │
│  Hero ←── t, Diamond3D                              │
│  StyleEditor ←── theme, saveTheme                   │
│  ContentEditor ←── overrides, reloadContent         │
└─────────────────────────────────────────────────────┘
```

## Critical Files

| File | Importance | Reason |
|------|-----------|--------|
| `src/App.jsx` | **Critical** | Root component, provider tree, routing |
| `src/lib/AuthContext.jsx` | **Critical** | Authentication state, Base44 integration |
| `src/lib/LanguageContext.jsx` | **High** | Language state, content override loading |
| `src/lib/ThemeContext.jsx` | **High** | Theme persistence, CSS variable application |
| `src/lib/translations.js` | **High** | All UI text + seed project data |
| `src/components/sections/Portfolio.jsx` | **High** | Main feature: project gallery + admin CMS |
| `src/api/base44Client.js` | **High** | Backend SDK initialization |
| `src/lib/app-params.js` | **Medium** | Environment/config resolution |
| `src/lib/contentUtils.js` | **Medium** | Translation override engine |

## Change-Sensitive Zones

| Zone | Risk | Files |
|------|------|-------|
| **Auth flow** | High | `AuthContext.jsx`, `Login.jsx`, `app-params.js` |
| **Theme system** | Medium | `ThemeContext.jsx`, `StyleEditorModal.jsx`, `index.css` |
| **Content overrides** | Medium | `LanguageContext.jsx`, `contentUtils.js`, `ContentEditorModal.jsx` |
| **Portfolio CRUD** | Medium | `Portfolio.jsx`, `ProjectCreateModal.jsx`, `ProjectImageEditor.jsx` |
| **Admin password** | High | `Portfolio.jsx:64` (hardcoded) |
| **3D rendering** | Low | `Diamond3D.jsx` (Three.js, self-contained) |

## Generated or Protected Areas

| Area | Status | Notes |
|------|--------|-------|
| `src/components/ui/` | **Generated** | shadcn/ui components, don't hand-edit |
| `node_modules/` | **Protected** | Never commit |
| `dist/` | **Generated** | Build output, gitignored |
| `base44/entities/` | **Protected** | Backend schema definitions |
