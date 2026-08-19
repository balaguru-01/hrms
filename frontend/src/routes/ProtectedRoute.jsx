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
  stopTokenExpirationTimer,
} from "../utils/auth";

import Unauthorized from "../pages/errors/Unauthorized";
import SessionExpiredModal from "../components/auth/SessionExpiredModal";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();

  const [sessionExpired, setSessionExpired] =
    useState(false);

  const [extendingSession, setExtendingSession] =
    useState(false);

  const token = getAccessToken();
  const role = getUserRole();

  useEffect(() => {
    if (!token) {
      return;
    }

    startTokenExpirationTimer(token, () => {
      setSessionExpired(true);
    });

    return () => {
      stopTokenExpirationTimer();
    };
  }, [token]);

  const handleLeaveSession = () => {
    stopTokenExpirationTimer();
    logout();
    setSessionExpired(false);

    window.location.replace("/");
  };

  const handleExtendSession = async () => {
    setExtendingSession(true);

    setExtendingSession(false);
  };

  if (!token) {
    return (
      <Navigate
        to="/"
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

    if (!normalizedAllowedRoles.includes(role)) {
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