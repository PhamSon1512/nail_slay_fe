# FIGMA TO CODE RULES - SONNET 4.5

## 🚨 CRITICAL RULES (MUST FOLLOW)

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

### 4. PREFER STANDARD TAILWIND CLASSES
- ✅ Use `text-xl` instead of `text-[20px]`
- ✅ Use `p-4 m-6` instead of `p-[16px] m-[24px]`
- ✅ Use `bg-blue-500` instead of `bg-[#3B82F6]`
- ✅ Use brackets `[]` ONLY for non-standard Figma values

### 5. ALWAYS USE HEROUI COMPONENTS FOR LAYOUT
- ✅ Start with HeroUI: `Button`, `Card`, `Input`, `Modal`, `Navbar`
- ✅ Extend with Tailwind for exact Figma styling
- ✅ HeroUI provides: accessibility, responsive, interactions
- ❌ DON'T build from scratch if HeroUI component exists

### 6. IMAGES & ASSETS OPTIMIZATION
- ✅ Use WebP format with PNG/JPG fallback
- ✅ Add `loading="lazy"` for images below fold
- ✅ Use `width` and `height` attributes (prevent layout shift)
- ✅ Optimize images: max 100KB for hero, 50KB for thumbnails
- ✅ Use `<picture>` for responsive images
```tsx
<picture>
  <source srcset="/images/hero-mobile.webp" media="(max-width: 768px)" />
  <source srcset="/images/hero-desktop.webp" media="(min-width: 769px)" />
  <img src="/images/hero-desktop.jpg" alt="Hero" width="1920" height="1080" />
</picture>
```

### 7. MICRO-INTERACTIONS & POLISH
- ✅ Add hover states to ALL interactive elements
- ✅ Use `transition-all duration-200` for smooth effects
- ✅ Add focus states: `focus:ring-2 focus:ring-primary`
- ✅ Disabled states: `disabled:opacity-50 disabled:cursor-not-allowed`
- ✅ Loading states: Show spinners or skeleton loaders
```tsx
<Button 
  className="
    bg-primary hover:bg-primary-hover 
    hover:scale-105 hover:shadow-lg
    active:scale-95
    transition-all duration-200
    focus:ring-2 focus:ring-primary focus:ring-offset-2
  "
>
  Click Me
</Button>
```

### 8. SPACING & LAYOUT CONSISTENCY
- ✅ Use consistent spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- ✅ Maintain vertical rhythm with gap utilities
- ✅ Use `space-y-*` for vertical stacks
- ✅ Use `gap-*` for flex/grid layouts
- ✅ Container padding: `px-4 md:px-6 lg:px-8`

### 9. TYPOGRAPHY HIERARCHY
- ✅ Clear size progression: h1 > h2 > h3 > body > small
- ✅ Consistent line-height: 1.2 for headings, 1.6 for body
- ✅ Letter-spacing: tighter for headings, normal for body
- ✅ Font weights: Bold (700) headings, Regular (400) body
```tsx
<h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
<h2 className="text-3xl md:text-4xl font-bold leading-tight">
<p className="text-base md:text-lg leading-relaxed">
```

### 10. CAROUSEL DETECTION & IMPLEMENTATION
**🚨 AUTO-DETECT CAROUSEL FROM FIGMA:**
- ✅ If Figma has arrow icons (← →) near content → Implement carousel
- ✅ If Figma shows horizontal scrollable content → Implement carousel
- ✅ Use `embla-carousel-react` (already in dependencies)
- ✅ Add prev/next buttons with arrow icons from Figma

## SETUP PROCESS (AFTER FIGMA DATA)

### 1. Configure Tailwind Theme (`app/app.css`)
```css
@theme {
  /* Extract from Figma and add here */
  --font-family-sans: "Inter", system-ui;
  --color-primary: #0066FF;        /* Figma brand color */
  --color-secondary: #6B7280;      /* Figma secondary */
  --container-xl: 1280px;           /* Figma max-width */
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
```

