# Proposal: Add Email/Password Authentication

## Why
Ứng dụng hiện tại chưa có hệ thống xác thực người dùng. Cần authentication để protect routes và quản lý user sessions.

## What Changes
- Thêm trang `/login` và `/register` với centered form layout (HeroUI components)
- Implement mock API endpoints cho login/register (xior + delay simulation)
- Protected routes: tất cả routes trừ `/login`, `/register`
- Token storage trong localStorage
- Auto redirect: login thành công → `/`, access protected route khi chưa login → `/login`
- Loading states, error handling, form validation
- Logout functionality với clear token

**BREAKING**: Routes hiện tại sẽ yêu cầu authentication, users chưa login bị redirect về `/login`

## Impact
- **Affected specs**: `auth` (new capability)
- **Affected code**: 
  - `app/routes/` - Thêm login.tsx, register.tsx
  - `app/root.tsx` hoặc route middleware - Protected route logic
  - `app/lib/` - Auth service, mock API
  - `app/hooks/` - useAuth hook
- **State management**: Valtio store cho auth state
- **UI Components**: HeroUI Input, Button, Card
