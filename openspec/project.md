# Project Context

## Purpose
Modern React Router v7 application với Cloudflare Pages SSR deployment. Sử dụng HeroUI component library và Tailwind CSS v4 để build UI theo Figma designs.

## Tech Stack

### Core Framework
- **React 19** + **React Router v7** (file-based routing)
- **TypeScript 5.8+** (strict mode, NO `any` types)
- **Vite 7** (build tool)
- **Cloudflare Pages** (SSR deployment với Wrangler)

### UI & Styling
- **Tailwind CSS v4** (utility-first styling)
- **HeroUI v2.8+** (component library - Button, Card, Input, Modal, Navbar, etc.)
- **Framer Motion v12+** (animations, ONLY when specified in Figma)
- **React Icons v5** (icon library)

### State & Data
- **Valtio v2+** (state management - proxy-based)
- **xior v0.7+** (HTTP client - axios alternative)
- **React Hot Toast** (toast notifications)

### Utilities
- **@mantine/hooks** (utility hooks - useMediaQuery, useToggle, etc.)
- **embla-carousel-react** (carousel/slider implementation)
- **Ramda + Ramda Adjunct** (functional programming utilities)
- **clsx + tailwind-merge** (className utilities)

## Project Conventions

### Code Style
- **Prettier** config:
  - Print width: 132 characters
  - Single quotes, trailing commas
  - Import order: React → types → builtins → third-party → relative → icons → CSS
  - Tailwind function sorting: `cn`, `clsx`, `tv`, `classNames`

- **TypeScript**:
  - Strict mode enabled
  - NO `any` types - use `unknown` and narrow types
  - verbatimModuleSyntax, skipLibCheck enabled

- **File naming**: kebab-case cho files (`user-profile.tsx`, `auth-store.ts`)

### Naming Conventions

#### Files & Folders
- **Route files**: `kebab-case.tsx` - e.g., `user-profile.tsx`, `login.tsx`
- **Component files**: `PascalCase.tsx` - e.g., `UserCard.tsx`, `LoginForm.tsx`
- **Utility files**: `kebab-case.ts` - e.g., `format-date.ts`, `api-client.ts`
- **Store files**: `kebab-case.ts` with `Store` suffix - e.g., `auth-store.ts`, `user-store.ts`
- **Hook files**: `camelCase.ts` with `use` prefix - e.g., `useAuth.ts`, `useMediaQuery.ts`
- **Type files**: `kebab-case.ts` - e.g., `user-types.ts`, `api-types.ts`
- **Folders**: `kebab-case` - e.g., `user-profile/`, `auth/`, `shared-components/`

#### Components
- **Component names**: `PascalCase` - e.g., `UserProfile`, `LoginForm`, `CardHeader`
- **Component files**: Match component name - `UserProfile.tsx` exports `UserProfile`
- **Props interface**: `{ComponentName}Props` - e.g., `UserProfileProps`, `LoginFormProps`
```typescript
// ✅ Good
interface UserProfileProps {
  userId: string;
  onEdit?: () => void;
}

export function UserProfile({ userId, onEdit }: UserProfileProps) {
  // ...
}
```

#### Variables & Functions
- **Variables**: `camelCase` - e.g., `userName`, `isLoading`, `fetchData`
- **Boolean variables**: Prefix với `is`, `has`, `should`, `can` - e.g., `isAuthenticated`, `hasPermission`, `shouldRender`
- **Functions**: `camelCase` with verb prefix - e.g., `getUserData`, `handleClick`, `formatDate`
- **Event handlers**: `handle{Event}` prefix - e.g., `handleClick`, `handleSubmit`, `handleChange`
```typescript
// ✅ Good
const isLoading = false;
const hasPermission = true;

function handleLoginClick() { /* */ }
function getUserById(id: string) { /* */ }
```

#### Types & Interfaces
- **Interfaces**: `PascalCase` - e.g., `User`, `AuthResponse`, `ApiError`
- **Type aliases**: `PascalCase` - e.g., `UserId`, `AuthToken`, `RouteParams`
- **Enums**: `PascalCase` for name, `UPPER_SNAKE_CASE` for values
```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
}

type UserId = string;

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}
```

#### Constants
- **Global constants**: `UPPER_SNAKE_CASE` - e.g., `API_BASE_URL`, `MAX_RETRY_COUNT`
- **Config objects**: `camelCase` - e.g., `apiConfig`, `routeConfig`
```typescript
// ✅ Good
const API_BASE_URL = 'https://api.example.com';
const MAX_LOGIN_ATTEMPTS = 3;

const apiConfig = {
  timeout: 5000,
  retries: 3,
};
```

