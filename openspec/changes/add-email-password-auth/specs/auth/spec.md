# Authentication Specification Deltas

## ADDED Requirements

### Requirement: User Registration
The system SHALL allow users to register với email và password.

#### Scenario: Successful registration
- **WHEN** user submits valid email (format hợp lệ, chưa tồn tại) và password (≥8 ký tự)
- **THEN** system tạo user account, trả về JWT token, tự động login user, redirect về trang chủ `/`

#### Scenario: Duplicate email
- **WHEN** user submits email đã tồn tại
- **THEN** system hiển thị lỗi "Email already exists", không tạo account

#### Scenario: Invalid input
- **WHEN** user submits email không hợp lệ hoặc password <8 ký tự
- **THEN** system hiển thị validation errors, không submit form

#### Scenario: Password mismatch
- **WHEN** user's password và confirm password không khớp
- **THEN** system hiển thị lỗi "Passwords do not match"

---

### Requirement: User Login
The system SHALL authenticate users với email và password.

#### Scenario: Successful login
- **WHEN** user submits credentials chính xác (email + password đúng)
- **THEN** system trả về JWT token, lưu vào localStorage, redirect về `/`

#### Scenario: Invalid credentials
- **WHEN** user submits email hoặc password sai
- **THEN** system hiển thị lỗi "Invalid email or password", không grant access

#### Scenario: Network error
- **WHEN** API call fails (network timeout, server error)
- **THEN** system hiển thị error message với retry option

---

### Requirement: Protected Routes
The system SHALL restrict access to routes cho authenticated users only.

#### Scenario: Access protected route when authenticated
- **WHEN** authenticated user navigates to any route (trừ `/login`, `/register`)
- **THEN** system renders requested page normally

#### Scenario: Access protected route when unauthenticated
- **WHEN** unauthenticated user tries to access protected route
- **THEN** system redirects to `/login` với return URL parameter

#### Scenario: Access login page when authenticated
- **WHEN** authenticated user navigates to `/login` hoặc `/register`
- **THEN** system redirects về trang chủ `/`

---

### Requirement: Token Persistence
The system SHALL persist authentication state across browser sessions.

#### Scenario: App reload with valid token
- **WHEN** app loads và localStorage chứa valid JWT token
- **THEN** system restores user session, không yêu cầu login lại

#### Scenario: App reload without token
- **WHEN** app loads và localStorage không có token
- **THEN** system treats user as unauthenticated

#### Scenario: Token expiry (future enhancement)
- **WHEN** token expires (nếu có expiry logic)
- **THEN** system logs out user, redirects to `/login`

---

### Requirement: User Logout
The system SHALL allow users to logout và clear session.

#### Scenario: Successful logout
- **WHEN** authenticated user clicks logout button
- **THEN** system clears token from localStorage, resets auth store, redirects to `/login`

---

### Requirement: UI States
The system SHALL provide clear visual feedback cho user actions.

#### Scenario: Loading state during auth operations
- **WHEN** user submits login/register form
- **THEN** submit button shows loading indicator, form inputs disabled

#### Scenario: Error display
- **WHEN** authentication fails (invalid credentials, network error, validation)
- **THEN** system displays error message near form với clear text

#### Scenario: Interactive states
- **WHEN** user interacts với form elements
- **THEN** inputs show focus ring (ring-2), buttons show hover effects (scale, shadow)

---

### Requirement: Form Validation
The system SHALL validate user input before submission.

#### Scenario: Email format validation
- **WHEN** user enters email không đúng format (missing @, invalid domain)
- **THEN** system shows inline error "Invalid email format"

#### Scenario: Password length validation
- **WHEN** user enters password <8 characters
- **THEN** system shows error "Password must be at least 8 characters"

#### Scenario: Real-time validation
- **WHEN** user types in form fields
- **THEN** validation errors appear/disappear immediately (debounced)

---

### Requirement: Mock API
The system SHALL simulate backend API với realistic delays.

#### Scenario: Login API simulation
- **WHEN** login is called với `test@example.com` / `password123`
- **THEN** mock returns `{ token: "mock-jwt-token", user: {...} }` after 500ms delay

#### Scenario: Register API simulation
- **WHEN** register is called với new email
- **THEN** mock checks "database" (in-memory), returns success/error after 500ms

#### Scenario: Network error simulation
- **WHEN** mock API is configured to fail (for testing)
- **THEN** throws error after delay to simulate network timeout
