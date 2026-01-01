import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useState } from "react";

// --- CONTEXTO (Memoria Global) ---
import { DatosProvider } from "./components/context/DatosContext";

// --- COMPONENTES PRINCIPALES ---
import { Sidebar } from "./components/Sidebar";
import { ListaPacientes } from "./components/listaPacientes";
import { FormularioPaciente } from "./components/FormularioPaciente";
import { Calendario } from "./components/Calendario";
import { Graficos } from "./components/Graficos";
import { GeneradorInforme } from "./components/GeneradorInforme";

// --- AUTH ---
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { RecuperarPassword } from "./components/auth/RecuperarPassword";

// --- VISTAS (Páginas nuevas) ---
import { Dashboard } from "./components/vistas/Dashboard";
import { Herramientas } from "./components/vistas/Herramientas";
import { ListaInformes } from "./components/vistas/ListaInformes";
import { Perfil } from "./components/Perfil";


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

      {/* 👈 2. Ponemos el Banner acá para que se vea SIEMPRE, en todas las pantallas */}
      <DevBanner />

      {/* 👈 3. Agregamos este div con pt-10 (padding top) para que el banner no tape el contenido */}
      <div className="pt-10 h-screen w-full">
        <Routes>

          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/register" element={<Navigate to="/registro" />} />

          {/* --- RUTAS PROTEGIDAS --- */}
          <Route element={<ProtectedRoute />}>

            <Route element={<MainLayout />}>

              {/* 1. DASHBOARD (Inicio) */}
              <Route path="/" element={<Dashboard />} />

              {/* 2. PACIENTES */}
              <Route
                path="/pacientes"
                element={<ListaPacientes setPacienteSeleccionado={setPacienteSeleccionado} />}
              />
              <Route path="/crear" element={<FormularioPaciente />} />
              <Route path="/editar/:id" element={<FormularioPaciente />} />

              {/* 3. INFORMES */}
              <Route
                path="/informes"
                element={<GeneradorInforme pacienteActual={pacienteSeleccionado} />}
              />
              <Route path="/lista-informes" element={<ListaInformes />} />

              {/* 4. HERRAMIENTAS Y EXTRAS */}
              <Route path="/herramientas" element={<Herramientas />} />
              <Route path="/graficos" element={<Graficos />} />
              <Route path="/calendario" element={<Calendario />} />

              {/* 5. PERFIL DE USUARIO */}
              <Route path="/perfil" element={<Perfil />} />

            </Route>

          </Route>

          {/* CUALQUIER OTRA RUTA -> AL LOGIN */}
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </div>
    </DatosProvider>
  );
}

export default App;