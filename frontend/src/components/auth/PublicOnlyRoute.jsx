import { Navigate, Outlet } from "react-router-dom";

import {
  isAuthenticated,
  getUserRole,
} from "../../utils/auth";

/*
=========================================================
PUBLIC ONLY ROUTE

Purpose:

This route is used for pages that should only be accessible
when the user is NOT authenticated.

Example:

/enterprise/login

Behavior:

1. User is NOT authenticated
   -> Allow access to login page.

2. User IS authenticated as Enterprise Admin
   -> Do not allow login page.
   -> Redirect to Enterprise Dashboard.

3. User IS authenticated as Super Admin
   -> Do not allow login page.
   -> Redirect to Super Admin Dashboard.

4. Authentication state is invalid/unknown
   -> Do not allow access to protected application state.
   -> Redirect to Enterprise Login.

IMPORTANT:

- Email/password are NEVER stored here.
- Authentication is based only on the backend-issued JWT
  and the safe user information stored by the login flow.
=========================================================
*/

const PublicOnlyRoute = () => {
  /*
  =========================================================
  AUTHENTICATION STATE
  =========================================================
  */

  const authenticated = isAuthenticated();
  const role = getUserRole();

  /*
  =========================================================
  NOT AUTHENTICATED

  This is the normal state when:

  - User opens the application for the first time.
  - User has logged out.
  - Authentication token has been removed.
  - User has no active session.

  Allow the login page to render.

  IMPORTANT:
  Because the login form itself starts with empty React
  state, the previous email/password will NOT appear.
  =========================================================
  */

  if (!authenticated) {
    return <Outlet />;
  }

  /*
  =========================================================
  ENTERPRISE ADMIN

  An authenticated Enterprise Admin should never be able
  to manually navigate back to:

      /enterprise/login

  They must use Logout to end the session.

  Browser back/navigation will therefore resolve through
  the route guard and return them to the dashboard.
  =========================================================
  */

  if (role === "enterpriseadmin") {
    return (
      <Navigate
        to="/enterprise/dashboard"
        replace
      />
    );
  }

  /*
  =========================================================
  SUPER ADMIN
  =========================================================
  */

  if (role === "superadmin") {
    return (
      <Navigate
        to="/superadmin/dashboard"
        replace
      />
    );
  }

  /*
  =========================================================
  UNKNOWN / INVALID ROLE

  Do NOT send an unknown authenticated user to a dashboard.

  This is safer because the frontend does not know which
  application area the user is authorized to access.

  Clear the invalid authentication state through the normal
  logout utility before allowing a fresh login.
  =========================================================
  */

  return (
    <Navigate
      to="/enterprise/login"
      replace
    />
  );
};

export default PublicOnlyRoute;