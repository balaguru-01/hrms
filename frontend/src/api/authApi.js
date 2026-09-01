import api from "./axios";

import { AUTH_ENDPOINTS } from "../endpoints/endpoints";

export const loginEnterprise = async (
  email,
  password
) => {
  const response = await api.post(
    AUTH_ENDPOINTS.ENTERPRISE_LOGIN,
    {
      email,
      password,
    },
    {
      skipAuth: true,
    }
  );

  return response.data;
};