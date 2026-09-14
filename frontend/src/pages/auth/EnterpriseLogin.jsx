import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";

import Logo from "../../components/common/Logo";
import BackButton from "../../components/common/BackButton";

import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";

import DynamicForm from "../../components/form/DynamicForm";

import {
  enterpriseLoginFields,
  enterpriseLoginDefaultValues,
} from "../../config/Authentication/EnterpriseLoginConfig";

import { enterpriseLoginSchema } from "../../schemas/auth/enterpriseLogin.schema";

import { loginEnterprise } from "../../api/authApi";
import { startTokenExpirationTimer } from "../../utils/auth";
import processToken from "../../utils/tokenProcessor";
import { useToast } from "../../context/ToastContext";

import {
  ROLES,
  SUPPORTED_ENTERPRISE_ROLES,
} from "../../utils/constants/roles";

import { ROUTES } from "../../utils/constants/routes";

import authBg from "../../assets/images/auth-bg.jpg";

const ROLE_DASHBOARD_ROUTES = {
  [ROLES.ENTERPRISE_ADMIN]:
    ROUTES.ENTERPRISE_DASHBOARD,

  [ROLES.SUPER_ADMIN]:
    ROUTES.SUPER_ADMIN_DASHBOARD,
};

const EnterpriseLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData) => {
    if (loading) {
      return;
    }

    const trimmedEmail = formData.email.trim();
    const password = formData.password;

    try {
      setLoading(true);

      const response = await loginEnterprise(
        trimmedEmail,
        password
      );

      if (!response?.success) {
        showToast({
          message:
            response?.message ||
            "Unable to sign in. Please try again.",
          type: "error",
        });

        return;
      }

      if (!response?.token) {
        showToast({
          message:
            "Login successful, but authentication token was not received.",
          type: "error",
        });

        return;
      }

      const user = processToken(response.token);

      if (!user) {
        showToast({
          message:
            "Authentication failed because the received token is invalid.",
          type: "error",
        });

        return;
      }

      if (Date.now() >= user.expiresAt) {
        showToast({
          message:
            "The authentication token has already expired.",
          type: "error",
        });

        return;
      }

      const dashboardRoute =
        ROLE_DASHBOARD_ROUTES[user.role];

      if (
        !dashboardRoute ||
        !SUPPORTED_ENTERPRISE_ROLES.includes(
          user.role
        )
      ) {
        showToast({
          message: `Your account role "${user.role}" is not configured in the frontend yet.`,
          type: "error",
        });

        return;
      }

      localStorage.setItem(
        "accessToken",
        response.token
      );

      startTokenExpirationTimer(
        response.token
      );

      showToast({
        message:
          response?.message ||
          "Welcome Back!",
        type: "success",
        title: "Login Successful",
        duration: 5000,
      });

      navigate(dashboardRoute, {
        replace: true,
      });
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error;

      const status =
        error?.response?.status;

      if (status === 400) {
        showToast({
          message:
            backendMessage ||
            "Invalid login request.",
          type: "error",
        });

        return;
      }

      if (status === 401) {
        showToast({
          message:
            backendMessage ||
            "Invalid email or password.",
          type: "error",
        });

        return;
      }

      if (status === 403) {
        showToast({
          message:
            backendMessage ||
            "You are not authorized to access this account.",
          type: "error",
        });

        return;
      }

      if (status === 404) {
        showToast({
          message:
            "Login service was not found. Please check the backend API configuration.",
          type: "error",
        });

        return;
      }

      if (
        error?.code ===
        "ECONNABORTED"
      ) {
        showToast({
          message:
            "The server took too long to respond. Please try again.",
          type: "error",
        });

        return;
      }

      if (
        error?.code === "ERR_NETWORK" ||
        error?.message === "Network Error"
      ) {
        showToast({
          message:
            "Unable to connect to the login server. Please make sure the backend is running.",
          type: "error",
        });

        return;
      }

      showToast({
        message:
          backendMessage ||
          "Unable to sign in. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidationError = (
    validationErrors
  ) => {
    const firstError =
      Object.values(
        validationErrors || {}
      )[0];

    if (firstError?.message) {
      showToast({
        message: firstError.message,
        type: "error",
      });
    }
  };

  const handleForgotPassword = () => {};

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${authBg})`,
      }}
    >
      <div className="absolute left-8 top-6 z-10">
        <Logo className="h-12 w-auto" />
      </div>

      <div className="flex h-screen items-center justify-center px-6">
        <AuthCard>
          <BackButton
            to={ROUTES.HOME}
            text="Back"
          />

          <AuthHeader
            icon={
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <MdLock className="text-3xl text-green-700" />
              </div>
            }
            title="Enterprise Login"
            subtitle="Sign in to your enterprise account"
          />

          <DynamicForm
            fields={enterpriseLoginFields}
            schema={enterpriseLoginSchema}
            defaultValues={
              enterpriseLoginDefaultValues
            }
            onSubmit={handleLogin}
            onValidationError={
              handleValidationError
            }
            loading={loading}
            submitText="LOGIN"
            loadingText="Signing In..."
            mode="onSubmit"
            forgotPassword
            forgotPasswordText="Forgot password?"
            onForgotPassword={
              handleForgotPassword
            }
          />

          <AuthFooter />
        </AuthCard>
      </div>
    </div>
  );
};

export default EnterpriseLogin;