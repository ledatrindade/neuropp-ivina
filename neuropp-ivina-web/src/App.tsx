import { Route, Routes, useLocation } from "react-router";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";

import { Home } from "./pages/public/Home";
import { About } from "./pages/public/About";
import { Assessment } from "./pages/public/Assessment";
import { Contact } from "./pages/public/Contact";
import { Schedule } from "./pages/public/Schedule";

import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";

import { ConfirmAppointment } from "./pages/responsible/ConfirmAppointment";
import { ResponsibleDashboard } from "./pages/responsible/ResponsibleDashboard";
import { MyAppointments } from "./pages/responsible/MyAppointments";
import { MyDocuments } from "./pages/responsible/MyDocuments";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAvailability } from "./pages/admin/AdminAvailability";
import { AdminAppointments } from "./pages/admin/AdminAppointments";
import { AdminDocuments } from "./pages/admin/AdminDocuments";

function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F3EA]">
      <Header />

      <div key={location.pathname} className="page-transition flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/avaliacao" element={<Assessment />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/agendar" element={<Schedule />} />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />

          <Route
            path="/confirmar-agendamento"
            element={
              <ProtectedRoute>
                <ConfirmAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/responsavel"
            element={
              <ProtectedRoute>
                <ResponsibleDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/responsavel/agendamentos"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/responsavel/documentos"
            element={
              <ProtectedRoute>
                <MyDocuments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/horarios"
            element={
              <AdminRoute>
                <AdminAvailability />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/agendamentos"
            element={
              <AdminRoute>
                <AdminAppointments />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/documentos"
            element={
              <AdminRoute>
                <AdminDocuments />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;