export interface DecodedToken {
  user_id: number;
  role: string;
  profile_id: number;
}

export function getTokenFromLocalStorage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function decodedToken(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload) as DecodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function getCurrentUserId(): number | null {
  const token = getTokenFromLocalStorage();
  if (!token) return null;
  const decoded = decodedToken(token);
  return decoded ? decoded.user_id : null;
}

export function getAuthHeader(): { Authorization: string } | {} {
  const token = getTokenFromLocalStorage();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export const clearAuthToken = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export function getCurrentProfileId(): number | null {
  const token = getTokenFromLocalStorage();
  if (!token) return null;
  const decoded = decodedToken(token);
  return decoded ? decoded.profile_id : null;
}

