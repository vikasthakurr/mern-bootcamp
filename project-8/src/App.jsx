import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Doctors from "./pages/Doctors.jsx";
import NoAccess from "./pages/NoAccess.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";

// App holds the navbar and all the routes.
// Each route maps a URL to a page component.
export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        {/* Public pages (anyone can open these) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/no-access" element={<NoAccess />} />

        {/* Any logged-in role can see the doctors list */}
        <Route
          path="/doctors"
          element={
            <ProtectedRoute allow={["admin", "doctor", "patient"]}>
              <Doctors />
            </ProtectedRoute>
          }
        />

        {/* Admin-only page */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor-only page */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allow={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Patient-only page */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allow={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback for any unknown URL */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
