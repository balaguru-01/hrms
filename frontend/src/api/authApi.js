import api from "./axios";

export const loginEnterprise = async (
  email,
  password
) => {
  const response = await api.post(
    "/tenanthub/login",
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