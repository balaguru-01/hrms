import { Navigate, Outlet } from "react-router-dom";

import {
  getUserRole,
  isAuthenticated,
} from "../utils/auth";

const PublicOnlyRoute = () => {
  const authenticated = isAuthenticated();
  const role = getUserRole();

  if (!authenticated) {
    return <Outlet />;
  }

  if (role === "enterpriseadmin") {
    return (
      <Navigate
        to="/enterprise/dashboard"
        replace
      />
    );
  }

  if (role === "superadmin") {
    return (
      <Navigate
        to="/superadmin/dashboard"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/enterprise/login"
      replace
    />
  );
};

export default PublicOnlyRoute;