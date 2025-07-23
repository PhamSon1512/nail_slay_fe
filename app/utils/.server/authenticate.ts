import { redirect } from 'react-router';
import { getCookies, http0 } from '~/utils/.server';

export async function authenticate(request: Request) {
  const { token } = getCookies(request);

  if (!token) throw redirect('/login');
  http0.defaults.headers['Authorization'] = `Bearer ${token}`;

  return token;
}
