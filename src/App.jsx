import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState } from "react";

// --- CONTEXTO (Memoria Global) ---
import { DatosProvider } from "./components/context/DatosContext";

// --- COMPONENTES ---
import { Sidebar } from "./components/Sidebar";
import { ListaPacientes } from "./components/listaPacientes";
import { FormularioPaciente } from "./components/FormularioPaciente";
import { Calendario } from "./components/Calendario"; // Si lo tienes
import { Graficos } from "./components/Graficos";
import { GeneradorInforme } from "./components/GeneradorInforme";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { RecuperarPassword } from "./components/auth/RecuperarPassword";

// --- GUARDIA DE SEGURIDAD ---
const ProtectedRoute = () => {
  const usuario = localStorage.getItem("usuario");
  // Si hay usuario, deja pasar (Outlet), si no, manda al Login
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- LAYOUT CON SIDEBAR (Diseño Principal) ---
const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 h-96 w-full">
      {/* Sidebar Fijo */}
      <Sidebar />

      {/* Contenido a la derecha (ml-64 deja el hueco del sidebar) */}
      <main className="flex-1 ml-64 p-8 transition-all overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  // Estado para saber qué paciente eligió el usuario en la lista
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  return (
    // 1. Envuelve todo en el Proveedor de Datos para los gráficos
    <DatosProvider>
      <Routes>

        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        {/* Alias por si escriben 'register' en vez de 'registro' */}
        <Route path="/register" element={<Navigate to="/registro" />} />


        {/* --- RUTAS PROTEGIDAS --- */}
        <Route element={<ProtectedRoute />}>

          {/* Si pasa el login, usa el diseño con Sidebar */}
          <Route element={<MainLayout />}>

            {/* INICIO: Lista de Pacientes */}
            {/* Le pasamos la función para "recordar" al paciente clickeado */}
            <Route
              path="/"
              element={<ListaPacientes setPacienteSeleccionado={setPacienteSeleccionado} />}
            />

            {/* CREAR PACIENTE */}
            <Route path="/crear" element={<FormularioPaciente />} />
            <Route path="/editar/:id" element={<FormularioPaciente />} />

            {/* INFORMES: Necesita saber quién es el paciente actual */}
            <Route
              path="/informes"
              element={<GeneradorInforme pacienteActual={pacienteSeleccionado} />}
            />

            {/* GRÁFICOS: Usan el Contexto Global (DatosProvider) */}
            <Route path="/graficos" element={<Graficos />} />

            {/* CALENDARIO (Si lo tienes creado) */}
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