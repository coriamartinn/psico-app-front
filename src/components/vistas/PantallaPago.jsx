import { useState, useEffect } from "react";
import { CreditCard, RefreshCw, LogOut, CheckCircle, Loader2, Sparkles } from "lucide-react"; // Agregué 'Sparkles' para el efecto visual del mes gratis

export const PantallaPago = () => {
    const [loading, setLoading] = useState(false);
    const [verificando, setVerificando] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    // --- 1. AUTODETECCIÓN (Esto ya estaba bien y funcionará con el Webhook) ---
    useEffect(() => {
        const intervalo = setInterval(() => {
            checkPaymentStatus();
        }, 5000);

        return () => clearInterval(intervalo);
    }, []);

    const checkPaymentStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await fetch(`${API_URL}/api/auth/verificar-estado`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const usuarioActualizado = await res.json();

                if (usuarioActualizado.is_paid === 1) {
                    console.log("Pago detectado automáticamente!");
                    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log("Esperando pago...", error);
        }
    };

    // --- 2. INICIAR SUSCRIPCIÓN (CAMBIO IMPORTANTE AQUÍ) ---
    const handlePagar = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            // 👇 CAMBIAMOS LA RUTA A '/crear-suscripcion'
            const res = await fetch(`${API_URL}/api/pagos/crear-suscripcion`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch (error) {
            console.error("Error al generar suscripción:", error);
            alert("Error al conectar con Mercado Pago");
        } finally {
            setLoading(false);
        }
    };

    // --- 3. VERIFICACIÓN MANUAL ---
    const handleVerificarManual = async () => {
        setVerificando(true);
        await checkPaymentStatus();

        setTimeout(() => {
            setVerificando(false);
            const usuario = JSON.parse(localStorage.getItem("usuario"));
            if (usuario.is_paid === 0) {
                alert("Aún no detectamos la activación. Si ya pusiste la tarjeta, espera unos segundos más.");
            }
        }, 1000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden text-center">

                <div className="bg-purple-600 p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-12 scale-150"></div>

                    <div className="relative z-10">
                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-inner">
                            <CreditCard className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mt-4">Suscripción Profesional</h1>
                        <p className="text-purple-100 text-sm mt-2">
                            Mejora tu práctica profesional hoy mismo
                        </p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        {/* 👇 CAMBIO VISUAL: OFERTA MES GRATIS */}
                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                            <Sparkles size={14} /> 1 MES DE PRUEBA GRATIS
                        </div>

                        <h3 className="text-xl font-bold text-slate-800">Plan Premium</h3>
                        <div className="flex flex-col items-center">
                            <p className="text-4xl font-extrabold text-purple-600">$75000 <span className="text-sm text-slate-400 font-normal">/ mes</span></p>
                            <p className="text-xs text-slate-400 mt-1 line-through decoration-red-400">Primer mes $15.000</p>
                            <p className="text-sm font-bold text-green-600">Hoy pagas $0</p>
                        </div>

                        <ul className="text-slate-500 text-sm text-left space-y-2 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-green-500" /> 1 Mes 100% Bonificado</li>
                            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-green-500" /> Informes Ilimitados</li>
                            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-green-500" /> Firma Digital Automática</li>
                            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-green-500" /> Cancela cuando quieras</li>
                        </ul>
                    </div>

                    <div className="space-y-3 pt-4">
                        <button
                            onClick={handlePagar}
                            disabled={loading}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-purple-500/30 flex justify-center items-center gap-2 transform active:scale-95"
                        >
                            {loading ? "Procesando..." : "Comenzar Prueba Gratis"}
                        </button>

                        <button
                            onClick={handleVerificarManual}
                            disabled={verificando}
                            className="w-full py-3 bg-white border-2 border-purple-100 text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition flex justify-center items-center gap-2"
                        >
                            {verificando ? <Loader2 className="animate-spin" size={20} /> : "Ya me suscribí, verificar"}
                        </button>

                        <div className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-2">
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Esperando confirmación de Mercado Pago...</span>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="text-slate-400 text-xs hover:text-red-500 flex items-center justify-center gap-1 w-full mt-6 transition-colors">
                        <LogOut size={12} /> Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};