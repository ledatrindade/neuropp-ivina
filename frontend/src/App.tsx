import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { RoleRoute } from "./components/auth/RoleRoute";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { LoadingCard } from "./components/ui/LoadingCard";

const Home = lazy(() => import("./pages/public/Home").then((module) => ({ default: module.Home })));
const About = lazy(() => import("./pages/public/About").then((module) => ({ default: module.About })));
const Assessment = lazy(() => import("./pages/public/Assessment").then((module) => ({ default: module.Assessment })));
const Contact = lazy(() => import("./pages/public/Contact").then((module) => ({ default: module.Contact })));
const Schedule = lazy(() => import("./pages/public/Schedule").then((module) => ({ default: module.Schedule })));
const Login = lazy(() => import("./pages/auth/Login").then((module) => ({ default: module.Login })));
const Register = lazy(() => import("./pages/auth/Register").then((module) => ({ default: module.Register })));
const ConfirmAppointment = lazy(() => import("./pages/responsible/ConfirmAppointment").then((module) => ({ default: module.ConfirmAppointment })));
const ResponsibleDashboard = lazy(() => import("./pages/responsible/ResponsibleDashboard").then((module) => ({ default: module.ResponsibleDashboard })));
const MyAppointments = lazy(() => import("./pages/responsible/MyAppointments").then((module) => ({ default: module.MyAppointments })));
const MyDocuments = lazy(() => import("./pages/responsible/MyDocuments").then((module) => ({ default: module.MyDocuments })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard").then((module) => ({ default: module.AdminDashboard })));
const AdminAvailability = lazy(() => import("./pages/admin/AdminAvailability").then((module) => ({ default: module.AdminAvailability })));
const AdminAppointments = lazy(() => import("./pages/admin/AdminAppointments").then((module) => ({ default: module.AdminAppointments })));
const AdminDocuments = lazy(() => import("./pages/admin/AdminDocuments").then((module) => ({ default: module.AdminDocuments })));
const NotFound = lazy(() => import("./pages/NotFound").then((module) => ({ default: module.NotFound })));

function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F3EA]">
      <ScrollToTop />
      <Header />
      <div key={location.pathname} className="page-transition flex-1">
        <Suspense fallback={<div className="mx-auto max-w-4xl px-5 py-16"><LoadingCard label="Carregando página..." /></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/avaliacao" element={<Assessment />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/agendar" element={<Schedule />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />

            <Route path="/confirmar-agendamento" element={<RoleRoute role="RESPONSIBLE"><ConfirmAppointment /></RoleRoute>} />
            <Route path="/responsavel" element={<RoleRoute role="RESPONSIBLE"><ResponsibleDashboard /></RoleRoute>} />
            <Route path="/responsavel/agendamentos" element={<RoleRoute role="RESPONSIBLE"><MyAppointments /></RoleRoute>} />
            <Route path="/responsavel/documentos" element={<RoleRoute role="RESPONSIBLE"><MyDocuments /></RoleRoute>} />

            <Route path="/admin" element={<RoleRoute role="ADMIN"><AdminDashboard /></RoleRoute>} />
            <Route path="/admin/horarios" element={<RoleRoute role="ADMIN"><AdminAvailability /></RoleRoute>} />
            <Route path="/admin/agendamentos" element={<RoleRoute role="ADMIN"><AdminAppointments /></RoleRoute>} />
            <Route path="/admin/documentos" element={<RoleRoute role="ADMIN"><AdminDocuments /></RoleRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

export default App;
