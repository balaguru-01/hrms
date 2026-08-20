import { jwtDecode } from "jwt-decode";

const processToken = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const payload = jwtDecode(token);

    if (!payload || typeof payload !== "object") {
      return null;
    }

    if (!payload.exp || !payload.role) {
      return null;
    }

    return {
      userId: payload.userId || "",
      role: String(payload.role).trim().toLowerCase(),
      firstName: payload.firstName || "",
      lastName: payload.lastName || "",
      email: payload.email || "",
      designation: payload.designation || "",
      tokenVersion: payload.tokenVersion,
      expiresAt: Number(payload.exp) * 1000,
    };
  } catch {
    return null;
  }
};

export default processToken;