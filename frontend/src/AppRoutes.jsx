import { Route, Routes, Outlet } from "react-router-dom";

import ChooseLogin from "./pages/auth/ChooseLogin";
import EnterpriseLogin from "./pages/auth/EnterpriseLogin";
import TenantLogin from "./pages/auth/TenantLogin";
import TenantOrganization from "./pages/auth/TenantOrganization";
import UserRegistration from "./pages/auth/UserRegistration";

import NotFound from "./pages/errors/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

import EnterpriseDashboard from "./pages/enterprise/EnterpriseDashboard";
import PendingApprovals from "./pages/enterprise/PendingApprovals";
import TenantManagement from "./pages/enterprise/TenantManagement";

import Users from "./pages/enterprise/Users";
import ActiveUsers from "./pages/enterprise/ActiveUsers";
import InvitationsSent from "./pages/enterprise/InvitationsSent";
import EnterpriseUserPendingApprovals from "./pages/enterprise/EnterpriseUserPendingApprovals";
import RejectedRequests from "./pages/enterprise/RejectedRequests";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";

import { EnterpriseUserProvider } from "./context/EnterpriseUserContext";

import { ROLES } from "./utils/constants/roles";
import { ROUTES } from "./utils/constants/routes";

const EnterpriseUserLayout = () => {
  return (
    <EnterpriseUserProvider>
      <Outlet />
    </EnterpriseUserProvider>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}

      <Route
        path={ROUTES.HOME}
        element={<ChooseLogin />}
      />

      <Route
        element={<PublicOnlyRoute />}
      >
        <Route
          path={ROUTES.ENTERPRISE_LOGIN}
          element={<EnterpriseLogin />}
        />
      </Route>

      <Route
        path={ROUTES.USER_REGISTER}
        element={<UserRegistration />}
      />

      <Route
        path={ROUTES.TENANT_ORGANIZATION}
        element={<TenantOrganization />}
      />

      <Route
        path={ROUTES.TENANT_LOGIN}
        element={<TenantLogin />}
      />

      {/* Enterprise Admin routes */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              ROLES.ENTERPRISE_ADMIN,
            ]}
          />
        }
      >
        <Route element={<EnterpriseUserLayout />}>
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
            path={ROUTES.ENTERPRISE_USERS}
            element={<Users />}
          />

          {/* Existing tenant approval page */}

          <Route
            path={
              ROUTES.ENTERPRISE_PENDING_APPROVALS
            }
            element={<PendingApprovals />}
          />

          {/* Enterprise user pages */}

          <Route
            path={
              ROUTES.ENTERPRISE_ACTIVE_USERS
            }
            element={<ActiveUsers />}
          />

          <Route
            path={
              ROUTES.ENTERPRISE_INVITATIONS
            }
            element={<InvitationsSent />}
          />

          <Route
            path={
              ROUTES.ENTERPRISE_USER_PENDING_APPROVALS
            }
            element={
              <EnterpriseUserPendingApprovals />
            }
          />

          <Route
            path={
              ROUTES.ENTERPRISE_REJECTED_REQUESTS
            }
            element={<RejectedRequests />}
          />
        </Route>
      </Route>

      {/* Super Admin routes */}

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

      {/* Fallback */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default AppRoutes;