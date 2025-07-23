import { createCookieSessionStorage } from 'react-router';

export const AUTH_SESSION_KEY = '_auth';
export const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: AUTH_SESSION_KEY,
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secrets: ['NOT_A_STRONG_SECRET'],
    secure: import.meta.env.NODE_ENV === 'production',
  },
});

export const { getSession, commitSession, destroySession } = authSessionStorage;
