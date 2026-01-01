import { useState } from 'react';
import { CreditCard, ShieldCheck, Rocket } from 'lucide-react';

export const PantallaPago = () => {
    const [loading, setLoading] = useState(false);

    const handleComprar = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

            const res = await fetch(`${API_URL}/api/pagos/crear-orden`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
            });

            const data = await res.json();
            if (data.init_point) {
                window.location.href = data.init_point; // Redirige a Mercado Pago
            }
        } catch (error) {
            console.error("Error al generar pago", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-blue-600 p-8 text-center text-white">
                    <Rocket size={48} className="mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold uppercase tracking-wider">Acceso Beta</h1>
                    <p className="opacity-90 mt-2">Desbloquea todo el potencial de tu consultorio.</p>
                </div>

                <div className="p-8">
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-700">
                            <ShieldCheck className="text-green-500" /> <span>Acceso de por vida (Pago único)</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CreditCard className="text-blue-500" /> <span>Gestión ilimitada de pacientes</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CreditCard className="text-purple-500" /> <span>Generador de Informes con IA</span>
                        </li>
                    </ul>

                    <div className="text-center mb-6">
                        <span className="text-4xl font-bold text-slate-800">$75.000</span>
                        <span className="text-slate-500 text-sm"> / pago único</span>
                    </div>

                    <button
                        onClick={handleComprar}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition transform active:scale-95 flex justify-center items-center gap-2"
                    >
                        {loading ? "Cargando..." : "Obtener Acceso Ahora"}
                    </button>

                    <p className="text-xs text-center text-slate-400 mt-4">Procesado de forma segura por Mercado Pago.</p>
                </div>
            </div>
        </div>
    );
};