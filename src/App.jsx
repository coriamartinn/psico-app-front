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
import { NuevoInforme } from "./components/vistas/NuevoInforme"; // 👈 1. IMPORTAMOS EL NUEVO COMPONENTE
import { Perfil } from "./components/Perfil";
import { PantallaPago } from "./components/vistas/PantallaPago";


// --- GUARDIA DE SEGURIDAD ---
const ProtectedRoute = () => {
  const usuarioStr = localStorage.getItem("usuario");

  // 1. Si no hay usuario -> Al Login
  if (!usuarioStr) return <Navigate to="/login" replace />;

  const usuario = JSON.parse(usuarioStr);

  // 2. Si está logueado pero NO PAGÓ (y no es admin, por ejemplo) -> Pantalla de Pago
  // OJO: Asegúrate que en la BD el 0 sea número, si viene como string usa "0"
  if (usuario.is_paid === 0) {
    return <PantallaPago />;
  }

  // 3. Si pagó -> Deja pasar a las rutas hijas (Outlet)
  return <Outlet />;
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
      {/* 3. Agregamos este div con pt-10 para que el banner no tape el contenido */}
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

              {/* 👇 2. AQUÍ AGREGAMOS LA RUTA NUEVA */}
              <Route path="/nuevo-informe" element={<NuevoInforme />} />
              <Route path="/historial" element={<ListaInformes />} /> {/* Alias opcional para lista-informes */}

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