### 2. Use Custom Tokens in Components
```tsx
// ✅ Use configured tokens
<div className="font-sans text-primary bg-white">
  <div className="container mx-auto max-w-xl">
    <Button className="bg-primary hover:bg-primary-hover">
      Action
    </Button>
  </div>
</div>
```

## TECH STACK
- React 19 + React Router v7 (file-based routing)
- TypeScript 5.8+ (NO `any` types)
- Tailwind CSS v4 + HeroUI v2.8+
- Framer Motion v12+ (animations)
- Valtio v2+ (state)
- xior v0.7+ (HTTP)
- Cloudflare Pages (SSR)

## WORKFLOW

### Step 1: Fetch Figma
```bash
get_figma_data(fileKey, nodeId)
# If fails → STOP and inform user
```

### Step 2: Setup Tailwind Config (MANDATORY)
**After getting Figma data, setup in `app/app.css`:**

```css
@theme {
  /* Fonts from Figma */
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-family-heading: "Poppins", system-ui, sans-serif;
  
  /* Colors from Figma - exact hex values */
  --color-primary: #0066FF;
  --color-primary-hover: #0052CC;
  --color-secondary: #6B7280;
  --color-accent: #FF6B35;
  --color-success: #10B981;
  --color-danger: #EF4444;
  
  /* Container max-widths from Figma */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}

/* Load fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');
```

### Step 3: Extract Design Tokens
- ✅ Colors → Add to `@theme`
- ✅ Typography → Add fonts to `@theme`, use in classes
- ✅ Spacing → Note for consistent use
- ✅ Container widths → Add to `@theme`
- ✅ Border radius, shadows → Note for components

### Step 4: Plan Layout with HeroUI
**🚨 ALWAYS USE HEROUI COMPONENTS FIRST:**

```tsx
import { 
  Button, Card, Input, Modal, Navbar,
  Divider, Chip, Avatar, Dropdown, Tabs
} from "@heroui/react";

// ✅ Use HeroUI for structure
<Navbar>...</Navbar>           // Navigation
<Card>...</Card>                // Content blocks
<Button>...</Button>            // Actions
<Input>...</Input>              // Forms
<Modal>...</Modal>              // Overlays

// ✅ Extend with Tailwind for exact Figma match
<Button 
  className="bg-primary hover:bg-primary-hover px-6 py-3"
  radius="lg"
  size="lg"
>
  Click Me
</Button>

<Card className="p-8 shadow-lg rounded-2xl">
  <h2 className="text-2xl font-heading font-bold">Title</h2>
  <p className="text-base text-secondary">Content</p>
</Card>
```

### Step 5: Build Layout Structure
- ✅ Use HeroUI components for UI elements
- ✅ Use Flexbox/Grid for positioning (NO absolute)
- ✅ Mobile-first responsive classes
- ✅ Apply custom Tailwind tokens from `@theme`

### Step 6: Implement & Style
- ✅ Start with HeroUI component
- ✅ Add exact spacing from Figma with Tailwind
- ✅ Use custom color/font tokens: `bg-primary`, `font-heading`
- ✅ Add Framer Motion ONLY if in Figma

### Step 7: Verify Checklist
**Before Coding:**
- [ ] Figma data fetched successfully
- [ ] Tailwind `@theme` configured with Figma tokens
- [ ] Fonts loaded and added to theme
- [ ] Colors added to theme (custom tokens)
- [ ] Container widths configured
- [ ] HeroUI components identified for layout

**After Coding:**
- [ ] Visual match: code vs Figma 100%
- [ ] Using HeroUI components where applicable
- [ ] Colors from custom tokens (not hardcoded)
- [ ] Typography matches Figma
- [ ] Spacing matches exactly
- [ ] NO absolute positioning
- [ ] Responsive at all breakpoints
- [ ] NO console errors
- [ ] TypeScript complete (NO `any`)
- [ ] Hover/focus states on interactive elements
- [ ] Loading states implemented
- [ ] Accessibility: ARIA labels, keyboard nav, contrast ≥4.5:1

