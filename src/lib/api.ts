// src/lib/api.ts
import { hc } from "hono/client";
import type { AppType } from "../../../server/src/routes";

export const API_BASE_URL = "http://localhost:5000/api";

/**
 * 1. RPC Client Refactor
 * We inject a custom fetch into the Hono Client to ensure 
 * it always includes credentials (cookies).
 */
export const api = hc<AppType>(API_BASE_URL, {
  fetch: (url: string | Request | URL, options: RequestInit | undefined) => {
    return fetch(url, {
      ...options,
      credentials: "include", // THIS IS THE KEY FIX
    });
  },
});

/**
 * 2. Manual Fetch Refactor
 * Added credentials: "include" to ensure cookies flow here too.
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include", // THIS IS THE KEY FIX
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      } else {
        const textError = await response.text();
        throw new Error(`Server Error (${response.status}): ${textError.slice(0, 50)}`);
      }
    }

    return response.json();
  } catch (err: any) {
    if (err.message === "Failed to fetch") {
      throw new Error("Cannot connect to server. Is Hono running on the right port?");
    }
    throw err;
  }
}