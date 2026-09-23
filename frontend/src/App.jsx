import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./AppRoutes";
import { ToastProvider } from "./context/ToastContext";
import { EnterpriseUserProvider } from "./context/EnterpriseUserContext";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <EnterpriseUserProvider>
          <AppRoutes />
        </EnterpriseUserProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;