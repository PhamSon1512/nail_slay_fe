import { http } from './http';
import { clearStoredToken, readStoredToken, writeStoredToken } from './tokenStorage';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  phone?: string | null;
  role: string;
};

export type AuthResponse = {
  access_token: string;
  token: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
    phone?: string | null;
    role: string | null;
  };
  exp: number;
};

function mapAuthUser(data: AuthResponse['user']): AuthUser {
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    phone: data.phone,
    role: data.role ?? 'user',
  };
}

export { readStoredToken } from './tokenStorage';

export function persistAuth(token: string, user: AuthUser) {
  writeStoredToken(token);
  localStorage.setItem('nailslay_user', JSON.stringify(user));
}

export function clearAuth() {
  clearStoredToken();
  localStorage.removeItem('nailslay_user');
}

export async function loginApi(input: {
  email: string;
  password: string;
  remember_me?: boolean;
}) {
  const { data } = await http.post<AuthResponse>('/auth/login', input);
  const user = mapAuthUser(data.user);
  persistAuth(data.token, user);
  return { token: data.token, user };
}

export async function registerApi(input: {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  remember_me?: boolean;
}) {
  const { data } = await http.post<AuthResponse>('/auth/register', input);
  const user = mapAuthUser(data.user);
  persistAuth(data.token, user);
  return { token: data.token, user };
}

export async function logoutApi() {
  try {
    await http.post('/auth/logout');
  } finally {
    clearAuth();
  }
}

function mapProfilePayload(data: Record<string, unknown>): AuthUser {
  const user = (data.user as Record<string, unknown> | undefined) ?? data;
  return {
    id: String(user.id),
    email: String(user.email),
    fullName: ((user.full_name ?? user.fullName) as string | null) ?? null,
    phone: (user.phone as string | null) ?? null,
    role: String(user.role ?? 'user'),
  };
}

function getHttpStatus(error: unknown): number | undefined {
  return (error as { response?: { status?: number } } | undefined)?.response?.status;
}

/** Refresh access token using httpOnly refresh cookie (Safari session restore). */
export async function refreshSessionApi() {
  const { data } = await http.get<AuthResponse>('/auth/token');
  const user = mapAuthUser(data.user);
  persistAuth(data.token, user);
  return { token: data.token, user };
}

export async function getProfileApi() {
  try {
    const { data } = await http.get<Record<string, unknown>>('/auth/me');
    return mapProfilePayload(data);
  } catch (error) {
    const status = getHttpStatus(error);
    if (status === 401 || status === 403) throw error;
    if (status === 404) {
      const { data } = await http.get<Record<string, unknown>>('/profile');
      return mapProfilePayload(data);
    }
    throw error;
  }
}

export async function updateProfileApi(input: {
  fullName?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}) {
  const { data } = await http.put<Record<string, unknown>>('/profile', input);
  return {
    id: String(data.id),
    email: String(data.email),
    fullName: (data.fullName as string | null) ?? null,
    phone: (data.phone as string | null) ?? null,
    role: String(data.role ?? 'user'),
  } satisfies AuthUser;
}

export async function changePasswordApi(input: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}) {
  await http.post('/profile/change-password', input);
}

export function getPostLoginPath(role: string) {
  if (role === 'admin' || role === 'superadmin') {
    return '/admin/dashboard';
  }
  return '/';
}

export function isAdminRole(role: string) {
  return role === 'admin' || role === 'superadmin';
}

export async function forgotPasswordApi(email: string) {
  const { data } = await http.post<{ success: boolean; message: string }>('/auth/forgot-password', {
    email,
  });
  return data;
}
