import LandingPage from "./layouts/LandingPage";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div style={{ position: "relative" }}>
      <Navbar></Navbar>
      <LandingPage />
      <ToastContainer />
    </div>
  );
}

export default App;
