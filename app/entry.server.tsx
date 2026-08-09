import type { EntryContext } from 'react-router';
import { renderToReadableStream } from 'react-dom/server';
import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  context: EntryContext,
) {
  try {
    const body = await renderToReadableStream(<ServerRouter context={context} url={request.url} />, {
      signal: request.signal,
      onError(error: unknown) {
        // Log streaming rendering errors from inside the shell
        console.error('SSR error:', error);
        responseStatusCode = 500;
      },
    });

    if (isbot(request.headers.get('user-agent') || '')) {
      await body.allReady;
    }

    responseHeaders.set('Content-Type', 'text/html');
    return new Response(body, {
      headers: responseHeaders,
      status: responseStatusCode,
    });
  } catch (err) {
    console.error('Critical SSR Exception in handleRequest:', err);

    // Trả về HTML dự phòng tối thiểu để trình duyệt tự động render ở Client (CSR)
    const fallbackHtml = `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Nailslay</title>
  </head>
  <body>
    <div id="root"></div>
    <script>
      // Thử tải lại trang để chuyển sang Client-side rendering
      if (!sessionStorage.getItem('ssr_retry')) {
        sessionStorage.setItem('ssr_retry', '1');
        window.location.reload();
      } else {
        sessionStorage.removeItem('ssr_retry');
      }
    </script>
  </body>
</html>`;

    return new Response(fallbackHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
}
