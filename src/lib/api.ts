// src/lib/api.ts

export const API_BASE_URL = "http://localhost:5000/api";

/**
 * 1. Standard API Fetcher
 * Use this for all GET, POST, DELETE requests.
 * It handles credentials (cookies) and JSON parsing automatically.
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Ensure endpoint starts with a slash
  const url = endpoint.startsWith("http") 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include", // Required for session cookies
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    // Handle 204 No Content (often used in logout or deletes)
    if (response.status === 204) {
      return {} as T;
    }

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

    return response.json() as Promise<T>;
  } catch (err: any) {
    if (err.message === "Failed to fetch") {
      throw new Error("Cannot connect to server. Is the Hono backend running?");
    }
    throw err;
  }
}

/**
 * 2. Convenience methods for common actions
 */
export const api = {
  get: <T>(url: string) => apiFetch<T>(url, { method: "GET" }),
  post: <T>(url: string, data: any) => apiFetch<T>(url, { 
    method: "POST", 
    body: JSON.stringify(data) 
  }),
  put: <T>(url: string, data: any) => apiFetch<T>(url, { 
    method: "PUT", 
    body: JSON.stringify(data) 
  }),
  delete: <T>(url: string) => apiFetch<T>(url, { method: "DELETE" }),
};