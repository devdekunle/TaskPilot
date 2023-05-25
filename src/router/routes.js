import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import UnProtectedRouteLayout from "../layouts/UnProtectedRouteLayout";
import ProtectedRouteLayout from "../layouts/ProtectedRouteLayout";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Dev from "../pages/Dev";
import { Auth } from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import TasksLayout from "../layouts/TasksLayout";
import Tasks from '../pages/Tasks'

// Protected Route
import Projects from "../pages/Projects";

export const unProtectedRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<UnProtectedRouteLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dev" element={<Dev />} />
    </Route>
  )
);

export const ProtectedRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/user" element={<ProtectedRouteLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="projects">
        <Route index element={<Projects />} />
          <Route path="tasks" element={<TasksLayout/>}>
           <Route index element={<Tasks />} />
        </Route>
      </Route>
    </Route>
  )
);
