import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import Swal from 'sweetalert2';

export const Login = () => {
    const navigate = useNavigate();
    const [datos, setDatos] = useState({ email: "", password: "" });
    const [mostrarPassword, setMostrarPassword] = useState(false);

    // 1. NUEVO ESTADO PARA LA CARGA
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!datos.email || !datos.password) {
            return Swal.fire({ icon: 'warning', title: 'Campos vacíos', text: 'Por favor completa todos los campos' });
        }

        // ACTIVAMOS EL MODO CARGA
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos),
            });

            const data = await response.json();

            if (response.ok) {
                const tokenReal = data.token || data.user?.token || data.accessToken;
                const usuarioReal = data.user || data;
                const nombreReal = usuarioReal.nombre || usuarioReal.first_name || data.nombre;

                if (!tokenReal) {
                    setIsLoading(false); // Apagamos carga si hay error
                    return Swal.fire({ icon: 'error', title: 'Error de Sistema', text: 'El servidor no envió el token.' });
                }

                localStorage.setItem("token", tokenReal);
                localStorage.setItem("usuario", JSON.stringify(usuarioReal));

                Swal.fire({
                    icon: 'success',
                    title: `¡Hola, ${nombreReal}!`,
                    text: 'Iniciando sesión...',
                    timer: 1500,
                    showConfirmButton: false
                });

                navigate("/");
            } else {
                Swal.fire({ icon: 'error', title: 'Error de acceso', text: data.message || "Credenciales incorrectas" });
            }
        } catch (error) {
            console.error("Error completo:", error);
            Swal.fire({ icon: 'error', title: 'Error de Conexión', text: 'El servidor está despertando, intenta de nuevo en 30 segundos.' });
        } finally {
            // SIEMPRE APAGAMOS LA CARGA AL FINAL (Haya funcionado o no)
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-slate-800 p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                        <LogIn className="text-blue-400" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-wide">Bienvenido</h1>
                    <p className="text-slate-300 mt-2">Gestión profesional de pacientes</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-gray-400" />
                                </div>
                                <input type="email" name="email" required placeholder="tu@email.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={handleChange} disabled={isLoading} />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                                {/* 2. LINK DE OLVIDÉ MI CONTRASEÑA */}
                                <Link to="/recuperar-password" className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type={mostrarPassword ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* 3. BOTÓN CON FEEDBACK VISUAL */}
                        <button
                            type="submit"
                            disabled={isLoading} // Se deshabilita para evitar doble click
                            className={`w-full font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform cursor-pointer
                                ${isLoading ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 hover:scale-[1.02] text-white'}
                            `}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Conectando...
                                </span>
                            ) : "Ingresar"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        ¿No tienes cuenta? <Link to="/registro" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">Regístrate aquí</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};