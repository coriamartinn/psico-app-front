import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react"; // <--- Importamos Eye y EyeOff
import Swal from 'sweetalert2';

export const Login = () => {
    const navigate = useNavigate();
    const [datos, setDatos] = useState({ email: "", password: "" });
    const [mostrarPassword, setMostrarPassword] = useState(false); // <--- Estado para el ojito

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!datos.email || !datos.password) {
            return Swal.fire({ icon: 'warning', title: 'Campos vacíos', text: 'Por favor completa todos los campos' });
        }

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
                    return Swal.fire({ icon: 'error', title: 'Error de Sistema', text: 'El servidor no envió el token de seguridad.' });
                }

                localStorage.setItem("token", tokenReal);
                localStorage.setItem("usuario", JSON.stringify(usuarioReal));

                Swal.fire({
                    icon: 'success',
                    title: `¡Hola, ${nombreReal}!`,
                    text: 'Has iniciado sesión correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });

                navigate("/");
            } else {
                Swal.fire({ icon: 'error', title: 'Error de acceso', text: data.message || "Credenciales incorrectas" });
            }
        } catch (error) {
            console.error("Error completo:", error);
            Swal.fire({ icon: 'error', title: 'Error de Conexión', text: 'No se pudo conectar con el servidor.' });
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
                    <p className="text-slate-300 mt-2">Inicia sesión para gestionar tus pacientes</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-gray-400" />
                                </div>
                                <input type="email" name="email" required placeholder="tu@email.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition" onChange={handleChange} />
                            </div>
                        </div>

                        {/* INPUT PASSWORD MODIFICADO CON OJITO */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type={mostrarPassword ? "text" : "password"} // <--- Cambia el tipo
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    onChange={handleChange}
                                />
                                {/* BOTÓN DEL OJITO */}
                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {mostrarPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform hover:scale-[1.02]">
                            Ingresar
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