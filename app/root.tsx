import type { ReactNode } from 'react';
import type { Route } from './+types/root';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { HeroUIProvider } from '@heroui/react';
import { Toaster } from 'react-hot-toast';
import { AuthBootstrap } from '~/components/AuthBootstrap';
import './app.css';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Dancing+Script:wght@500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@500;600;700;800&display=swap',
  },
  {
    rel: 'icon',
    href: '/branding/logo-nailslay.png',
    type: 'image/png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    href: '/branding/logo-nailslay.png',
    type: 'image/png',
    media: '(prefers-color-scheme: dark)',
  },
  { rel: 'apple-touch-icon', href: '/branding/logo-nailslay.png' },
];

export default function App() {
  return (
    <>
      <AuthBootstrap />
      <Outlet />
    </>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        
        {/* Google Analytics Tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G4FV9FEV9P"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-G4FV9FEV9P');
            `,
          }}
        />
      </head>
      <body>
        <HeroUIProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'var(--font-sans)' },
            }}
          />
        </HeroUIProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
