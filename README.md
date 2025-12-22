# UNOPS Starter

A minimal, cloneable Next.js starter repository for UN/UNOPS projects. Pre-configured with a UN-ready theme, a global layout shell, and a registry-ready component system.

**Not a product, not a framework** — just a clean base to build upon.

> Starter repo: `create-unops-starter`

---

## What’s Inside

- **Next.js (App Router)** + **TypeScript**
- **UN/UNOPS-ready theme** (CSS variables + Tailwind tokens)
- **Global layout shell** (Header, Container, Footer)
- **Clean architecture** under `/src` with organized folders
- **shadcn CLI compatible** (install components from registry)
- **Vercel-ready** (serverless-friendly, no special config)

---

## Quick Start

### Prerequisites

- Node.js **20+**
- npm (or your preferred package manager)

### Setup

```bash
# Clone this repo or use it as a template
npx create-unops-starter@latest my-project
cd my-project

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` to see your app.

---

## Scripts

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

---

## Theme & Customization

### CSS Variables

The UN/UNOPS theme is built on CSS variables defined in `src/styles/globals.css`.

Current palette:
- **Primary:** UN Blue (`#1E5BA8`)
- **Secondary:** Lighter blue
- **Accent:** Warm orange
- **Neutrals:** Clean grays for text and backgrounds
- **Dark mode:** Full support via the `.dark` class

### Customizing Colors

Edit `src/styles/globals.css`:

```css
:root {
  /* Values use HSL triplets (for hsl(var(--token))) */
  --primary: 213 94% 45%;
  --accent: 30 100% 50%;
  /* ... other tokens */
}
```

### Typography

Global typography rules are in `src/styles/globals.css`. Includes:
- System font stack (`system-ui`, `-apple-system`, `sans-serif`)
- Heading and body text styles
- Code styling

---

## Project Structure

```txt
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with Header, Footer
│   ├── page.tsx            # Homepage
├── components/
│   ├── layout/             # Layout components
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   └── container.tsx
│   └── ui/                 # UI primitives (from registry)
├── config/
│   └── site.ts             # Site metadata and config
├── lib/
│   └── utils.ts            # Utility functions (cn() helper)
├── styles/
│   └── globals.css         # Global styles and theme variables
└── types/
    └── index.ts            # Shared TypeScript types
```

---

## Adding Components from Registry

### Step 1: Initialize shadcn (first time only)

```bash
npx shadcn@latest init
```

(The tool will ask a few questions; defaults are fine for this project.)

### Step 2: Browse Components

Explore components and blocks on: `registry-unops.vercel.app`

### Step 3: Install a Component

```bash
npx shadcn@latest add <registry-item-url>
```

**Example:**

```bash
npx shadcn@latest add 'https://registry-unops.vercel.app/r/button.json?token=...'
```

Installed components land in `src/components/ui/` and automatically respect your UN/UNOPS theme.

### Updating a Registry Component (recommended workflow)

Re-running `shadcn add` can overwrite files. If you plan to customize a component, prefer:
- **Wrapping** the component (keep the base component intact), or
- Copy it into `src/components/custom/` and import from there.

---

## Environment Variables

Copy `.env.example` to `.env.local` and add your secrets:

```bash
cp .env.example .env.local
```

**Never commit** `.env.local`.

Suggested convention:

| Variable | Required | Purpose |
|---------|----------|---------|
| `NEXT_PUBLIC_*` | Sometimes | Client-safe config (ex: public endpoints) |
| `*SECRET*` / `*_TOKEN` | Yes (if used) | Server-only secrets |

---

## Deployment

### Vercel (Recommended)

- Push your repo to GitHub
- Import it into Vercel
- Deploy (no special config needed)

### Other Platforms

- **Docker:** add a `Dockerfile` if needed
- **Node.js server:** works on any Node.js 20+ environment

---

## Development Guidelines

- Use TypeScript (strict mode recommended)
- Keep components small and focused
- Use `src/lib/utils.ts` for the `cn()` helper
- Avoid unnecessary dependencies

### File Naming

- Components: PascalCase (`Button.tsx`, `SiteHeader.tsx`)
- Utilities: camelCase (`utils.ts`)
- Types: `.ts` or `.tsx` in `src/types/`

---

## Troubleshooting

### Dark mode isn’t working
- Ensure `.dark` is applied on the root element (commonly `html` or `body`)
- Verify your CSS variables include both light and dark scopes

### Tailwind tokens don’t apply
- Confirm your Tailwind content paths include `./src/**/*`
- Restart the dev server after config changes

### shadcn install overwrote my edits
- Prefer wrapping components or duplicating into `src/components/custom/`

---

## Roadmap (Optional)

- Add CI (lint + build) via GitHub Actions
- Add an example “page template” using registry blocks
- Add optional i18n starter structure

---

## License

MIT © 2026 PascheK7. See `LICENSE` for details.

---

## Support & Community

- **Registry:** `registry-unops.vercel.app`
- **GitHub Issues:** bug reports / feature requests
- **Discussions:** questions & usage
