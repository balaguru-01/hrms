import { Routes, Route } from "react-router-dom";

/* =========================================================
   AUTHENTICATION
   ========================================================= */

import ChooseLogin from "./pages/auth/ChooseLogin";
import EnterpriseLogin from "./pages/auth/EnterpriseLogin";
import TenantOrganization from "./pages/auth/TenantOrganization";
import TenantLogin from "./pages/auth/TenantLogin";

/* =========================================================
   ERROR PAGES
   ========================================================= */

import NotFound from "./pages/errors/NotFound";

/* =========================================================
   ROUTE GUARDS
   ========================================================= */

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute";

/* =========================================================
   ENTERPRISE
   ========================================================= */

import PendingApprovals from "./pages/enterprise/PendingApprovals";
import EnterpriseDashboard from "./pages/enterprise/EnterpriseDashboard";
import TenantManagement from "./pages/enterprise/TenantManagement";

/* =========================================================
   SUPER ADMIN
   ========================================================= */

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
          ===================================================== */}

      <Route
        path="/"
        element={<ChooseLogin />}
      />

      {/* =====================================================
          ENTERPRISE LOGIN
          ===================================================== */}

      <Route element={<PublicOnlyRoute />}>
        <Route
          path="/enterprise/login"
          element={<EnterpriseLogin />}
        />
      </Route>

      {/* =====================================================
          TENANT AUTHENTICATION
          ===================================================== */}

      <Route
        path="/tenant/organization"
        element={<TenantOrganization />}
      />

      <Route
        path="/tenant/login"
        element={<TenantLogin />}
      />

      {/* =====================================================
          ENTERPRISE PROTECTED ROUTES
          ===================================================== */}

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

      {/* =====================================================
          SUPER ADMIN PROTECTED ROUTES
          ===================================================== */}

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

      {/* =====================================================
          404 FALLBACK
          ===================================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;