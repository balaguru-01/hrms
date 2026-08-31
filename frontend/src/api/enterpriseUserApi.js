import api from "./axios";

export const getAllowedRoles = async (scope) => {
  const response = await api.get(
    "/users/roles",
    {
      params: {
        scope,
      },
    }
  );

  return response.data;
};

export const sendUserInvitation = async ({
  email,
  roleId,
  invitedDesignation,
}) => {
  const response = await api.post(
    "/users/invite",
    {
      email,
      roleId,
      invitedDesignation,
    }
  );

  return response.data;
};

export const completeUserRegistration =
  async ({
    token,
    firstName,
    lastName,
    email,
    password,
    phone,
    location,
  }) => {
    const response = await api.post(
      "/users/register",
      {
        token,
        firstName,
        lastName,
        email,
        password,
        phone,
        location,
      }
    );

    return response.data;
  };