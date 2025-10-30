// src/utils/errorHandler.ts
import { clearAuthToken } from "../base/token";

export interface APIResponse {
  status: "success" | "error";
  message?: string;
  data?: any;
}

/**
 * Generic Axios error handler
 * @param err - Axios or network error
 * @param defaultMsg - Fallback error message
 * @returns Formatted APIResponse
 */
export function handleApiError(err: any, defaultMsg: string): APIResponse {
  let errorMessage = defaultMsg;


  if (err.response?.status === 401) {
    console.warn("Unauthorized - clearing token and redirecting to login");

    clearAuthToken();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }

    return { status: "error", message: "Session expired. Please log in again." };
  }

  const msg = err.response?.data?.message;
  if (msg) {
    if (typeof msg === "string") {
      errorMessage = msg;
    } else if (typeof msg === "object") {
      errorMessage = Object.entries(msg)
        .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
        .join(" | ");
    }
  }
  if (!err.response) {
    errorMessage = "Network error or server not reachable.";
  }

  return { status: "error", message: errorMessage };
}
