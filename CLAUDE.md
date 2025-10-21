# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React Router v7** application deployed to **Cloudflare Pages** with SSR enabled. It's a garden transformation business website built with TypeScript, featuring pixel-perfect components from Figma designs.

## Commands

### Development
```bash
npm run dev              # Start dev server at http://localhost:5173
npm run build            # Production build
npm run preview          # Preview production build locally
npm run typecheck        # Run TypeScript type checking (requires wrangler.toml)
```

### Deployment
```bash
npm run deploy           # Build and deploy to Cloudflare Pages
npx wrangler versions upload    # Deploy preview URL
npx wrangler versions deploy    # Promote version to production
```

## Architecture

### Tech Stack
- **Framework**: React Router v7 with SSR
- **Runtime**: Cloudflare Pages (via Wrangler)
- **Styling**: Tailwind CSS v4 + HeroUI (NextUI fork)
- **Type Safety**: TypeScript
- **Build Tool**: Vite

### Project Structure

```
app/
├── routes/           # File-based routing
│   ├── _index.tsx   # Homepage
│   └── _404.$.tsx   # Catch-all 404
├── components/       # React components
├── utils/            # Utility functions and configs
│   └── hero.ts      # HeroUI Tailwind plugin config
├── root.tsx          # Root layout with fonts and providers
├── app.css           # Tailwind config and custom theme
├── entry.client.tsx  # Client entry point
└── entry.server.tsx  # SSR entry point

public/
└── images/
    ├── banner/       # Hero section assets (6 files)
    └── about/        # About section assets (before/after images)
```

### Key Configurations

**Tailwind CSS v4**: Configured in `app/app.css` using new `@theme` directive
- Custom fonts: `font-geist`, `font-playfair`
- Custom primary color scale (green theme)
- Custom `container` utility: max-width 1280px with auto margins
- Custom variants: `dark:`, `child:`
- Integrates HeroUI components via plugin

**Vite Plugins**:
- `@tailwindcss/vite` - Tailwind CSS v4
- `vite-plugin-svgr` - Import SVGs as React components (use `.svg?react`)
- `tsconfigPaths` - Path alias support (`~` = `app/`)
- `cloudflareDevProxy` - Cloudflare runtime during dev
- `reactRouterDevTools` - React Router debugging

**React Router Config**: SSR enabled in `react-router.config.ts`

### Routing

File-based routing in `app/routes/`:
- `_index.tsx` → `/`
- `_404.$.tsx` → catch-all 404

Route modules export:
- `meta` - Page metadata (title, description)
- `loader` - Server data loading
- `action` - Form submissions
- `default` - Component

### Styling System

**Fonts**: Loaded via Google Fonts in `app/root.tsx`
- **Inter**: Default sans-serif
- **Geist**: Body text, buttons, badges (use `font-geist`)
- **Playfair Display**: Headings, numbers (use `font-playfair`)

**Color Palette**:
- Primary Green: `#39d174` (badges, CTA buttons)
- Dark Green: `#1f8044`, `#1c3125` (button hover, text)
- Dark Background: `#15171c` (overlays, badges)
- Light Text: `#edece4` (on dark backgrounds)

### Component Patterns

**Figma-to-Code Workflow**:
1. Components are pixel-perfect implementations from Figma designs
2. All images are exported from Figma and saved to `public/images/`
3. Use exact spacing, typography, and colors from design
4. Components include `data-name` attributes matching Figma layer names

### SSR Considerations

- Server renders HTML stream for SEO and performance
- Bot detection with `isbot` - waits for full render
- Components must be SSR-safe (no window/document in module scope)
- Use `useEffect` for client-only code

### State Management

- **valtio**: Proxy-based state (installed but not yet used)
- React hooks for local component state

### Utilities

- `app/utils/http.ts` - Likely HTTP client utilities (xior)
- `app/utils/animations.ts` - Animation utilities (framer-motion)
- `tailwind-merge` + `clsx` - Available for className management

## Figma Integration

When implementing new sections from Figma:
1. Use Figma MCP tools if available to get design context
2. Download all assets (images, icons) to `public/images/[section-name]/`
3. Create component in `app/components/Section[Name].tsx`
4. Match exact pixel values, fonts, and colors from design
5. Add to page in `app/routes/_index.tsx`
6. Update `app/components/README.md` with documentation

## Important Notes

- **Tailwind CSS v4** uses new syntax (`@theme`, `@utility`) - different from v3
- **HeroUI** is a NextUI fork - use for pre-built components
- **SVG imports**: Use `.svg?react` suffix to import as component
- **Path alias**: `~` resolves to `app/` directory
- **Deployment**: Requires Cloudflare account and wrangler auth
