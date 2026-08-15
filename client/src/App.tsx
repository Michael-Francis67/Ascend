import { Navigate, Route, Routes } from "react-router";
import Login from "./components/dashboard/pages/Login";
import Dashboard from "./components/dashboard/pages/Dashboard";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";
import { PrivateRoute } from "./components/dashboard/PrivateRoute";
import DashboardLayout from "./components/dashboard/layout/DashboardLayout";
import Sections from "./components/dashboard/pages/Sections";
import SectionEditor from "./components/dashboard/pages/SectionsEditor";
import Projects from "./components/dashboard/pages/Projects";
import ProjectEditor from "./components/dashboard/pages/ProjectsEditor";
import Services from "./components/dashboard/pages/Services";
import ServiceEditor from "./components/dashboard/pages/ServicesEditor";
import Testimonials from "./components/dashboard/pages/Testimonials";
import TestimonialEditor from "./components/dashboard/pages/TestimonialsEditor";
import Team from "./components/dashboard/pages/Team";
import TeamEditor from "./components/dashboard/pages/TeamEditor";
import Settings from "./components/dashboard/pages/Settings";
import TrustedBy from "./components/dashboard/pages/TrustedBy";

function App() {
  return (
    <div className="font-display antialiased">
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Sections */}
              <Route path="/dashboard/sections" element={<Sections />} />
              <Route
                path="/dashboard/sections/new"
                element={<SectionEditor />}
              />
              <Route
                path="/dashboard/sections/:id/edit"
                element={<SectionEditor />}
              />

              <Route path="/dashboard/trusted-by" element={<TrustedBy />} />

              {/* Projects */}
              <Route path="/dashboard/projects" element={<Projects />} />
              <Route
                path="/dashboard/projects/new"
                element={<ProjectEditor />}
              />
              <Route
                path="/dashboard/projects/:id/edit"
                element={<ProjectEditor />}
              />

              {/* Services */}
              <Route path="/dashboard/services" element={<Services />} />
              <Route
                path="/dashboard/services/new"
                element={<ServiceEditor />}
              />
              <Route
                path="/dashboard/services/:id/edit"
                element={<ServiceEditor />}
              />

              {/* Testimonials */}
              <Route
                path="/dashboard/testimonials"
                element={<Testimonials />}
              />
              <Route
                path="/dashboard/testimonials/new"
                element={<TestimonialEditor />}
              />
              <Route
                path="/dashboard/testimonials/:id/edit"
                element={<TestimonialEditor />}
              />

              {/* Team */}
              <Route path="/dashboard/team" element={<Team />} />
              <Route path="/dashboard/team/new" element={<TeamEditor />} />
              <Route path="/dashboard/team/:id/edit" element={<TeamEditor />} />

              {/* Settings */}
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
