import api from "./axios";
import { ENTERPRISE_ADMIN_ENDPOINTS } from "../endpoints/enterpriseAdminEndpoints";

export const loginEnterprise = async (
  email,
  password
) => {
  const response = await api.post(
    ENTERPRISE_ADMIN_ENDPOINTS.LOGIN,
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