import { query, createAsync } from "@solidjs/router";
import { API_BASE_URL } from "~/lib/api";

/**
 * 'query' replaces 'cache'. 
 * It marks this function as a data source that can be 
 * serialized from server to client.
 */
export const getUsers = query(async () => {
  "use server"; 
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      // In a real app, ensure you are passing through 
      // cookie headers if the API is on a different domain
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch (e) {
    console.error("Query Error:", e);
    return null;
  }
}, "user_session"); // The key used for revalidation