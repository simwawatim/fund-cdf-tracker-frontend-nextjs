import { clearAuthToken } from "../base/token";

export interface APIResponse<T = any> {
  status: "success" | "error";
  data?: T;
  message?: string | Record<string, string[]>;
}

export function handleApiError(err: any, defaultMsg = "Something went wrong"): APIResponse {
  if (err.response) {
    const { status, data } = err.response;


    if (status === 401) {
      clearAuthToken();
      window.location.href = "/";
      return { status: "error", message: "Unauthorized — redirecting to login." };
    }

    const message =
      data?.message ||
      (status === 404
        ? "Not found."
        : status >= 500
        ? "Server error, please try again later."
        : defaultMsg);

    return { status: "error", message };
  } else if (err.request) {
    return { status: "error", message: "No response from server. Check your network connection." };
  }

  return { status: "error", message: defaultMsg };
}
