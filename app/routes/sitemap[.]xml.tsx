import type { Route } from './+types/sitemap[.]xml';
import { http } from '~/utils/http';

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { data } = await http.get('/sitemap.xml', {
      responseType: 'text',
      headers: {
        Accept: 'application/xml',
      },
    });

    return new Response(data as string, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Failed to fetch sitemap from backend', error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}
