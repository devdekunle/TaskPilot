import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import PrivateRoutes from "../components/PrivateRoutes";
import UnProtectedRouteLayout from "../layouts/UnProtectedRouteLayout";
import ProtectedRouteLayout from "../layouts/ProtectedRouteLayout";
import Home from "../pages/Home";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Dev from "../pages/Dev";
import { Auth } from "../pages/Auth";
import Dashboard from "../pages/Dashboard";
import TasksLayout from "../layouts/TasksLayout";
import Tasks from "../pages/Tasks";
import TasksPending from "../pages/TasksPending";
import TasksInProgress from "../pages/TasksInProgress";
import TasksCompleted from "../pages/TasksCompleted";
import TasksApproved from "../pages/TasksApproved";
import TokenVerification from "../pages/TokenVerification";

// Protected Route
import Projects from "../pages/Projects";
import PulicRoutes from "../components/PulicRoutes";

export const unProtectedRoutes = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route element={<PulicRoutes />}>
        <Route path="/" element={<UnProtectedRouteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dev" element={<Dev />} />
          <Route
            path="/auth/token-verification"
            element={<TokenVerification />}
          />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/user" element={<ProtectedRouteLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects">
            <Route index element={<Projects />} />
            <Route path=":id/tasks" element={<TasksLayout />}>
              <Route index element={<Tasks />} />
              <Route path="pending" element={<TasksPending />} />
              <Route path="on-going" element={<TasksInProgress />} />
              <Route path="completed" element={<TasksCompleted />} />
              <Route path="approved" element={<TasksApproved />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

// Protected Route
// export const ProtectedRoutes = createBrowserRouter(
//   createRoutesFromElements(
//     <Route element={PrivateRoutes}>
//       <Route path="/user" element={<ProtectedRouteLayout />}>
//         <Route index element={<Dashboard />} />
//         <Route path="projects">
//           <Route index element={<Projects />} />
//           <Route path="tasks" element={<TasksLayout />}>
//             <Route index element={<Tasks />} />
//             <Route path="pending" element={<TasksPending />} />
//             <Route path="in-progress" element={<TasksInProgress />} />
//             <Route path="completed" element={<TasksCompleted />} />
//             <Route path="approved" element={<TasksApproved />} />
//           </Route>
//         </Route>
//       </Route>
//     </Route>
//   )
// );
