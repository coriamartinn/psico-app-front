/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Users,
    FileText, // <--- CAMBIO: Usamos este ícono para Informes
    CalendarDays,
    BarChart3,
    LogOut,
    UserCircle,
    LogIn
} from "lucide-react";

// Componente auxiliar NavLink
const NavLink = ({ to, icon, text }) => {
    const location = useLocation();
    // Verificamos si la ruta actual coincide (o empieza con) el link
    const isActive = location.pathname === to;

    const Icon = icon;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group
      ${isActive
                    ? "bg-blue-600 text-white shadow-lg translate-x-1"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                }`}
        >
            <Icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
            <span className="font-medium">{text}</span>
        </Link>
    );
};

export const Sidebar = () => {
    // Leemos el localStorage DIRECTAMENTE al iniciar el estado.
    const [usuario, setUsuario] = useState(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    });

    const handleLogout = () => {
        if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
            localStorage.removeItem("usuario");
            window.location.href = "/login";
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-2xl z-50">
            {/* Header del Sidebar */}
            <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold shadow-blue-500/50 shadow-lg">
                    P
                </div>
                <h1 className="text-xl font-bold tracking-wide">PsicoApp</h1>
            </div>

            {/* Menú de Navegación */}
            <nav className="flex-1 p-4 space-y-2 mt-4">
                <p className="text-xs text-slate-500 font-bold uppercase px-4 mb-2 tracking-wider">Menú Principal</p>

                <NavLink to="/" icon={Users} text="Pacientes" />

                {/* --- CAMBIO AQUÍ: Ahora apunta a /informes --- */}
                <NavLink to="/informes" icon={FileText} text="Informes" />

                <NavLink to="/calendario" icon={CalendarDays} text="Calendario" />
                <NavLink to="/graficos" icon={BarChart3} text="Gráficos y Stats" />
            </nav>

            {/* Footer del Sidebar (Usuario) */}
            <div className="p-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 font-bold uppercase px-4 mb-2 tracking-wider">
                    {usuario ? `Hola, ${usuario.nombre}` : "Cuenta"}
                </p>

                {usuario ? (
                    // SI ESTÁ LOGUEADO: Botón de Salir
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                ) : (
                    // SI NO ESTÁ LOGUEADO: Botones de Login/Registro
                    <div className="space-y-2">
                        <Link to="/login" className="flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition">
                            <LogIn size={20} /> Login
                        </Link>
                        <Link to="/registro" className="flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition justify-center shadow-lg hover:shadow-blue-600/20">
                            <UserCircle size={20} /> Registrarse
                        </Link>
                    </div>
                )}
            </div>
        </aside>
    );
};