#### React Hooks
- **Custom hooks**: `use{Name}` prefix, `camelCase` - e.g., `useAuth`, `useLocalStorage`, `useDebounce`
- **Hook file names**: Match hook name - `useAuth.ts` exports `useAuth`
```typescript
// ✅ Good - app/hooks/useAuth.ts
export function useAuth() {
  const { isAuthenticated } = useSnapshot(authStore);
  return { isAuthenticated };
}
```

#### State Management (Valtio)
- **Store names**: `camelCase` with `Store` suffix - e.g., `authStore`, `userStore`, `cartStore`
- **Store files**: `kebab-case.ts` - e.g., `auth-store.ts`, `user-store.ts`
- **Store actions**: `camelCase` verbs - e.g., `login`, `logout`, `updateUser`
```typescript
// ✅ Good - app/lib/auth/auth-store.ts
export const authStore = proxy({
  user: null,
  isAuthenticated: false,
  login(user: User) { /* */ },
  logout() { /* */ },
});
```

#### API & Services
- **API clients**: `camelCase` with `Api` suffix - e.g., `authApi`, `userApi`, `productApi`
- **API files**: `kebab-case.ts` - e.g., `auth-api.ts`, `user-api.ts`
- **API methods**: HTTP verb prefix - e.g., `getUser`, `postLogin`, `updateProfile`, `deleteAccount`
```typescript
// ✅ Good - app/lib/auth/auth-api.ts
export const authApi = {
  postLogin: (credentials: LoginCredentials) => api.post('/auth/login', credentials),
  postRegister: (data: RegisterData) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};
```

#### Routes
- **Route files**: `kebab-case.tsx` matching URL - e.g., `login.tsx` → `/login`, `user-profile.tsx` → `/user-profile`
- **Route params**: `camelCase` - e.g., `userId`, `postId`, `categorySlug`
- **Loader functions**: `{route}Loader` - e.g., `userProfileLoader`, `postDetailLoader`
- **Action functions**: `{route}Action` - e.g., `loginAction`, `updateProfileAction`

#### CSS & Styling
- **Tailwind classes ONLY**: No custom CSS class names unless absolutely necessary
- **Custom utility classes**: `kebab-case` - e.g., `.container`, `.card-shadow`
- **Component variants**: Use `cn()` utility with descriptive variable names
```typescript
// ✅ Good
const buttonClasses = cn(
  'px-4 py-2 rounded-lg',
  isLoading && 'opacity-50 cursor-not-allowed',
  variant === 'primary' && 'bg-primary-500 text-white',
);
```

#### Test Files (if added)
- **Test files**: `{filename}.test.ts(x)` - e.g., `useAuth.test.ts`, `UserProfile.test.tsx`
- **Test suites**: `describe('{ComponentName}', ...)` - e.g., `describe('UserProfile', ...)`
- **Test cases**: `it('should {behavior}', ...)` - e.g., `it('should render user name', ...)`

### Architecture Patterns

#### Directory Structure
```
app/
├── routes/              # React Router file-based routes
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── lib/                 # Business logic, services, stores
├── app.css              # Tailwind config + global styles
└── root.tsx             # Root layout component
```

#### Component Patterns
- **HeroUI First**: Always use HeroUI components before building custom
- **NO Inline Styles**: Use Tailwind classes only (NO `style={{}}` prop)
- **NO Absolute Positioning**: Use flexbox/grid layouts (exception: modals with `fixed inset-0`)
- **Composition**: Small, focused components với clear props

#### State Management (Valtio)
```typescript
import { proxy, useSnapshot } from 'valtio';

// Store definition
export const authStore = proxy({
  user: null as User | null,
  isAuthenticated: false,
  login(user: User) { 
    this.user = user; 
    this.isAuthenticated = true; 
  },
});

// Usage in components
const { isAuthenticated } = useSnapshot(authStore);
```

#### HTTP Client (xior)
```typescript
import xior from 'xior';

const api = xior.create({
  baseURL: '/api',
  timeout: 5000,
});

export const authApi = {
  login: (credentials) => api.post('/login', credentials),
};
```

### Styling Conventions

#### Tailwind Theme (`app/app.css`)
```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --color-primary-500: #28a745;  /* Brand green */
  --color-primary-600: #21963b;  /* Hover state */
  /* ... full color scale 50-950 */
}
```

