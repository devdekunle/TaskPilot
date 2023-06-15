import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { unProtectedRoutes } from "./router/routes";



function App() {

  return (
    <>
      <div style={{ position: "relative" }}>
        <RouterProvider router={unProtectedRoutes} />
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
