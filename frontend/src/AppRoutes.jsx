import { Route, Routes } from "react-router-dom";

import ChooseLogin from "./pages/auth/ChooseLogin";
import EnterpriseLogin from "./pages/auth/EnterpriseLogin";
import TenantLogin from "./pages/auth/TenantLogin";
import TenantOrganization from "./pages/auth/TenantOrganization";

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
      <Route
        path={ROUTES.HOME}
        element={<ChooseLogin />}
      />

      <Route
        element={
          <PublicOnlyRoute />
        }
      >
        <Route
          path={ROUTES.ENTERPRISE_LOGIN}
          element={<EnterpriseLogin />}
        />
      </Route>

      <Route
        path={ROUTES.TENANT_ORGANIZATION}
        element={<TenantOrganization />}
      />

      <Route
        path={ROUTES.TENANT_LOGIN}
        element={<TenantLogin />}
      />

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
          path={
            ROUTES.ENTERPRISE_DASHBOARD
          }
          element={<EnterpriseDashboard />}
        />

        <Route
          path={
            ROUTES.ENTERPRISE_TENANT_MANAGEMENT
          }
          element={<TenantManagement />}
        />

        <Route
          path={
            ROUTES.ENTERPRISE_PENDING_APPROVALS
          }
          element={<PendingApprovals />}
        />
      </Route>

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
          path={
            ROUTES.SUPER_ADMIN_DASHBOARD
          }
          element={<SuperAdminDashboard />}
        />
      </Route>

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;