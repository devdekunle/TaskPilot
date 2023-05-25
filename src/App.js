import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { unProtectedRoutes, ProtectedRoutes } from "./router/routes";

function App() {
  const [user, setUser] = useState(true);
  return (
    <div style={{ position: "relative" }}>
      {user ? (
        <RouterProvider router={ProtectedRoutes} />
      ) : (
        <RouterProvider router={unProtectedRoutes} />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
