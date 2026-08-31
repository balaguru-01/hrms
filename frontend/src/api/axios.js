import axios from "axios";

import {
  getAccessToken,
  logout,
} from "../utils/auth";

const baseURL =
  process.env.REACT_APP_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    "REACT_APP_API_BASE_URL is not configured in the .env file."
  );
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token && !config.skipAuth) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status =
      error?.response?.status;

    const token = getAccessToken();
    const skipAuth =
      error?.config?.skipAuth;

    if (
      status === 401 &&
      token &&
      !skipAuth
    ) {
      logout();
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default api;