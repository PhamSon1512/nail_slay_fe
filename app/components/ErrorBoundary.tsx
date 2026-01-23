import { isRouteErrorResponse, useRouteError } from 'react-router';
import { useTranslate } from '~/hooks';

export function ErrorBoundary() {
  const error = useRouteError();
  const { __ } = useTranslate();
  let message = __('Oops!');
  let details = __('An unexpected error occurred.');
  let stack: string | undefined;

  // Safely extract status from RouteErrorResponse
  const status = isRouteErrorResponse(error) ? error.status : undefined;

  if (isRouteErrorResponse(error)) {
    // Try to parse API error from response body
    let apiError: { message?: string; code?: string; details?: unknown } | null = null;
    try {
      if (typeof error.data === 'string') {
        apiError = JSON.parse(error.data);
      } else if (typeof error.data === 'object') {
        apiError = error.data;
      }
    } catch {
      // Ignore parse errors
    }

    switch (error.status) {
      case 400:
        message = __('Bad Request');
        details = apiError?.message || __('The request could not be processed due to invalid data.');
        break;
      case 401:
        message = __('Unauthorized');
        details = apiError?.message || __('Please log in to access this resource.');
        break;
      case 403:
        message = __('Forbidden');
        details = apiError?.message || __('You do not have permission to access this resource.');
        break;
      case 404:
        message = '404';
        details = apiError?.message || __('The requested page could not be found.');
        break;
      case 406:
        message = __('Not Acceptable');
        details = apiError?.message || __('The requested format is not supported.');
        break;
      default:
        message = __('Error');
        details = apiError?.message || error.statusText || details;
    }

    // In development, also show error code if available
    if (import.meta.env.DEV && apiError?.code) {
      details = `[${apiError.code}] ${details}`;
    }
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="space-y-2 text-center">
        {status === 404 ? (
          <img src="/Error404.svg" className="-mb-12 inline h-64" alt="404" />
        ) : (
          <img src="/t-rex.svg" className="mb-2 ml-4 inline" alt="err" />
        )}
        {status !== 404 && <h1>{message}</h1>}
        <h4>{details}</h4>
        {stack && (
          <pre className="w-full overflow-x-auto p-4">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