## RESPONSIVE DESIGN
```tsx
// ✅ Mobile-first Tailwind
<div className="flex flex-col md:flex-row lg:gap-8">
  <h1 className="text-2xl md:text-4xl lg:text-5xl">Title</h1>
</div>

// ✅ JS logic with @mantine/hooks
import { useMediaQuery } from '@mantine/hooks';
const isMobile = useMediaQuery('(max-width: 768px)');
```

## ANIMATIONS (Framer Motion)
```tsx
// ✅ ONLY if specified in Figma
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400 }}
>
  Button
</motion.button>

// ✅ Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## ACCESSIBILITY (A11Y)
```tsx
// ✅ Semantic HTML
<nav aria-label="Main navigation">
<main>
<article>
<button aria-label="Close menu" aria-expanded={isOpen}>

// ✅ Keyboard navigation
<button 
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
>

// ✅ Color contrast ≥4.5:1 for text
// ✅ Focus visible: focus:ring-2 focus:ring-primary
// ✅ Skip to content link for screen readers
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to content
</a>
```

## STATE (Valtio)
```tsx
import { proxy, useSnapshot } from 'valtio';

export const store = proxy({
  isMenuOpen: false,
  toggle() { this.isMenuOpen = !this.isMenuOpen; }
});

// In component
const snap = useSnapshot(store);
```

## HEROUI COMPONENT EXAMPLES

```tsx
import { Button, Card, Input, Navbar, Modal } from "@heroui/react";

// ✅ Navbar with HeroUI
<Navbar className="bg-white shadow-sm">
  <Navbar.Brand>Logo</Navbar.Brand>
  <Navbar.Content>
    <Navbar.Link href="/">Home</Navbar.Link>
    <Navbar.Link href="/about">About</Navbar.Link>
  </Navbar.Content>
</Navbar>

// ✅ Card with custom styling
<Card className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
  <Card.Header>
    <h3 className="text-2xl font-heading font-bold text-primary">Title</h3>
  </Card.Header>
  <Card.Body>
    <p className="text-base text-secondary leading-relaxed">Content here</p>
  </Card.Body>
  <Card.Footer>
    <Button className="bg-primary hover:bg-primary-hover">Action</Button>
  </Card.Footer>
</Card>

// ✅ Form with HeroUI Input
<form className="flex flex-col gap-4">
  <Input 
    label="Email"
    type="email"
    placeholder="Enter your email"
    className="w-full"
  />
  <Button type="submit" className="bg-primary">Submit</Button>
</form>
```

## NAMING CONVENTIONS

### Files & Folders
| Type | Convention | Example |
| ---- | ---------- | ------- |
| Route files | `kebab-case.tsx` | `login.tsx`, `user-profile.tsx` |
| Component files | `PascalCase.tsx` | `UserCard.tsx`, `LoginForm.tsx` |
| Utility files | `kebab-case.ts` | `format-date.ts`, `api-client.ts` |
| Store files | `kebab-case.ts` + `Store` | `auth-store.ts`, `user-store.ts` |
| Hook files | `camelCase.ts` + `use` prefix | `useAuth.ts`, `useDebounce.ts` |
| Type files | `kebab-case.ts` | `user-types.ts`, `api-types.ts` |
| Folders | `kebab-case` | `user-profile/`, `shared-components/` |

### Code Naming
| Type | Convention | Example |
| ---- | ---------- | ------- |
| Components | `PascalCase` | `UserProfile`, `LoginForm` |
| Props interface | `{Component}Props` | `UserProfileProps`, `LoginFormProps` |
| Variables | `camelCase` | `userName`, `fetchData` |
| Boolean vars | `is/has/should/can` prefix | `isLoading`, `hasPermission` |
| Functions | `camelCase` + verb | `getUserData`, `formatDate` |
| Event handlers | `handle{Event}` | `handleClick`, `handleSubmit` |
| Interfaces/Types | `PascalCase` | `User`, `AuthResponse`, `UserId` |
| Enums | `PascalCase` + `UPPER_SNAKE_CASE` values | `UserRole.ADMIN` |
| Constants | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_RETRY` |
| Config objects | `camelCase` | `apiConfig`, `routeConfig` |
| Custom hooks | `use{Name}` | `useAuth`, `useLocalStorage` |
| Stores (Valtio) | `camelCase` + `Store` | `authStore`, `userStore` |
| Store actions | `camelCase` verbs | `login`, `logout`, `updateUser` |
| API clients | `camelCase` + `Api` | `authApi`, `userApi` |
| API methods | HTTP verb prefix | `getUser`, `postLogin`, `deleteAccount` |
| Route loaders | `{route}Loader` | `userProfileLoader` |
| Route actions | `{route}Action` | `loginAction` |

