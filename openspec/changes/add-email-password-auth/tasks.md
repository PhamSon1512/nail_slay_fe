# Implementation Tasks

## 1. Auth Infrastructure
- [ ] 1.1 Create auth store với Valtio (`app/lib/auth/store.ts`)
- [ ] 1.2 Create mock API service (`app/lib/auth/api.ts`) - xior với delay 500ms
- [ ] 1.3 Create useAuth hook (`app/hooks/useAuth.ts`) - login, register, logout, check isAuthenticated
- [ ] 1.4 Setup auth types (`app/lib/auth/types.ts`) - User, AuthResponse, LoginCredentials, RegisterCredentials

## 2. Protected Routes
- [ ] 2.1 Create ProtectedRoute component hoặc loader function
- [ ] 2.2 Wrap existing routes với protection logic
- [ ] 2.3 Redirect logic: unauthenticated → `/login`, authenticated + at `/login` → `/`

## 3. Login Page
- [ ] 3.1 Create `/login` route (`app/routes/login.tsx`)
- [ ] 3.2 Centered layout với HeroUI Card
- [ ] 3.3 Form: Email input, Password input, Submit button, Link to register
- [ ] 3.4 Form validation (email format, password min length)
- [ ] 3.5 Loading state khi submit
- [ ] 3.6 Error display (invalid credentials, network errors)
- [ ] 3.7 Success: save token, redirect to `/`

## 4. Register Page
- [ ] 4.1 Create `/register` route (`app/routes/register.tsx`)
- [ ] 4.2 Form: Email, Password, Confirm Password
- [ ] 4.3 Validation: email unique check (mock), passwords match, password strength
- [ ] 4.4 Loading & error states tương tự login
- [ ] 4.5 Success: auto login + redirect `/`

## 5. Logout & Token Management
- [ ] 5.1 Add logout button trong navbar/header
- [ ] 5.2 Implement logout: clear localStorage, reset store, redirect `/login`
- [ ] 5.3 Token persistence: check localStorage on app load
- [ ] 5.4 Token expiry handling (optional: refresh logic)

## 6. UI Polish
- [ ] 6.1 Hover states trên buttons
- [ ] 6.2 Focus states cho inputs (ring-2)
- [ ] 6.3 Disabled states khi loading
- [ ] 6.4 Smooth transitions (duration-200)
- [ ] 6.5 Responsive: mobile (320px+), tablet, desktop

## 7. Testing & Validation
- [ ] 7.1 Test login flow: success, wrong password, network error
- [ ] 7.2 Test register flow: success, duplicate email, validation errors
- [ ] 7.3 Test protected routes redirect
- [ ] 7.4 Test logout clears state
- [ ] 7.5 Test token persistence (reload page)
- [ ] 7.6 TypeScript: no errors
- [ ] 7.7 Accessibility: keyboard nav, ARIA labels
