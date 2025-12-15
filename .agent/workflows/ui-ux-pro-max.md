---
description: Plan and implement UI with searchable design intelligence database
auto_execution_mode: 3
---

# UI/UX Pro Max - Design Intelligence

<!-- ═══════════════════════════════════════════════════════════════════════════
     CRITICAL: This workflow uses BM25 search engine with AUTO-DOMAIN DETECTION
     You can omit --domain flag and let the script detect the best domain.
     ═══════════════════════════════════════════════════════════════════════════ -->

## Quick Start

```bash
# Auto-detect domain from query (RECOMMENDED)
python3 .shared/ui-ux-pro-max/scripts/search.py "<query>"

# Or specify domain explicitly
python3 .shared/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>

# Stack-specific guidelines
python3 .shared/ui-ux-pro-max/scripts/search.py "<query>" --stack <stack>
```

---

## Workflow Steps

### Step 1: Extract Requirements

From user request, identify:
- **Product**: SaaS, e-commerce, portfolio, dashboard, landing, etc.
- **Style**: minimal, elegant, playful, dark mode, glassmorphism, etc.
- **Industry**: healthcare, fintech, gaming, education, beauty, etc.
- **Stack**: React, Vue, Next.js, or default `html-tailwind`

### Step 2: Search Knowledge Base

Search multiple domains to gather comprehensive design context. **Search until you have enough information.**

**Recommended search order:**

| Priority | Domain | Purpose | Example Query |
|----------|--------|---------|---------------|
| 1 | `product` | Style recommendations for product type | "SaaS dashboard" |
| 2 | `style` | Visual theme details (colors, effects) | "glassmorphism dark" |
| 3 | `layouts` | Page structure patterns | "dashboard sidebar" |
| 4 | `components` | Code structure for UI parts | "navbar hero card" |
| 5 | `effects` | CSS visual effects | "gradient glass glow" |
| 6 | `motion` | Motion.dev animations (React) | "useAnimate whileHover" |
| 7 | `animations` | CSS keyframe animations | "fade slide bounce" |
| 8 | `typography` | Font pairings | "elegant modern mono" |
| 9 | `color` | Color palettes | "fintech dark mode" |
| 10 | `examples` | Real-world references | "stripe linear apple" |
| 11 | `ux` | Best practices & pitfalls | "accessibility forms" |

### Step 3: Synthesize & Build

Combine search results into cohesive design, then implement code.

---

## Domain Reference

| Domain | Description | Keywords |
|--------|-------------|----------|
| `style` | UI visual themes | minimalism, glassmorphism, brutalism, aurora, dark mode |
| `prompt` | AI prompt templates & CSS keywords | prompt, implementation, variables |
| `color` | Color palettes by product type | hex, palette, primary, accent |
| `chart` | Data visualization guidance | bar, pie, trend, heatmap, funnel |
| `landing` | Landing page patterns | hero, CTA, testimonial, pricing |
| `product` | Product-specific recommendations | SaaS, fintech, healthcare, gaming |
| `ux` | UX guidelines & pitfalls | accessibility, touch, keyboard, scroll |
| `typography` | Font pairings with imports | serif, sans, display, mono |
| `components` | HTML/Tailwind component structures | navbar, card, hero, footer, modal |
| `effects` | CSS visual effects | shadow, glow, glass, blur, gradient |
| `animations` | CSS keyframe animations | fade, slide, bounce, entrance |
| `layouts` | Page layout patterns | grid, sidebar, dashboard, split |
| `examples` | Real website references | stripe, linear, apple, vercel |
| `motion` | Motion.dev React animations | useAnimate, useScroll, variants |

## Stack Reference

| Stack | Use For |
|-------|---------|
| `html-tailwind` | Static HTML with Tailwind CSS (default) |
| `react` | React components with hooks |
| `nextjs` | Next.js App Router |
| `vue` | Vue 3 Composition API |
| `svelte` | Svelte components |
| `swiftui` | iOS/macOS native |
| `react-native` | React Native mobile |
| `flutter` | Flutter/Dart mobile |

---

## Professional UI Checklist

Before delivering any UI code, verify these items:

