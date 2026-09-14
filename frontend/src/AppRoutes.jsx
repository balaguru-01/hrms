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
import TenantManagement from "./pages/enterprise/TenantManagement";

import Users from "./pages/enterprise/Users";
import InvitationsSent from "./pages/enterprise/InvitationsSent";

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


          <Route
            path={
              ROUTES.ENTERPRISE_INVITATIONS
            }
            element={<InvitationsSent />}
          />
        </Route>
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