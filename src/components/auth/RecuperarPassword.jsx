import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import Swal from 'sweetalert2';

export const RecuperarPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            return Swal.fire({ icon: 'warning', title: 'Campo vacío', text: 'Ingresa tu correo para buscar tu cuenta.' });
        }

        setIsLoading(true);

        try {
            // 👇 ESTA URL AÚN NO EXISTE EN EL BACKEND, PERO YA LA DEJAMOS LISTA
            const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Correo enviado!',
                    text: 'Revisa tu bandeja de entrada (y spam). Te enviamos un link para restablecer tu clave.',
                    confirmButtonColor: '#3b82f6'
                });
                setEmail(""); // Limpiamos el campo
            } else {
                // Si el backend dice que no existe el email, mostramos error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || "No pudimos procesar tu solicitud."
                });
            }

        } catch (error) {
            // Como no tenemos backend aún, caerá aquí o dará 404
            console.error("Error:", error);
            Swal.fire({
                icon: 'info',
                title: 'Función en desarrollo',
                text: 'El frontend está listo, pero falta conectar el servicio de emails en el servidor.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="bg-slate-800 p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
                        <KeyRound className="text-blue-400" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-wide">Recuperar Acceso</h1>
                    <p className="text-slate-300 mt-2 text-sm">
                        Ingresa tu correo y te enviaremos instrucciones.
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    required
                                    placeholder="ejemplo@correo.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full font-bold py-3 px-4 rounded-lg transition duration-200 shadow-lg transform 
                                ${isLoading ? 'bg-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 hover:scale-[1.02] text-white'}
                            `}
                        >
                            {isLoading ? "Enviando..." : "Enviar Instrucciones"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-slate-800 transition font-medium">
                            <ArrowLeft size={16} className="mr-2" />
                            Volver al Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};