### Examples
```typescript
// ✅ Component with Props
interface UserProfileProps {
  userId: string;
  onEdit?: () => void;
}

export function UserProfile({ userId, onEdit }: UserProfileProps) {
  const isLoading = false;
  const hasPermission = true;
  
  function handleEditClick() {
    onEdit?.();
  }
  
  return <div>...</div>;
}

// ✅ Store (auth-store.ts)
export const authStore = proxy({
  user: null as User | null,
  isAuthenticated: false,
  login(user: User) {
    this.user = user;
    this.isAuthenticated = true;
  },
  logout() {
    this.user = null;
    this.isAuthenticated = false;
  },
});

// ✅ API client (auth-api.ts)
export const authApi = {
  postLogin: (credentials: LoginCredentials) => 
    api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  deleteAccount: (id: string) => api.delete(`/auth/${id}`),
};

// ✅ Custom hook (useAuth.ts)
export function useAuth() {
  const { isAuthenticated, user } = useSnapshot(authStore);
  
  const handleLogin = async (credentials: LoginCredentials) => {
    const response = await authApi.postLogin(credentials);
    authStore.login(response.user);
  };
  
  return { isAuthenticated, user, handleLogin };
}

// ✅ Constants
const API_BASE_URL = 'https://api.example.com';
const MAX_LOGIN_ATTEMPTS = 3;

const apiConfig = {
  timeout: 5000,
  retries: 3,
};

// ✅ Enum
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}
```

## REMEMBER
1. **Setup First**: Configure `@theme` with Figma tokens before coding
2. **HeroUI First**: Always check if HeroUI has the component
3. **Custom Tokens**: Use `bg-primary`, `font-heading` (not hardcoded values)
4. **Match 100%**: Code must match Figma exactly
5. **No Assumptions**: All values from Figma only
6. **Mobile-First**: Responsive classes on everything
7. **TypeScript Strict**: NO `any` types allowed
8. **Naming**: Follow conventions table (kebab-case files, PascalCase components, camelCase variables)
9. **Micro-interactions**: Hover, focus, active states on ALL interactive elements
10. **Accessibility**: Semantic HTML, ARIA labels, keyboard nav, contrast ≥4.5:1

## QUALITY CHECKLIST (BEFORE DELIVERY)
- [ ] ✅ Pixel-perfect match with Figma (use color picker to verify)
- [ ] ✅ All interactive elements have hover/focus/active states
- [ ] ✅ Loading states for async operations
- [ ] ✅ Error states with retry functionality
- [ ] ✅ Empty states with helpful messages
- [ ] ✅ Images optimized (WebP, lazy, dimensions set)
- [ ] ✅ Responsive on mobile (320px), tablet (768px), desktop (1024px+)
- [ ] ✅ Keyboard navigation works (Tab, Enter, Escape)
- [ ] ✅ Screen reader friendly (ARIA labels, semantic HTML)
- [ ] ✅ Color contrast ≥4.5:1 for text
- [ ] ✅ TypeScript no errors/warnings
