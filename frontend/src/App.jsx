import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChooseLogin from "./pages/auth/ChooseLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<ChooseLogin />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;