import Cookies from 'js-cookie';

function normalizeToken(token: string): string {
  return token.replace(/^Bearer\s+/i, '').trim();
}

/** Read token from cookie/localStorage (handles jotai JSON storage). */
export function readStoredToken(): string | null {
  const fromCookie = Cookies.get('token');
  if (fromCookie) {
    const clean = normalizeToken(fromCookie);
    return clean || null;
  }

  const raw = localStorage.getItem('nailslay_token');
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'string' && parsed) return normalizeToken(parsed);
  } catch {
    // stored as plain JWT string
  }

  const clean = normalizeToken(raw);
  return clean || null;
}

export function writeStoredToken(token: string) {
  const clean = normalizeToken(token);
  Cookies.set('token', clean, { sameSite: 'Lax', path: '/' });
  localStorage.setItem('nailslay_token', JSON.stringify(clean));
}

export function clearStoredToken() {
  Cookies.remove('token', { path: '/' });
  localStorage.removeItem('nailslay_token');
}
