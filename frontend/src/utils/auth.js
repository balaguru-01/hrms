const getTokenPayload = (token) => {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 =
      base64 +
      "=".repeat((4 - (base64.length % 4)) % 4);

    return JSON.parse(atob(paddedBase64));
  } catch (error) {
    console.error("Unable to decode JWT:", error);
    return null;
  }
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  } catch (error) {
    console.error("Unable to read stored user:", error);
    return null;
  }
};

export const getUserRole = () => {
  const user = getStoredUser();

  if (!user?.role) {
    return null;
  }

  return String(user.role).trim().toLowerCase();
};

export const isTokenExpired = (token) => {
  const payload = getTokenPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return Date.now() >= Number(payload.exp) * 1000;
};

export const isAuthenticated = () => {
  const token = getAccessToken();

  if (
    !token ||
    typeof token !== "string" ||
    token.trim() === ""
  ) {
    return false;
  }

  return !isTokenExpired(token);
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

let expirationTimer = null;

export const startTokenExpirationTimer = (
  token,
  onExpire
) => {
  stopTokenExpirationTimer();

  const payload = getTokenPayload(token);

  if (!payload?.exp) {
    return;
  }

  const expiresAt = Number(payload.exp) * 1000;
  const remainingTime = expiresAt - Date.now();

  if (remainingTime <= 0) {
    onExpire?.();
    return;
  }

  expirationTimer = setTimeout(() => {
    expirationTimer = null;
    onExpire?.();
  }, remainingTime);
};

export const stopTokenExpirationTimer = () => {
  if (expirationTimer) {
    clearTimeout(expirationTimer);
    expirationTimer = null;
  }
};

export const clearLoginCredentials = (
  setEmail,
  setPassword
) => {
  if (typeof setEmail === "function") {
    setEmail("");
  }

  if (typeof setPassword === "function") {
    setPassword("");
  }
};