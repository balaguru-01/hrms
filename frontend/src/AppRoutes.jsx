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

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<ChooseLogin />}
      />

      <Route element={<PublicOnlyRoute />}>
        <Route
          path="/enterprise/login"
          element={<EnterpriseLogin />}
        />
      </Route>

      <Route
        path="/tenant/organization"
        element={<TenantOrganization />}
      />

      <Route
        path="/tenant/login"
        element={<TenantLogin />}
      />

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["enterpriseadmin"]}
          />
        }
      >
        <Route
          path="/enterprise/dashboard"
          element={<EnterpriseDashboard />}
        />

        <Route
          path="/enterprise/tenant-management"
          element={<TenantManagement />}
        />

        <Route
          path="/enterprise/pending-approvals"
          element={<PendingApprovals />}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["superadmin"]}
          />
        }
      >
        <Route
          path="/superadmin/dashboard"
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