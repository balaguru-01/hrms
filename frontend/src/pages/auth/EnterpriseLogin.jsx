import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";

import Logo from "../../components/common/Logo";
import Toast from "../../components/common/Toast";

import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthFooter from "../../components/auth/AuthFooter";
import BackButton from "../../components/auth/BackButton";

import DynamicForm from "../../components/form/DynamicForm";

import {
  enterpriseLoginFields,
  enterpriseLoginDefaultValues,
} from "../../config/forms/enterpriseLogin.config";

import {
  enterpriseLoginSchema,
} from "../../schemas/auth/enterpriseLogin.schema";

import { loginEnterprise } from "../../api/authApi";
import { startTokenExpirationTimer } from "../../utils/auth";

import authBg from "../../assets/images/auth-bg.jpg";

const getTokenPayload = (token) => {
  try {
    if (
      !token ||
      typeof token !== "string"
    ) {
      return null;
    }

    const tokenParts = token.split(".");

    if (tokenParts.length !== 3) {
      return null;
    }

    const base64 = tokenParts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4
      );

    return JSON.parse(atob(paddedBase64));
  } catch (error) {
    console.error(
      "Unable to decode authentication token:",
      error
    );

    return null;
  }
};

const EnterpriseLogin = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleLogin = async (formData) => {
    if (loading) {
      return;
    }

    setError("");

    const trimmedEmail =
      formData.email.trim();

    const password =
      formData.password;

    try {
      setLoading(true);

      const response =
        await loginEnterprise(
          trimmedEmail,
          password
        );

      if (!response?.success) {
        setError(
          response?.message ||
            "Unable to sign in. Please try again."
        );

        return;
      }

      if (!response?.token) {
        setError(
          "Login successful, but authentication token was not received."
        );

        return;
      }

      const tokenPayload =
        getTokenPayload(response.token);

      if (!tokenPayload) {
        setError(
          "Authentication failed because the received token is invalid."
        );

        return;
      }

      if (
        !tokenPayload.exp ||
        Date.now() >=
          Number(tokenPayload.exp) * 1000
      ) {
        setError(
          "The authentication token has already expired."
        );

        return;
      }

      if (!tokenPayload.role) {
        setError(
          "Login failed because your account role was not received."
        );

        return;
      }

      const normalizedRole =
        String(tokenPayload.role)
          .trim()
          .toLowerCase();

      const supportedRoles = [
        "enterpriseadmin",
        "superadmin",
      ];

      if (
        !supportedRoles.includes(
          normalizedRole
        )
      ) {
        setError(
          `Your account role "${tokenPayload.role}" is not configured in the frontend yet.`
        );

        return;
      }

      localStorage.setItem(
        "accessToken",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId:
            tokenPayload.userId,
          role:
            tokenPayload.role,
          firstName:
            tokenPayload.firstName,
          lastName:
            tokenPayload.lastName,
          email:
            tokenPayload.email,
          designation:
            tokenPayload.designation,
          tokenVersion:
            tokenPayload.tokenVersion,
        })
      );

      /*
       * Start the token timer immediately.
       *
       * ProtectedRoute will start its own
       * timer when the dashboard mounts.
       */
      startTokenExpirationTimer(
        response.token
      );

      if (
        normalizedRole ===
        "enterpriseadmin"
      ) {
        navigate(
          "/enterprise/dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      if (
        normalizedRole ===
        "superadmin"
      ) {
        navigate(
          "/superadmin/dashboard",
          {
            replace: true,
          }
        );
      }
    } catch (error) {
      console.error(
        "========== LOGIN ERROR =========="
      );

      console.error(
        "Full error:",
        error
      );

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error;

      if (
        error?.response?.status === 400
      ) {
        setError(
          backendMessage ||
            "Invalid login request."
        );

        return;
      }

      if (
        error?.response?.status === 401
      ) {
        setError(
          backendMessage ||
            "Invalid email or password."
        );

        return;
      }

      if (
        error?.response?.status === 403
      ) {
        setError(
          backendMessage ||
            "You are not authorized to access this account."
        );

        return;
      }

      if (
        error?.response?.status === 404
      ) {
        setError(
          "Login service was not found. Please check the backend API configuration."
        );

        return;
      }

      if (
        error?.code === "ECONNABORTED"
      ) {
        setError(
          "The server took too long to respond. Please try again."
        );

        return;
      }

      if (
        error?.code === "ERR_NETWORK" ||
        error?.message === "Network Error"
      ) {
        setError(
          "Unable to connect to the login server. Please make sure the backend is running."
        );

        return;
      }

      setError(
        backendMessage ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Validation errors are intentionally shown
   * through the reusable Toast component.
   *
   * Nothing is displayed underneath the fields.
   */
  const handleValidationError = (
    validationErrors
  ) => {
    const firstError =
      Object.values(
        validationErrors || {}
      )[0];

    if (firstError?.message) {
      setError(firstError.message);
    }
  };

  const handleForgotPassword = () => {
    console.log(
      "Forgot password flow will be integrated later."
    );
  };

  return (
    <div
      className="h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${authBg})`,
      }}
    >
      <Toast
        message={error}
        onClose={() => setError("")}
      />

      <div className="absolute left-8 top-6 z-10">
        <Logo className="h-12 w-auto" />
      </div>

      <div className="flex h-screen items-center justify-center px-6">
        <AuthCard>
          <BackButton
            to="/"
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
            submitText="Sign In"
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