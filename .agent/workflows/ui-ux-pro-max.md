---
description: Plan and implement UI
auto_execution_mode: 3
---

# UI/UX Pro Max - Design Intelligence

Searchable database of UI styles, color palettes, font pairings, chart types, product recommendations, UX guidelines, and stack-specific best practices.

## Prerequisites

Check if Python is installed:

```bash
python3 --version || python --version
```

If Python is not installed, install it based on user's OS:

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

---

## How to Use This Workflow

When user requests UI/UX work (design, build, create, implement, review, fix, improve), follow this workflow:

### Step 1: Analyze User Requirements

Extract key information from user request:
- **Product type**: SaaS, e-commerce, portfolio, dashboard, landing page, etc.
- **Style keywords**: minimal, playful, professional, elegant, dark mode, etc.
- **Industry**: healthcare, fintech, gaming, education, etc.
- **Stack**: React, Vue, Next.js, or default to `html-tailwind`

### Step 2: Search Relevant Domains

Use `search.py` multiple times to gather comprehensive information. Search until you have enough context.

```bash
python3 .shared/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

**Recommended search order:**

1. **Product** - Get style recommendations for product type
2. **Style** - Get detailed style guide (colors, frameworks)
3. **Layout** - Get layout structure patterns (e.g., "dashboard", "landing")
4. **Components** - Get code structure for key parts (Navbar, Hero, Cards)
5. **Effects** - Get CSS visual effects (gradients, shadows, glass)
6. **Animations** - Get animation patterns (fade, slide, hover)
7. **Examples** - Get real-world references for inspiration
8. **Typography** - Get font pairings
9. **Color** - Get palette
10. **UX** - Get best practices

### Step 3: Stack Guidelines (Default: html-tailwind)

If user doesn't specify a stack, **default to `html-tailwind`**.

```bash
python3 .shared/ui-ux-pro-max/scripts/search.py "<keyword>" --stack html-tailwind
```

---

## Search Reference

### Available Domains

| Domain | Use For | Example Keywords |
|--------|---------|------------------|
| `product` | Product recommendations | SaaS, e-commerce, portfolio, healthcare |
| `style` | UI styles, visual themes | glassmorphism, minimalism, dark mode |
| `layout` | Page structures, grids | dashboard, landing, sidebar, grid |
| `components` | UI parts code structure | navbar, hero, card, footer, button |
| `effects` | CSS effects, visuals | gradient, glass, shadow, glow |
| `animations` | Animation keyframes | fade, slide, hover, entrance |
| `examples` | Real-world sites | stripe, linear, apple, saas |
| `typography` | Font pairings | elegant, modern, mono |
| `color` | Color palettes | saas, fintech, dark |
| `ux` | Best practices | accessibility, forms, loading |
| `chart` | Data visualization | trend, pie, comparison |

### Available Stacks (unchanged)
...

## Example Workflow

**User request:** "Làm landing page cho dịch vụ chăm sóc da chuyên nghiệp"

**AI should:**

```bash
# 1. Search product type & style
python3 .shared/ui-ux-pro-max/scripts/search.py "beauty spa" --domain product
python3 .shared/ui-ux-pro-max/scripts/search.py "elegant minimal" --domain style

# 2. Get Layout & Components
python3 .shared/ui-ux-pro-max/scripts/search.py "landing hero" --domain layout
python3 .shared/ui-ux-pro-max/scripts/search.py "hero navbar testimonial" --domain components

# 3. Get Visuals (Fonts, Colors, Effects)
python3 .shared/ui-ux-pro-max/scripts/search.py "elegant luxury" --domain typography
python3 .shared/ui-ux-pro-max/scripts/search.py "beauty wellness" --domain color
python3 .shared/ui-ux-pro-max/scripts/search.py "glass gradient" --domain effects

# 4. Get Animations
python3 .shared/ui-ux-pro-max/scripts/search.py "fade soft slide" --domain animations

# 5. Check UX & Stack
python3 .shared/ui-ux-pro-max/scripts/search.py "accessibility" --domain ux
python3 .shared/ui-ux-pro-max/scripts/search.py "layout" --stack html-tailwind
```

**Then:** Synthesize into a complete, beautiful design.

---

## Tips for Better Results

1. **Be specific with keywords** - "healthcare SaaS dashboard" > "app"
2. **Search multiple times** - Different keywords reveal different insights
3. **Combine domains** - Style + Typography + Color = Complete design system
4. **Always check UX** - Search "animation", "z-index", "accessibility" for common issues
5. **Use stack flag** - Get implementation-specific best practices
6. **Iterate** - If first search doesn't match, try different keywords
7. **Split Into Multiple Files** - For better maintainability:
   - Separate components into individual files (e.g., `Header.tsx`, `Footer.tsx`)
   - Extract reusable styles into dedicated files
   - Keep each file focused and under 200-300 lines

---

## Common Rules for Professional UI

These are frequently overlooked issues that make UI look unprofessional:

### Icons & Visual Elements

| Rule | Do | Don't |
|------|----|----- |
| **No emoji icons** | Use SVG icons (Heroicons, Lucide, Simple Icons) | Use emojis like 🎨 🚀 ⚙️ as UI icons |
| **Stable hover states** | Use color/opacity transitions on hover | Use scale transforms that shift layout |
| **Correct brand logos** | Research official SVG from Simple Icons | Guess or use incorrect logo paths |
| **Consistent icon sizing** | Use fixed viewBox (24x24) with w-6 h-6 | Mix different icon sizes randomly |

### Interaction & Cursor

| Rule | Do | Don't |
|------|----|----- |
| **Cursor pointer** | Add `cursor-pointer` to all clickable/hoverable cards | Leave default cursor on interactive elements |
| **Hover feedback** | Provide visual feedback (color, shadow, border) | No indication element is interactive |
| **Smooth transitions** | Use `transition-colors duration-200` | Instant state changes or too slow (>500ms) |

### Light/Dark Mode Contrast

| Rule | Do | Don't |
|------|----|----- |
| **Glass card light mode** | Use `bg-white/80` or higher opacity | Use `bg-white/10` (too transparent) |
| **Text contrast light** | Use `#0F172A` (slate-900) for text | Use `#94A3B8` (slate-400) for body text |
| **Muted text light** | Use `#475569` (slate-600) minimum | Use gray-400 or lighter |
| **Border visibility** | Use `border-gray-200` in light mode | Use `border-white/10` (invisible) |

### Layout & Spacing

| Rule | Do | Don't |
|------|----|----- |
| **Floating navbar** | Add `top-4 left-4 right-4` spacing | Stick navbar to `top-0 left-0 right-0` |
| **Content padding** | Account for fixed navbar height | Let content hide behind fixed elements |
| **Consistent max-width** | Use same `max-w-6xl` or `max-w-7xl` | Mix different container widths |

---

## Pre-Delivery Checklist

Before delivering UI code, verify these items:

### Visual Quality
- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] Brand logos are correct (verified from Simple Icons)
- [ ] Hover states don't cause layout shift

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

### Light/Dark Mode
- [ ] Light mode text has sufficient contrast (4.5:1 minimum)
- [ ] Glass/transparent elements visible in light mode
- [ ] Borders visible in both modes
- [ ] Test both modes before delivery

### Layout
- [ ] Floating elements have proper spacing from edges
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected
