import { vi } from "vitest";

type MockRoute = {
  method?: string;
  matcher: string | RegExp | ((request: Request) => boolean);
  status?: number;
  body?: unknown;
};

function matchesRoute(route: MockRoute, request: Request) {
  const method = route.method ?? "GET";
  if (request.method !== method) {
    return false;
  }

  if (typeof route.matcher === "string") {
    return request.url.includes(route.matcher);
  }

  if (route.matcher instanceof RegExp) {
    return route.matcher.test(request.url);
  }

  return route.matcher(request);
}

export function mockFetch(routes: MockRoute[]) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const request = input instanceof Request ? input : new Request(input);
    const route = routes.find((candidate) => matchesRoute(candidate, request));

    if (!route) {
      return new Response(JSON.stringify({ detail: `Unhandled request: ${request.method} ${request.url}` }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(route.body ?? {}), {
      status: route.status ?? 200,
      headers: { "Content-Type": "application/json" }
    });
  });
}
