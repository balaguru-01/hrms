import api from "./axios";

import { USER_ENDPOINTS } from "../endpoints/endpoints";

export const getAllowedRoles = async (
  scope
) => {
  const response = await api.get(
    USER_ENDPOINTS.ROLES,
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
    USER_ENDPOINTS.INVITE,
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
      USER_ENDPOINTS.REGISTER,
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

export const getUsers = async ({
  scope,
  status,
  page = 1,
  limit = 10,
}) => {
  const response = await api.get(
    USER_ENDPOINTS.USERS,
    {
      params: {
        scope,
        page,
        limit,
        ...(status && { status }),
      },
    }
  );

  return response.data;
};

export const getSentInvitations = async ({
  page = 1,
  limit = 10,
} = {}) => {
  const response = await api.get(
    USER_ENDPOINTS.INVITATIONS,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
};