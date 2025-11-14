export interface DecodedToken {

  role: string;
  user_id: number;
  profile_id: number;
  isPasswordUpdateOnFirstLogin: boolean; 
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

export function getCurrentUserIdSafe(): number | null {
  const token = getTokenFromLocalStorage();
  if (!token) return null;

  const decoded = decodedToken(token);
  if (!decoded) return null;

  return decoded.user_id; 
}
export function getIsPasswordUpdatedOnFirstLogin(): boolean | null {
  console.log("Checking password update status on first login...");

  const token = getTokenFromLocalStorage();
  console.log("Retrieved token:", token);

  if (!token) {
    console.warn("No token found in localStorage.");
    return null;
  }

  const decoded = decodedToken(token);
  console.log("Decoded token:", decoded);

  if (!decoded) {
    console.error("Failed to decode token.");
    return null;
  }

  console.log("isPasswordUpdateOnFirstLogin:", decoded.isPasswordUpdateOnFirstLogin);

  return decoded.isPasswordUpdateOnFirstLogin;
}

