import LandingPage from "./layouts/LandingPage";
import Navbar from "./components/Navbar";


function App() {
  return (
    <div style={{position: 'relative'}}>
      <Navbar></Navbar>
      <LandingPage/>
    </div>
  );
}

export default App;
