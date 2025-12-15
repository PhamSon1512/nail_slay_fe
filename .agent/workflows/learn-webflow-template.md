---
description: Learn design patterns from Webflow marketplace templates
auto_execution_mode: 2
---

# Learn from Webflow Templates

Extract design patterns, sections, features, and styles from Webflow marketplace templates to enhance UI/UX Pro Max database.

## Quick Start

```bash
# Provide a Webflow template URL (template page or demo site)
/learn-webflow-template https://webflow.com/templates/html/<template-name>-website-template

# Or provide demo site directly
/learn-webflow-template https://<template-name>.webflow.io/
```

---

## Workflow Steps

### Step 1: Fetch Template Info

From the Webflow template page, extract:

1. **Template Name** - The title of the template
2. **Price** - Free or USD price
3. **Designer** - Creator/studio name
4. **Demo URL** - Usually `<template-name>.webflow.io`
5. **Description** - What it's designed for
6. **Perfect For** - Target industries/use cases
7. **Features** - Animations, CMS, Responsive, SEO
8. **Pages Included** - Homepage, About, Pricing, Blog, etc.
9. **Style Keywords** - Modern, Minimal, Dark, etc.

### Step 2: Analyze Demo Site

Visit the demo URL to identify:

#### Section Patterns
| Section | Purpose | Common Elements |
|---------|---------|-----------------|
| Hero | First impression | Headline, Subhead, CTA buttons, Image/Video |
| Features | Highlight benefits | Icon grids, Feature cards, Screenshots |
| Pricing | Convert visitors | Toggle (Monthly/Annual), Tier cards, CTA |
| Testimonials | Social proof | Quotes, Avatars, Company logos |
| FAQ | Answer objections | Accordion panels |
| Blog | Content/SEO | CMS Collection, Categories, Featured posts |
| Integration | Show ecosystem | Logo grid, Integration cards |
| CTA Banner | Final conversion | Headline, CTA button, Background |
| Footer | Navigation | Links, Newsletter form, Social icons |

#### Webflow-Specific Features
| Feature | Description |
|---------|-------------|
| CMS Collections | Dynamic content for Blog, Careers, Integrations |
| E-commerce | Product pages, Cart, Checkout |
| Interactions | Scroll-triggered animations, Hover effects |
| Responsive | Breakpoints at Desktop, Tablet, Mobile L, Mobile |
| SEO | Meta tags, Open Graph, Sitemap |
| Forms | Contact, Newsletter, Lead capture |

### Step 3: Add to Database

Add extracted patterns to the appropriate CSV files:

#### a) Add to `examples.csv`
```csv
Name,URL,Category,Style,Description,Best Features,Tech Stack
<template-name>,<demo-url>,<category>,<style-keywords>,<description>,<key-features>,Webflow
```

#### b) Add to `landing.csv` (if landing/marketing page patterns)
```csv
Pattern Name,Keywords,Section Order,Primary CTA Placement,Color Strategy,Conversion Optimization
<pattern-name>,<keywords>,<section-order>,<cta-placement>,<color-strategy>,<optimization-tips>
```

#### c) Add to `components.csv` (if new component patterns)
```csv
Name,Keywords,HTML Structure,Tailwind Classes,Best For,Notes
<component-name>,<keywords>,<html-structure>,<tailwind-classes>,<best-for>,<notes>
```

---

## Example: Learn from "Outnex" Template

**Template URL:** `https://webflow.com/templates/html/outnex-website-template`
**Demo URL:** `https://outnex.webflow.io/`

**Extracted Data:**

| Field | Value |
|-------|-------|
| Name | Outnex |
| Price | $99 USD |
| Designer | Onixtheme |
| Category | SaaS, Marketing, AI |
| Style | Modern, Sleek, Conversion-focused |
| Best For | AI Cold Email Tools, Marketing Automation, SaaS Startups, B2B Lead Gen |
| Features | Smooth animations, CMS, Responsive, Fast loading, SEO optimized, Figma included |
| Pages | Home, About, Features, Blog, Blog Single (CMS), Pricing, Pricing Single (E-com), Integration, Integration Single (CMS), Career, Career Single (CMS), Contact, Privacy Policy, 404, Auth pages |
| Sections | Hero → Features Grid → Unlock Potential → Pricing Toggle → FAQ Accordion → CTA Banner → Footer |

**Add to `examples.csv`:**
```csv
Outnex,outnex.webflow.io,SaaS AI Marketing,Modern Sleek Dark,"Cold email & lead generation template with AI focus",Smooth animations + CMS collections + Pricing toggle + FAQ accordion + Multi-page,Webflow
```

**Add to `landing.csv`:**
```csv
AI SaaS Marketing,ai saas cold-email marketing lead-gen b2b,Hero (headline + dual CTA) > Features Grid > Unlock Potential (3 cards) > Pricing Toggle (Monthly/Annual) > FAQ Accordion > CTA Banner > Footer,Hero + Pricing section + Final CTA banner,Dark gradient background. Accent: Vibrant blue/purple. CTAs: High contrast gradient buttons.,Dual CTA in hero (Explore Demo + Learn More). Pricing toggle shows discount. FAQ addresses objections. Trust signals via client logos.
```

---

## Browse Webflow Categories

Explore templates by category:

| Category | URL | Description |
|----------|-----|-------------|
| Portfolio & Agency | https://webflow.com/templates/category/portfolio-and-agency-websites | Creative portfolios, agency sites |
| Technology | https://webflow.com/templates/category/technology-websites | SaaS, tech startups, apps |
| Blog & Editorial | https://webflow.com/templates/category/blog-and-editorial-websites | Content-focused sites |
| Personal | https://webflow.com/templates/category/personal-websites | Personal brands, resumes |
| Professional Services | https://webflow.com/templates/category/professional-services-websites | Consultants, lawyers, doctors |
| Real Estate | https://webflow.com/templates/category/real-estate-websites | Property listings, agents |
| Retail & E-commerce | https://webflow.com/templates/category/retail-and-e-commerce-websites | Online stores |
| Free Templates | https://webflow.com/templates/free-website-templates | Free starter templates |
| Featured | https://webflow.com/templates/featured | Curated monthly picks |

---

## Webflow vs Framer Comparison

| Aspect | Webflow | Framer |
|--------|---------|--------|
| **CMS** | Robust, full database-like | Simpler, content-focused |
| **E-commerce** | Built-in, full checkout | Limited |
| **Interactions** | Timeline-based, complex | Code-based (Framer Motion) |
| **Responsive** | 4+ breakpoints | Auto-responsive |
| **Code Export** | Yes, clean HTML/CSS | No |
| **Price Range** | $29-$169 typical | $19-$99 typical |

---

## Tips

1. **Check demo site** - Always visit `<template>.webflow.io` to see full interactions
2. **Note CMS structure** - Webflow templates often include rich CMS collections
3. **Extract page list** - Webflow templates often have 10-20+ pages
4. **Look for animations** - Webflow's interaction system produces unique scroll effects
5. **Check responsive** - Test demo at different breakpoints
6. **Style guide page** - Many templates include `/style-guide` with design tokens
7. **Figma file** - Premium templates often include Figma source

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
git commit -m "feat(ui-db): add patterns from Webflow template - <template-name>"
```
