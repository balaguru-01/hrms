import { Navigate, Outlet } from "react-router-dom";

import {
  getUserRole,
  isAuthenticated,
} from "../utils/auth";

import { ROLES } from "../utils/constants/roles";
import { ROUTES } from "../utils/constants/routes";

const PUBLIC_LOGIN_ROUTES = {
  [ROLES.ENTERPRISE_ADMIN]:
    ROUTES.ENTERPRISE_DASHBOARD,

  [ROLES.SUPER_ADMIN]:
    ROUTES.SUPER_ADMIN_DASHBOARD,
};

const PublicOnlyRoute = () => {
  const authenticated =
    isAuthenticated();

  const role = getUserRole();

  if (!authenticated) {
    return <Outlet />;
  }

  const redirectRoute =
    PUBLIC_LOGIN_ROUTES[role] ||
    ROUTES.ENTERPRISE_LOGIN;

  return (
    <Navigate
      to={redirectRoute}
      replace
    />
  );
};

export default PublicOnlyRoute;