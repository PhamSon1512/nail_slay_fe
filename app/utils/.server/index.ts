import cookie from 'cookie';
import queryString from 'query-string';

export { authenticate } from './authenticate';
export { http0 } from './http0';
// export { csrf } from './csrf';
// export { honeypot } from './honeypot';
export { getSession, commitSession, destroySession } from './session';

export const getLoaderQuery = (query: string[], url: string) => {
  const final = [];
  for (const item of query) {
    final.push(new URL(url).searchParams.get(item));
  }
  return final;
};

export function getQuery(url: string) {
  const search = new URL(url).search;

  return queryString.parse(search);
}

export function getCookies(request: Request) {
  return cookie.parse(request.headers.get('Cookie') || '');
}
