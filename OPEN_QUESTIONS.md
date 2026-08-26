# Open Questions: Diamond Union

## High Priority

### 1. Are auth pages meant to be active?
**Question**: Login, Register, ForgotPassword, ResetPassword, and OAuthConsent pages exist in `src/pages/` but aren't routed in `App.jsx`. Are these intended for future use or dead code?

**Evidence checked**: `src/App.jsx:39-43` only routes `/` and `*`. No other routes reference these pages.

**Impact**: If auth is needed, routes must be added and auth flow connected.

### 2. What happened to the original Base44 app?
**Question**: The repo was force-pushed (`git reset --hard origin/main` was required). The remote has commits in Arabic suggesting iterative development. Is the current state the intended production state?

**Evidence checked**: `git log origin/main` shows Arabic commit messages and feature additions that may have been overwritten.

**Impact**: May need to recover features from prior commits.

### 3. Is the admin password meant to be client-side?
**Question**: The admin CMS password (`1516`) is hardcoded in `Portfolio.jsx:64`. Should this be moved to Base44 backend or environment variable?

**Evidence checked**: `src/components/sections/Portfolio.jsx:62-72` — password check is purely client-side.

**Impact**: Security risk if admin features should be protected.

## Medium Priority

### 4. Why are Stripe, Leaflet, Recharts, jsPDF installed but unused?
**Question**: These packages are in `package.json` but no imports found in any component. Were they planned features or accidentally included?

**Evidence checked**: Searched for imports of `@stripe`, `leaflet`, `recharts`, `jspdf` — none found in `src/`.

**Impact**: Bundle bloat. Can be safely removed if confirmed unused.

### 5. Is the `dist/` directory supposed to be committed?
**Question**: `.gitignore` excludes `dist/` but it exists in the repo. Was this committed before the gitignore was added?

**Evidence checked**: `.gitignore:16` excludes `dist`, but directory exists.

**Impact**: Should be removed from tracking with `git rm -r --cached dist/`.

### 6. What is the WhatsApp button component?
**Question**: `WhatsAppButton.jsx` is imported in Home.jsx but its implementation wasn't inspected. Is it a floating button or inline element?

**Evidence checked**: `src/pages/Home.jsx:9` imports it, `src/components/WhatsAppButton.jsx` exists but wasn't read.

**Impact**: Minor — likely a floating CTA button.

## Low Priority

### 7. Are there any environment-specific behaviors?
**Question**: Does the app behave differently based on `VITE_BASE44_APP_ID` or other env vars? Are there feature flags?

**Evidence checked**: `src/lib/app-params.js` reads env vars but no feature flags observed.

**Impact**: Low — single deployment target apparent.

### 8. Is the dark mode fully implemented?
**Question**: `index.css:49` defines `.dark` variables but no dark mode toggle or detection was observed in components.

**Evidence checked**: `tailwind.config.js:3` enables `darkMode: ["class"]`, CSS has `.dark` block, but no UI toggle.

**Impact**: Dark mode CSS exists but isn't accessible to users.
