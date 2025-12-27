import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, CheckCircle, Award, Eye, EyeOff } from "lucide-react";
import Swal from 'sweetalert2';

export const Register = () => {
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        nombre: "", email: "", password: "", confirmPassword: "", matricula: ""
    });

    // Estados para mostrar contraseñas
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // 1. NUEVO ESTADO PARA LA CARGA
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (datos.password !== datos.confirmPassword) {
            return Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden'
            });
        }

        // ACTIVAMOS EL MODO CARGA
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: datos.nombre,
                    email: datos.email,
                    password: datos.password,
                    matricula: datos.matricula
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Cuenta creada!',
                    text: 'Ya puedes iniciar sesión con tus credenciales.',
                    confirmButtonColor: '#3b82f6'
                }).then(() => {
                    navigate("/login");
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    text: data.message || "No se pudo crear la cuenta"
                });
            }
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'Asegúrate de que el servidor esté encendido.'
            });
        } finally {
            // SIEMPRE APAGAMOS LA CARGA AL FINAL
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-slate-800 p-8 text-center">
                    <h1 className="text-3xl font-bold text-white tracking-wide">Crear Cuenta</h1>
                    <p className="text-slate-300 mt-2">Únete a PsicoApp hoy</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* NOMBRE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={20} className="text-gray-400" /></div>
                                <input type="text" name="nombre" required placeholder="Tu Nombre" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} disabled={isLoading} />
                            </div>
                        </div>
                        {/* MATRÍCULA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula Profesional</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Award size={20} className="text-gray-400" /></div>
                                <input type="text" name="matricula" placeholder="Ej: 1234-LP (Opcional)" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} disabled={isLoading} />
                            </div>
                        </div>
                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={20} className="text-gray-400" /></div>
                                <input type="email" name="email" required placeholder="ejemplo@correo.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} disabled={isLoading} />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={20} className="text-gray-400" /></div>
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CheckCircle size={20} className="text-gray-400" /></div>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer">
                                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* BOTÓN CON FEEDBACK DE CARGA */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform 
                                ${isLoading ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 hover:scale-[1.02] text-white cursor-pointer'}
                            `}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registrando...
                                </span>
                            ) : "Registrarse"}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">Inicia Sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};