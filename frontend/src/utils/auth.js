import processToken from "./tokenProcessor";

import {
  SESSION_EXPIRY_WARNING_TIME,
} from "./constants/session";

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const getStoredUser = () => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  return processToken(token);
};

export const getUserRole = () => {
  const user = getStoredUser();

  return user?.role || null;
};

export const isTokenExpired = (token) => {
  const user = processToken(token);

  if (!user?.expiresAt) {
    return true;
  }

  return Date.now() >= user.expiresAt;
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
};

let expirationTimer = null;
let expirationWarningTimer = null;

export const startTokenExpirationWarningTimer = (
  token,
  onWarning
) => {
  stopTokenExpirationWarningTimer();

  const user = processToken(token);

  if (!user?.expiresAt) {
    return;
  }

  const remainingTime =
    user.expiresAt - Date.now();

  if (remainingTime <= 0) {
    return;
  }

  const warningDelay =
    remainingTime -
    SESSION_EXPIRY_WARNING_TIME;

  if (warningDelay <= 0) {
    onWarning?.();
    return;
  }

  expirationWarningTimer = setTimeout(() => {
    expirationWarningTimer = null;
    onWarning?.();
  }, warningDelay);
};

export const stopTokenExpirationWarningTimer = () => {
  if (expirationWarningTimer) {
    clearTimeout(expirationWarningTimer);
    expirationWarningTimer = null;
  }
};

export const startTokenExpirationTimer = (
  token,
  onExpire
) => {
  stopTokenExpirationTimer();

  const user = processToken(token);

  if (!user?.expiresAt) {
    return;
  }

  const remainingTime =
    user.expiresAt - Date.now();

  if (remainingTime <= 0) {
    stopTokenExpirationWarningTimer();
    onExpire?.();
    return;
  }

  expirationTimer = setTimeout(() => {
    expirationTimer = null;
    stopTokenExpirationWarningTimer();
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