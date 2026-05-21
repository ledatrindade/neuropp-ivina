import { Route, Routes } from "react-router";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/public/Home";
import { About } from "./pages/public/About";
import { Assessment } from "./pages/public/Assessment";
import { Contact } from "./pages/public/Contact";
import { Schedule } from "./pages/public/Schedule";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ConfirmAppointment } from "./pages/responsible/ConfirmAppointment";

function App() {
  return (
    <div className="min-h-screen bg-[#F7F3EA]">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/avaliacao" element={<Assessment />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/agendar" element={<Schedule />} />

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        <Route path="/confirmar-agendamento" element={<ConfirmAppointment />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;