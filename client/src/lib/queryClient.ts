import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * If `u` is a relative path (doesn't start with http), rewrite it to the local FastAPI.
 * Example: "/predict"  -> "http://127.0.0.1:8000/predict"
 *          "predict"   -> "http://127.0.0.1:8000/predict"
 * Absolute URLs are returned unchanged.
 */
function ensureLocalBackend(u: string) {
  if (!u || typeof u !== "string") return u;
  const trimmed = u.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Use 127.0.0.1 to avoid hostname resolution quirks on some Windows setups
  return `http://127.0.0.1:8000/${trimmed.replace(/^\/+/, "")}`;
}

/**
 * Helper to parse JSON responses and attach a small flag indicating whether
 * the response came from the real pipeline model.
 */
async function parseJsonWithModelFlag(res: Response) {
  const json = await res.json().catch(() => null);
  if (json && typeof json === "object" && json !== null) {
    // prefer explicit source field if present
    (json as any)._usedRealModel = (json as any).source === "MODEL_PIPELINE";
  }
  return json;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const endpoint = ensureLocalBackend(url);

  const res = await fetch(endpoint, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const relative = queryKey.join("/") as string;
    const endpoint = ensureLocalBackend(relative);

    const res = await fetch(endpoint, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as unknown as T;
    }

    await throwIfResNotOk(res);

    // parse JSON and add _usedRealModel flag for callers
    const json = await parseJsonWithModelFlag(res);
    return json as unknown as T;
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
