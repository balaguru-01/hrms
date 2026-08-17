import axios from "axios";
import {
  getAccessToken,
  logout,
} from "../utils/auth";

const baseURL =
  process.env.REACT_APP_API_BASE_URL;

if (!baseURL) {
  console.error(
    "REACT_APP_API_BASE_URL is not configured in the .env file."
  );
}

console.log("API BASE URL:", baseURL);

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

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    console.log(
      "API Request:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );

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
    const status = error?.response?.status;
    const token = getAccessToken();

    console.error(
      "API Response Error:",
      status,
      error?.response?.data
    );

    if (status === 401 && token) {
      logout();
      window.location.replace("/");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;