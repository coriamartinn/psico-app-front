import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, CheckCircle, Award } from "lucide-react";
import Swal from 'sweetalert2'; // <--- Importamos

export const Register = () => {
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        nombre: "", email: "", password: "", confirmPassword: "", matricula: ""
    });

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

        try {
            // console.log("Enviando registro...", datos); // <--- COMENTADO

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
            // console.error("Error de conexión:", error); // <--- COMENTADO
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'Asegúrate de que el servidor esté encendido.'
            });
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
                                <input type="text" name="nombre" required placeholder="Tu Nombre" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} />
                            </div>
                        </div>
                        {/* MATRÍCULA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula Profesional</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Award size={20} className="text-gray-400" /></div>
                                <input type="text" name="matricula" placeholder="Ej: 1234-LP (Opcional)" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} />
                            </div>
                        </div>
                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={20} className="text-gray-400" /></div>
                                <input type="email" name="email" required placeholder="ejemplo@correo.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} />
                            </div>
                        </div>
                        {/* PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock size={20} className="text-gray-400" /></div>
                                <input type="password" name="password" required placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} />
                            </div>
                        </div>
                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CheckCircle size={20} className="text-gray-400" /></div>
                                <input type="password" name="confirmPassword" required placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform hover:scale-[1.02]">
                            Registrarse
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