### Icons & Visual Elements
| ✅ Do | ❌ Don't |
|-------|---------|
| Use SVG icons (Heroicons, Lucide, Simple Icons) | Use emojis like 🎨 🚀 as UI icons |
| Use color/opacity transitions on hover | Use scale transforms that shift layout |
| Research official logos from Simple Icons | Guess or use incorrect logo paths |
| Use fixed viewBox (24x24) with consistent sizing | Mix different icon sizes randomly |

### Interaction & Cursor
| ✅ Do | ❌ Don't |
|-------|---------|
| Add `cursor-pointer` to all clickable elements | Leave default cursor on interactive items |
| Provide hover feedback (color, shadow, border) | No visual indication of interactivity |
| Use `transition-colors duration-200` | Instant changes or too slow (>500ms) |
| Visible focus states for keyboard navigation | Skip focus styles |

### Light/Dark Mode Contrast
| ✅ Do | ❌ Don't |
|-------|---------|
| Glass cards: `bg-white/80` in light mode | `bg-white/10` (too transparent) |
| Text: `slate-900` for body text in light | `slate-400` for body text |
| Muted text: minimum `slate-600` | `gray-400` or lighter |
| Borders: `border-gray-200` in light mode | `border-white/10` (invisible) |

### Layout & Spacing
| ✅ Do | ❌ Don't |
|-------|---------|
| Floating navbar: `top-4 left-4 right-4` | Stick to `top-0 left-0 right-0` |
| Account for fixed navbar height in content | Let content hide behind fixed elements |
| Consistent max-width: `max-w-6xl` or `max-w-7xl` | Mix different container widths |
| Responsive: test 320px, 768px, 1024px, 1440px | Skip mobile testing |

### Accessibility
| ✅ Do | ❌ Don't |
|-------|---------|
| All images have meaningful alt text | Empty or missing alt attributes |
| Form inputs have associated labels | Placeholders as the only label |
| Color is not the only indicator | Rely solely on color for meaning |
| Respect `prefers-reduced-motion` | Ignore motion preferences |

---

## Example Session

**User:** "Làm landing page cho dịch vụ chăm sóc da chuyên nghiệp"

**AI executes:**

```bash
# 1. Product & Style (auto-detect works well here)
python3 .shared/ui-ux-pro-max/scripts/search.py "beauty spa skincare"
python3 .shared/ui-ux-pro-max/scripts/search.py "elegant minimal luxury"

# 2. Structure
python3 .shared/ui-ux-pro-max/scripts/search.py "landing hero testimonial" --domain layouts
python3 .shared/ui-ux-pro-max/scripts/search.py "hero navbar footer" --domain components

# 3. Visuals
python3 .shared/ui-ux-pro-max/scripts/search.py "elegant luxury" --domain typography
python3 .shared/ui-ux-pro-max/scripts/search.py "beauty wellness" --domain color
python3 .shared/ui-ux-pro-max/scripts/search.py "glass gradient soft" --domain effects

# 4. Motion (if React)
python3 .shared/ui-ux-pro-max/scripts/search.py "fade whileInView" --domain motion

# 5. UX & Stack
python3 .shared/ui-ux-pro-max/scripts/search.py "accessibility forms" --domain ux
python3 .shared/ui-ux-pro-max/scripts/search.py "layout" --stack html-tailwind
```

---

## Tips

1. **Auto-detection is smart** - Omit `--domain` for most queries
2. **Search iteratively** - Different keywords reveal different insights
3. **Combine domains** - Style + Typography + Color = Complete design system
4. **Always check UX** - Search "accessibility", "animation", "z-index"
5. **Split into files** - Keep components under 200-300 lines each
6. **Use `--json` flag** - For programmatic processing of results

---

## Prerequisites

<details>
<summary>Click to expand Python installation instructions</summary>

Check if Python is installed:
```bash
python3 --version || python --version
```

**macOS:**
```bash
brew install python3
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install python3
```

**Windows:**
```powershell
winget install Python.Python.3.12
```

</details>

---

<!-- ═══════════════════════════════════════════════════════════════════════════
     REMINDER: Search multiple domains until you have comprehensive context.
     Auto-domain detection is available - use it when unsure which domain.
     Always verify UI against the Professional Checklist before delivery.
     ═══════════════════════════════════════════════════════════════════════════ -->
