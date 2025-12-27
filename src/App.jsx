import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState } from "react";

// --- CONTEXTO (Memoria Global) ---
import { DatosProvider } from "./components/context/DatosContext";

// --- COMPONENTES ---
import { Sidebar } from "./components/Sidebar";
import { ListaPacientes } from "./components/listaPacientes";
import { FormularioPaciente } from "./components/FormularioPaciente";
import { Calendario } from "./components/Calendario";
import { Graficos } from "./components/Graficos";
import { GeneradorInforme } from "./components/GeneradorInforme";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { RecuperarPassword } from "./components/auth/RecuperarPassword";

// 👇 IMPORTACIONES NUEVAS (Asegúrate que la ruta sea correcta, ej: ./components/vistas/...)
import { Dashboard } from "./components/vistas/Dashboard";
import { Herramientas } from "./components/vistas/Herramientas";

// --- GUARDIA DE SEGURIDAD ---
const ProtectedRoute = () => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- LAYOUT CON SIDEBAR ---
const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 w-full">
      {/* Sidebar Fijo */}
      <Sidebar />

      {/* Contenido a la derecha */}
      <main className="flex-1 ml-64 p-8 transition-all overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  return (
    <DatosProvider>
      <Routes>

        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/register" element={<Navigate to="/registro" />} />

        {/* --- RUTAS PROTEGIDAS --- */}
        <Route element={<ProtectedRoute />}>

          <Route element={<MainLayout />}>

            {/* 1. EL NUEVO HOME: DASHBOARD */}
            <Route path="/" element={<Dashboard />} />

            {/* 2. LISTA DE PACIENTES (Ruta nueva) */}
            <Route
              path="/pacientes"
              element={<ListaPacientes setPacienteSeleccionado={setPacienteSeleccionado} />}
            />

            {/* 3. HERRAMIENTAS TERAPÉUTICAS (Pizarra/Respiración) */}
            <Route path="/herramientas" element={<Herramientas />} />

            {/* CREAR Y EDITAR */}
            <Route path="/crear" element={<FormularioPaciente />} />
            <Route path="/editar/:id" element={<FormularioPaciente />} />

            {/* INFORMES */}
            <Route
              path="/informes"
              element={<GeneradorInforme pacienteActual={pacienteSeleccionado} />}
            />

            {/* GRÁFICOS */}
            <Route path="/graficos" element={<Graficos />} />

            {/* CALENDARIO */}
            <Route path="/calendario" element={<Calendario />} />

          </Route>

        </Route>

        {/* CUALQUIER OTRA RUTA -> AL LOGIN */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </DatosProvider>
  );
}

export default App;