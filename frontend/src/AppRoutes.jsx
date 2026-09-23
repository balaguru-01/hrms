import { Route, Routes } from "react-router-dom";

import ChooseLogin from "./pages/auth/ChooseLogin";
import EnterpriseLogin from "./pages/auth/EnterpriseLogin";
import TenantLogin from "./pages/auth/TenantLogin";
import TenantOrganization from "./pages/auth/TenantOrganization";
import UserRegistration from "./pages/auth/UserRegistration";
import TenantRegistration from "./pages/enterprise/TenantRegistration";

import NotFound from "./pages/errors/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

import EnterpriseDashboard from "./pages/enterprise/EnterpriseDashboard";
import PendingApprovals from "./pages/enterprise/PendingApprovals";
import TenantManagement from "./pages/enterprise/TenantManagement";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";

import { ROLES } from "./utils/constants/roles";
import { ROUTES } from "./utils/constants/routes";

function AppRoutes() {
  return (
    <Routes>

      {/* Home Page */}
      <Route
        path={ROUTES.HOME}
        element={<ChooseLogin />}
      />

      {/* Public Login Routes */}
      <Route element={<PublicOnlyRoute />}>

        <Route
          path={ROUTES.ENTERPRISE_LOGIN}
          element={<EnterpriseLogin />}
        />

      </Route>

      {/* User Registration */}
      <Route
        path={ROUTES.USER_REGISTER}
        element={<UserRegistration />}
      />
{/* Tenant Registration from Email Invitation */}
<Route
  path={ROUTES.TENANT_REGISTRATION}
  element={<TenantRegistration />}
/>
    

      {/* Tenant Organization */}
      <Route
        path={ROUTES.TENANT_ORGANIZATION}
        element={<TenantOrganization />}
      />

      {/* Tenant Login */}
      <Route
        path={ROUTES.TENANT_LOGIN}
        element={<TenantLogin />}
      />

      {/* Enterprise Admin Protected Routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              ROLES.ENTERPRISE_ADMIN,
            ]}
          />
        }
      >
        <Route
          path={ROUTES.ENTERPRISE_DASHBOARD}
          element={<EnterpriseDashboard />}
        />

        <Route
          path={ROUTES.ENTERPRISE_TENANT_MANAGEMENT}
          element={<TenantManagement />}
        />

        <Route
          path={ROUTES.ENTERPRISE_PENDING_APPROVALS}
          element={<PendingApprovals />}
        />

      </Route>

      {/* Super Admin Protected Routes */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              ROLES.SUPER_ADMIN,
            ]}
          />
        }
      >
        <Route
          path={ROUTES.SUPER_ADMIN_DASHBOARD}
          element={<SuperAdminDashboard />}
        />

      </Route>

      {/* Page Not Found */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;