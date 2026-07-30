import { Routes, Route } from "react-router-dom";

import ChooseLogin from "./pages/auth/ChooseLogin";
import EnterpriseLogin from "./pages/auth/EnterpriseLogin";
import TenantOrganization from "./pages/auth/TenantOrganization";
import TenantLogin from "./pages/auth/TenantLogin";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ChooseLogin />} />
      <Route path="/enterprise/login" element={<EnterpriseLogin />} />
      <Route path="/tenant" element={<TenantOrganization />} />
      <Route path="/tenant/login" element={<TenantLogin />} />
    </Routes>
  );
}

export default AppRoutes;