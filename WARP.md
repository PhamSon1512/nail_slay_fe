# FIGMA TO CODE RULES - SONNET 4.5

## 🚨 CORE RULES (MUST FOLLOW)

### 1. NO CODE WITHOUT FIGMA DATA
- ❌ If Figma fetch fails → STOP immediately
- ❌ NO guessing/assumptions about colors, spacing, typography
- ✅ Show error message and wait for user to fix
- ✅ Request screenshot if Figma MCP unavailable

### 2. NO ABSOLUTE POSITIONING
- ❌ NEVER use `position: absolute`, `top`, `left`, `right`, `bottom`
- ✅ ONLY use flex/grid for layouts
- ✅ Exception: Modals/overlays with `fixed inset-0` if shown in Figma

### 3. NO INLINE STYLES
- ❌ NEVER use `style={{}}` prop
- ✅ ALWAYS use Tailwind classes only
- ✅ Use `cn()` utility for conditional classes

### 4. HEROUI COMPONENTS FIRST
- ✅ Start with HeroUI: `Button`, `Card`, `Input`, `Modal`, `Navbar`
- ✅ Extend with Tailwind for exact Figma styling
- ✅ HeroUI provides: accessibility, responsive, interactions
- ❌ DON'T build from scratch if HeroUI component exists
- 📖 Verify API at [HeroUI Docs](https://heroui.com/docs) before implementing

## TECH STACK
- React 19 + React Router v7 (file-based routing)
- TypeScript 5.8+ (NO `any` types)
- Tailwind CSS v4 + HeroUI v2.8+
- Framer Motion v12+ (animations)
- Valtio v2+ (state)
- xior v0.7+ (HTTP)
- Cloudflare Pages (SSR)

## WORKFLOW (FOLLOW IN ORDER)

```mermaid
flowchart TD
    A[Receive Figma URL/Node-ID] --> B{Can fetch Figma?}
    B -->|No| C[STOP - Request screenshot]
    B -->|Yes| D[Extract design context + assets]
    D --> E{Has custom fonts?}
    E -->|Yes| F[Add to root.tsx + @theme]
    E -->|No| G[Use default Inter]
    F --> H[Extract Figma variables]
    G --> H
    H --> I[Plan layout with HeroUI]
    I --> J[Create component]
    J --> K[Export in index.ts]
    K --> L[Import in _index.tsx]
    L --> M[Verify & Test]
```

### Phase 1: Fetch Figma Data

#### Step 1.1: Extract Node ID from URL
**Convert Figma URL to nodeId:**
```
URL: https://figma.com/design/:fileKey/:fileName?node-id=4-34960
NodeId: "4:34960"  (replace hyphen with colon)
```

#### Step 1.2: Fetch Design Context
```typescript
mcp0_get_design_context({
  nodeId: "4:34960",
  clientLanguages: "typescript",
  clientFrameworks: "react",
  // 🚨 Use actual workspace path (check Active Document or run `pwd`)
  dirForAssetWrites: "/Users/username/project/public/assets"
})
```

**You'll get:**
- Design structure (XML/JSON), CSS styles, colors, typography
- Assets exported to `public/assets/` (images, logos, icons)

**If fetch fails:**
1. Check Figma desktop app is running
2. Verify node-id is correct
3. Ask user for screenshot as fallback

#### Step 1.3: Extract Figma Variables (Optional)
```typescript
mcp0_get_variable_defs({ nodeId: "4:34960" })
```
Returns: `{"color/primary/500": "#0066FF", "spacing/base": "16px"}`

**Map to @theme:** Copy values → Paste into `app/app.css` → Convert to CSS variables
- Example: `"color/primary/500": "#0066FF"` → `--color-primary-500: #0066FF;`

---

### Phase 2: Configuration

#### Step 2.1: Add Google Fonts to `app/root.tsx`
**Extract font names from Figma → Add to links:**

```tsx
// app/root.tsx
export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  // Get URL from fonts.google.com
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap' },
];
```
**Note**: Search fonts at [Google Fonts](https://fonts.google.com), select weights from Figma, copy `<link>` href

#### Step 2.2: Configure Tailwind Theme in `app/app.css`
```css
@theme {
  /* Fonts - match with root.tsx (use --font-sans, NOT --font-family-sans) */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "Poppins", ui-sans-serif, system-ui, sans-serif;
  
  /* Colors from Figma */
  --color-primary: #0066FF;
  --color-primary-hover: #0052CC;
  --color-secondary: #6B7280;
  
  /* Or use color scales from Figma variables */
  --color-primary-500: #28a745;
  --color-primary-600: #21963b;
  
  /* Container widths from Figma */
  --container-xl: 1280px;
}
```


---

### Phase 3: Component Creation

#### Step 3.1: Plan Layout with HeroUI
**Available components:**
```tsx
import { Button, Card, Input, Modal, Navbar, Tabs } from "@heroui/react";
```

**Mapping Figma → HeroUI:**
- Buttons → `<Button>`
- Cards/Containers → `<Card>`
- Form inputs → `<Input>`, `<Checkbox>`, `<Radio>`
- Navigation → `<Navbar>`, `<Tabs>`
- Modals/Dialogs → `<Modal>`

#### Step 3.2: Create Component File
**Location:** `app/components/sections/ComponentName.tsx`

```tsx
// app/components/sections/HeroSection.tsx
import { Button } from "@heroui/react";

export function HeroSection() {
  return (
    <section className="container py-16">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-5xl font-heading font-bold text-primary">
          {/* Extract text from Figma */}
          Welcome to Z9 Studio
        </h1>
        <Button 
          className="bg-primary hover:bg-primary-hover"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
}
```

**Naming:**
- Use `PascalCase.tsx` for component files
- Place in `app/components/sections/`
- Export named components (NOT default export)
- Use semantic names: `HeroSection`, `FeaturesSection`

**Assets:**
```tsx
<img src="/assets/hero-image.png" alt="Hero" width="800" height="600" />
```

#### Step 3.3: Export in `app/components/index.ts`
```tsx
export { HeroSection } from './sections/HeroSection';
export { FeaturesSection } from './sections/FeaturesSection';
```

---

### Phase 4: Integration

#### Step 4.1: Import and Display in `_index.tsx`
```tsx
// app/routes/_index.tsx
import type { Route } from './+types/_index';
import { HeroSection, FeaturesSection } from '~/components';

export const meta = ({}: Route.MetaArgs) => [
  { title: 'Z9 Studio' },
  { name: 'description', content: 'Welcome to Z9 Studio!' }
];

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  );
}
```

---

### Phase 5: Verification

#### Step 5.1: Pre-flight Checklist
- [ ] Figma data fetched successfully
- [ ] Google Fonts added to `app/root.tsx`
- [ ] `@theme` configured in `app/app.css` with correct variable names
- [ ] Font names match between root.tsx and @theme
- [ ] Colors extracted from Figma (exact hex values)
- [ ] HeroUI components identified
- [ ] Assets exported to `public/assets/`

#### Step 5.2: Run Dev Server & Validate
**Commands:**
```bash
npm run dev          # Start dev server
npx tsc --noEmit     # TypeScript validation
```

**Check:**
- [ ] Fonts load correctly (inspect in DevTools)
- [ ] Layout matches Figma visually
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] No `any` types used
- [ ] Responsive on mobile (320px), tablet (768px), desktop (1024px+)



#### Step 5.3: Accessibility Audit
**Tools:** Browser DevTools → Lighthouse, [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Checklist:**
- [ ] Color contrast ≥4.5:1 for text
- [ ] All interactive elements have focus states
- [ ] Semantic HTML used (`nav`, `main`, `article`, `section`)
- [ ] ARIA labels on icons/buttons
- [ ] Keyboard navigation works (Tab, Enter, Escape)

---

## TROUBLESHOOTING

### Fonts not loading
**Symptoms:** Text shows default system font

**Solutions:**
1. Verify Google Fonts links in `app/root.tsx` 
2. Check `@theme` has correct font names: `--font-sans` (NOT `--font-family-sans`)
3. Ensure font names match exactly between root.tsx and @theme
4. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
5. Check Network tab - fonts should load from googleapis.com

### Colors don't match Figma
**Solutions:**
1. Use Figma's color picker (NOT browser eyedropper)
2. Verify `@theme` variables match exactly (case-sensitive)
3. Check using custom tokens: `bg-primary` (NOT `bg-[#0066FF]`)
4. Verify no inline styles or hardcoded colors

### Layout broken on mobile
**Solutions:**
1. Verify using `flex` or `grid` (NOT absolute positioning)
2. Add responsive breakpoints: `md:`, `lg:`
3. Check padding: `px-4 md:px-6 lg:px-8`
4. Test at actual viewports: 320px, 768px, 1024px

### Assets/images not showing
**Solutions:**
1. Verify `dirForAssetWrites` path was set correctly in Figma MCP call
2. Check assets exist in `public/assets/` folder
3. Use correct path: `/assets/image.png` (NOT `./assets/`)
4. Verify image file extensions match (case-sensitive)

### HeroUI components not working
**Solutions:**
1. Check HeroUI version: `npm ls @heroui/react`
2. Verify import: `import { Button } from "@heroui/react"`
3. Check [HeroUI Docs](https://heroui.com/docs) for correct API
4. Ensure `<HeroUIProvider>` wraps app in `root.tsx`

### TypeScript errors
**Solutions:**
1. Run `npx tsc --noEmit` to see all errors
2. Add proper type annotations (NO `any`)
3. Import types: `import type { Route } from './+types/_index'`
4. Check props interface naming: `{Component}Props`

---

## QUALITY CHECKLIST

### Visual & Layout
- [ ] Pixel-perfect match with Figma
- [ ] Fonts load and display correctly
- [ ] Colors match exactly
- [ ] Spacing matches Figma measurements
- [ ] Responsive on all breakpoints

### Interactivity
- [ ] All interactive elements have hover/focus/active states
- [ ] Transitions smooth (duration-200)
- [ ] Loading states for async operations
- [ ] Error states with retry functionality

### Performance
- [ ] Images optimized (WebP format, lazy loading)
- [ ] Images have width/height attributes
- [ ] No layout shift (CLS score)
- [ ] Assets < 100KB for hero, < 50KB for thumbnails

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly (ARIA labels, semantic HTML)
- [ ] Color contrast ≥4.5:1 for text
- [ ] Focus visible on all interactive elements

### Code Quality
- [ ] TypeScript no errors/warnings
- [ ] NO `any` types used
- [ ] NO absolute positioning
- [ ] NO inline styles
- [ ] Using HeroUI components where applicable
- [ ] Using custom tokens (NOT hardcoded values)
- [ ] NO console errors in browser

---



## REFERENCE - CODE STANDARDS

### Naming Quick Reference
**Files:**
- Routes: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`)
- Utils: `kebab-case.ts` (e.g., `format-date.ts`)
- Hooks: `camelCase.ts` (e.g., `useAuth.ts`)
- Stores: `kebab-case.ts` (e.g., `auth-store.ts`)

**Code:**
- Components: `PascalCase` (e.g., `UserProfile`)
- Props: `{Component}Props` (e.g., `UserProfileProps`)
- Variables: `camelCase` (e.g., `userName`)
- Booleans: `is/has/should/can` prefix (e.g., `isLoading`)
- Functions: `camelCase` + verb (e.g., `getUserData`)
- Event handlers: `handle{Event}` (e.g., `handleClick`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- Hooks: `use{Name}` (e.g., `useAuth`)
- Stores: `camelCase` + `Store` (e.g., `authStore`)

### Best Practices

**Responsive Design:**
- Mobile-first: `text-2xl md:text-4xl lg:text-5xl`
- Spacing: `py-8 md:py-12 lg:py-16`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

**Animations (ONLY if in Figma):**
```tsx
import { motion } from 'framer-motion';
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
```

**Tailwind:**
- Prefer standard: `text-xl` not `text-[20px]`
- Use brackets `[]` ONLY for exact Figma values
