import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  getAccessToken,
  getUserRole,
  logout,
  startTokenExpirationTimer,
  startTokenExpirationWarningTimer,
  stopTokenExpirationTimer,
  stopTokenExpirationWarningTimer,
} from "../utils/auth";

import {
  SESSION_EXPIRY_WARNING_MESSAGE,
  SESSION_TOAST_DURATION,
} from "../utils/constants/session";

import { ROUTES } from "../utils/constants/routes";

import Unauthorized from "../pages/errors/Unauthorized";
import SessionExpiredModal from "../components/auth/SessionExpiredModal";
import { useToast } from "../context/ToastContext";

const ProtectedRoute = ({
  allowedRoles = [],
}) => {
  const location = useLocation();
  const { showToast } = useToast();

  const [sessionExpired, setSessionExpired] =
    useState(false);

  const [extendingSession, setExtendingSession] =
    useState(false);

  const token = getAccessToken();
  const role = getUserRole();

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    startTokenExpirationWarningTimer(
      token,
      () => {
        showToast({
          message:
            SESSION_EXPIRY_WARNING_MESSAGE,
          type: "warning",
          title: "Session Expiring",
          duration:
            SESSION_TOAST_DURATION,
        });
      }
    );

    startTokenExpirationTimer(
      token,
      () => {
        setSessionExpired(true);
      }
    );

    return () => {
      stopTokenExpirationWarningTimer();
      stopTokenExpirationTimer();
    };
  }, [token, showToast]);

  const handleLeaveSession = () => {
    stopTokenExpirationWarningTimer();
    stopTokenExpirationTimer();

    logout();
    setSessionExpired(false);

    window.location.replace(
      ROUTES.HOME
    );
  };

  const handleExtendSession = async () => {
    setExtendingSession(true);
    setExtendingSession(false);
  };

  if (!token) {
    return (
      <Navigate
        to={ROUTES.HOME}
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0
  ) {
    const normalizedAllowedRoles =
      allowedRoles.map((allowedRole) =>
        String(allowedRole)
          .trim()
          .toLowerCase()
      );

    if (
      !normalizedAllowedRoles.includes(
        role
      )
    ) {
      return <Unauthorized />;
    }
  }

  return (
    <>
      <Outlet />

      {sessionExpired && (
        <SessionExpiredModal
          onExtend={handleExtendSession}
          onLeave={handleLeaveSession}
          loading={extendingSession}
        />
      )}
    </>
  );
};

export default ProtectedRoute;