#### Design Tokens Usage
- Colors: Use `bg-primary-500`, `text-primary-600` (NOT hardcoded hex)
- Spacing: Consistent scale (4, 8, 12, 16, 24, 32, 48, 64px)
- Container: `mx-auto max-w-[1280px] px-6` hoặc utility class `container`

#### Interactive States (REQUIRED)
- Hover: `hover:bg-primary-600 hover:scale-105 hover:shadow-lg`
- Focus: `focus:ring-2 focus:ring-primary focus:ring-offset-2`
- Active: `active:scale-95`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`
- Transitions: `transition-all duration-200`

#### Responsive Design
- Mobile-first: Base styles for mobile, `md:` for tablet, `lg:` for desktop
- Breakpoints: 320px (mobile) → 768px (tablet) → 1024px+ (desktop)
- Test at: iPhone SE (320px), iPad (768px), Desktop (1280px)

### Testing Strategy
- **TypeScript**: `npm run typecheck` (wrangler types + react-router typegen + tsc)
- **Manual Testing**: Dev server (`npm run dev`) + test scenarios
- **Build Validation**: `npm run build` must succeed without errors
- **Deployment**: Preview with `wrangler versions upload` before production

### Git Workflow
- **Feature branches**: `feature/add-authentication`, `fix/login-validation`
- **Commits**: Clear, descriptive messages
- **PR Process**: Review spec proposal → Implement → Test → Deploy
- **NO direct commits to main**: Always use pull requests

## Figma-to-Code Workflow

### Critical Rules (from WARP.md)
1. **NO CODE WITHOUT FIGMA DATA**: Stop if Figma fetch fails
2. **NO ABSOLUTE POSITIONING**: Only flex/grid layouts
3. **NO INLINE STYLES**: Tailwind classes only
4. **HEROUI COMPONENTS FIRST**: Use library before custom build
5. **EXTRACT DESIGN TOKENS**: Add colors/fonts to `@theme` before coding

### Process
1. Fetch Figma data (node-id)
2. Extract tokens → Update `app/app.css` `@theme`
3. Plan layout với HeroUI components
4. Implement với Tailwind classes
5. Add micro-interactions (hover, focus, loading states)
6. Test responsive (mobile → tablet → desktop)
7. Verify accessibility (keyboard nav, ARIA, contrast ≥4.5:1)

## Domain Context
- **Deployment Target**: Cloudflare Pages (edge runtime)
- **SSR Enabled**: Server-side rendering for initial page loads
- **Static Assets**: Serve from `/public` directory
- **Environment**: Node.js >= 20.19.0 required

## Important Constraints

### Technical
- **TypeScript Strict Mode**: NO `any` types allowed
- **Cloudflare Workers Runtime**: Limited Node.js APIs (check compatibility)
- **Bundle Size**: Keep client bundle small (code splitting)
- **Performance**: Optimize images (WebP, lazy loading, dimensions set)

### Design System
- **HeroUI Components**: Must use where applicable (don't reinvent)
- **Tailwind Only**: No CSS modules, styled-components, or inline styles
- **Design Tokens**: All colors/fonts from `@theme` (NO hardcoded values)
- **Accessibility**: WCAG AA compliance (contrast ≥4.5:1, keyboard nav, ARIA)

### Development
- **No Guessing**: All design values must come from Figma or specs
- **Mobile-First**: Always design for smallest screen first
- **TypeScript Complete**: 100% type coverage, no implicit `any`

## External Dependencies

### Deployment
- **Cloudflare Pages**: Hosting + CDN + edge functions
- **Wrangler CLI**: Deployment tool (`npm run deploy`)

### Assets
- **Google Fonts**: Inter font family (loaded in app.css)
- **React Icons**: Icon library (lucide-react style preferred)

### Future Integrations (when needed)
- Authentication backend (currently mock API)
- Database (consider Cloudflare D1 or external)
- File storage (Cloudflare R2 or external CDN)

## Commands Reference

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run typecheck        # Run TypeScript checks

# Production
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run deploy           # Build + deploy to Cloudflare Pages

# Cloudflare
npx wrangler versions upload   # Deploy preview
npx wrangler versions deploy   # Promote to production
```

## Key Files

- `app/app.css` - Tailwind config + design tokens
- `app/root.tsx` - Root layout (providers, global nav)
- `app/routes/` - File-based routing
- `react-router.config.ts` - Router configuration
- `vite.config.ts` - Build configuration
- `prettier.config.cjs` - Code formatting rules
- `WARP.md` - Figma-to-code detailed rules
- `openspec/AGENTS.md` - OpenSpec workflow instructions
