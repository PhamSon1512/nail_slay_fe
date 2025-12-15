---
description: Learn design patterns from Framer marketplace templates
auto_execution_mode: 2
---

# Learn from Framer Templates

Extract design patterns, sections, features, and styles from Framer marketplace templates to enhance UI/UX Pro Max database.

## Quick Start

```bash
# Provide a Framer template URL
/learn-framer-template https://www.framer.com/marketplace/templates/<template-name>/
```

---

## Workflow Steps

### Step 1: Fetch Template Info

Read the template page to extract:

1. **Template Name** - The title of the template
2. **Description** - What it's designed for
3. **Categories** - Agency, Landing Page, Portfolio, etc.
4. **Features** - A11y, Animations, CMS, Forms, etc.
5. **Sections** - Hero, Services, Pricing, Team, etc.
6. **Style Keywords** - Modern, Minimal, Professional, etc.
7. **Best For** - Target industries/use cases

### Step 2: Analyze Design Patterns

From the template, identify:

#### Section Patterns
| Section | Purpose | Common Elements |
|---------|---------|-----------------|
| Hero | First impression | Headline, Subhead, CTA, Image/Video |
| Why Choose Us | Build credibility | Icons, Benefits, Stats |
| Services | Present offerings | Cards, Icons, Descriptions |
| Features | Highlight benefits | Grid, Icons, Short text |
| Testimonials | Social proof | Quotes, Avatars, Ratings |
| Pricing | Convert visitors | Tiers, Features list, CTAs |
| Process | Explain workflow | Steps, Numbers, Timeline |
| Team | Humanize brand | Photos, Names, Roles |
| Stats/Impact | Show results | Numbers, Counters, Metrics |
| FAQ | Answer objections | Accordion, Q&A pairs |
| CTA/Contact | Final conversion | Form, Contact info, Map |

#### Feature Patterns
| Feature | Implementation |
|---------|---------------|
| Sticky Scrolling | `position: sticky` with scroll-triggered reveals |
| Animations | Framer Motion / CSS keyframes on scroll-in |
| Slideshows/Tickers | Auto-scroll carousels, infinite loops |
| Overlays/Modals | Click-triggered popups for forms/details |
| Site Search | Filter content, CMS-based search |
| Visual Breakpoints | Responsive design at 768px, 1024px, 1440px |

### Step 3: Add to Database

Add extracted patterns to the appropriate CSV files:

#### a) Add to `examples.csv`
```csv
Name,URL,Category,Style,Description,Best Features,Tech Stack
<template-name>,<preview-url>,<category>,<style-keywords>,<description>,<key-features>,Framer
```

#### b) Add to `landing.csv` (if landing page patterns)
```csv
Pattern Name,Keywords,Section Order,Primary CTA Placement,Color Strategy,Conversion Optimization
<pattern-name>,<keywords>,<section-order>,<cta-placement>,<color-strategy>,<optimization-tips>
```

#### c) Add to `components.csv` (if new component patterns)
```csv
Name,Keywords,HTML Structure,Tailwind Classes,Best For,Notes
<component-name>,<keywords>,<html-structure>,<tailwind-classes>,<best-for>,<notes>
```

#### d) Add to `styles.csv` (if new style patterns)
```csv
Style Category,Type,Keywords,Primary Colors,Effects & Animation,Best For,Performance,Accessibility,Framework Compatibility,Complexity
<style-name>,<type>,<keywords>,<colors>,<effects>,<best-for>,<perf>,<a11y>,<frameworks>,<complexity>
```

---

## Example: Learn from "Stratex" Template

**Input:** `https://www.framer.com/marketplace/templates/stratex/`

**Extracted Data:**

| Field | Value |
|-------|-------|
| Name | Stratex |
| Category | Agency, Landing Page |
| Style | Minimal, Professional, Modern |
| Best For | Consultants, Agencies, Business Professionals |
| Sections | Hero → Why Choose Us → Services → Reviews → Features → Pricing → Process → Stats → Team → Appointment |
| Features | A11y, Animations, SEO, Forms, Sticky Scrolling, Components |

**Add to `examples.csv`:**
```csv
Stratex,https://stratex.framer.website,Agency Landing,minimal professional modern,Consulting agency template with polished high-converting layout,Sticky scroll + Smooth animations + SEO-friendly + Impact stats,Framer
```

**Add to `landing.csv`:**
```csv
Consulting Agency,consulting agency professional business,Hero > Why Choose Us > Services > Reviews > Features > Pricing > Process > Stats > Team > CTA,Hero + Pricing + Final CTA,Neutral with accent CTA,Trust signals early + Stats for credibility + Clear pricing tiers
```

---

## Browse Framer Categories

Explore templates by category:

| Category | URL | Count |
|----------|-----|-------|
| Business | https://www.framer.com/marketplace/templates/category/business/ | 2.8K |
| Creative | https://www.framer.com/marketplace/templates/category/creative/ | 1.6K |
| Style | https://www.framer.com/marketplace/templates/category/style/ | 2K |
| Community | https://www.framer.com/marketplace/templates/category/community/ | 205 |
| Free | https://www.framer.com/marketplace/templates/category/free-website-templates/ | 1.3K |
| Agency | https://www.framer.com/marketplace/templates/category/agency/ | - |
| Landing Page | https://www.framer.com/marketplace/templates/category/landing-page/ | - |
| Portfolio | https://www.framer.com/marketplace/templates/category/portfolio/ | - |
| Minimal | https://www.framer.com/marketplace/templates/category/minimal/ | - |
| Modern | https://www.framer.com/marketplace/templates/category/modern/ | - |

---

## Tips

1. **Focus on section order** - This is the most valuable pattern for landing pages
2. **Note CTA placement** - Where conversion actions appear matters
3. **Extract style keywords** - Add to existing style vocabulary
4. **Look for unique features** - Sticky scroll, animations, modals
5. **Check demo sites** - Often at `<template-name>.framer.website`
6. **Batch learning** - Process 5-10 templates per session for efficiency

---

## Output Checklist

After learning from a template, verify you've added:

- [ ] Entry to `examples.csv` with URL, category, style, features
- [ ] Landing pattern to `landing.csv` (if applicable)
- [ ] New component patterns to `components.csv`
- [ ] New style patterns to `styles.csv`
- [ ] Commit changes with descriptive message

```bash
git add .shared/ui-ux-pro-max/data/*.csv
git commit -m "feat(ui-db): add patterns from Framer template - <template-name>"
```
