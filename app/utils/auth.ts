import Cookies from 'js-cookie';
import { http } from './http';

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

export function persistAuth(token: string, user: AuthUser) {
  Cookies.set('token', token, { sameSite: 'Lax', path: '/' });
  localStorage.setItem('nailslay_token', token);
  localStorage.setItem(
    'nailslay_user',
    JSON.stringify(user),
  );
}

export function clearAuth() {
  Cookies.remove('token', { path: '/' });
  localStorage.removeItem('nailslay_token');
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

export async function getProfileApi() {
  const { data } = await http.get<Record<string, unknown>>('/profile');
  return {
    id: String(data.id),
    email: String(data.email),
    fullName: (data.fullName as string | null) ?? null,
    phone: (data.phone as string | null) ?? null,
    role: String(data.role ?? 'user'),
  } satisfies AuthUser;
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
