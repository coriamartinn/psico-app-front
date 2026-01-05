import { useState, useEffect } from "react";
import { CreditCard, RefreshCw, LogOut, CheckCircle, Loader2, Sparkles, Crown } from "lucide-react";

export const PantallaPago = () => {
    // Estados de carga separados para cada botón
    const [loadingSub, setLoadingSub] = useState(false);
    const [loadingLife, setLoadingLife] = useState(false);
    const [verificando, setVerificando] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    // --- 1. AUTODETECCIÓN ---
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

                // 👇 CAMBIO CLAVE: Aceptamos 1 (Suscripción) o 2 (Vitalicio)
                if (usuarioActualizado.is_paid >= 1) {
                    console.log("Pago detectado automáticamente!");
                    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
                    window.location.reload();
                }
            }
        } catch (error) {
            console.log("Esperando pago...", error);
        }
    };

    // --- 2. PAGAR SUSCRIPCIÓN (Mes Gratis) ---
    const handleSuscripcion = async () => {
        setLoadingSub(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/pagos/crear-suscripcion`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch (error) {
            console.error("Error suscripción:", error);
            alert("Error al conectar con Mercado Pago");
        } finally {
            setLoadingSub(false);
        }
    };

    // --- 3. PAGAR VITALICIO (De por vida) ---
    const handleVitalicio = async () => {
        setLoadingLife(true);
        try {
            const token = localStorage.getItem("token");
            // 👇 Llamamos a la nueva ruta que creamos antes
            const res = await fetch(`${API_URL}/api/pagos/crear-vitalicio`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch (error) {
            console.error("Error vitalicio:", error);
            alert("Error al conectar con Mercado Pago");
        } finally {
            setLoadingLife(false);
        }
    };

    // --- 4. VERIFICACIÓN MANUAL ---
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

            {/* Contenedor más ancho para que entren las 2 tarjetas */}
            <div className="max-w-5xl w-full">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Elige tu Plan Profesional</h1>
                    <p className="text-slate-400 mt-2">Acceso completo a todas las herramientas</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* === OPCIÓN 1: SUSCRIPCIÓN === */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transform hover:scale-[1.02] transition duration-300">
                        <div className="bg-purple-600 p-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-12 scale-150"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white">Suscripción Mensual</h3>
                                <div className="mt-2 inline-flex items-center gap-1 bg-green-400 text-green-900 px-3 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                    <Sparkles size={12} /> 1 MES GRATIS
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-extrabold text-slate-800">$35.000</p>
                                <p className="text-slate-400 text-sm">/ mes</p>
                                <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 inline-block px-2 py-1 rounded">
                                    Hoy pagas $0
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-600">
                                <li className="flex gap-2 items-center"><CheckCircle size={18} className="text-purple-500" /> 1 Mes de Prueba Gratis</li>
                                <li className="flex gap-2 items-center"><CheckCircle size={18} className="text-purple-500" /> Informes Ilimitados</li>
                                <li className="flex gap-2 items-center"><CheckCircle size={18} className="text-purple-500" /> Cancela cuando quieras</li>
                            </ul>

                            <button
                                onClick={handleSuscripcion}
                                disabled={loadingSub || loadingLife}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-lg shadow-purple-200"
                            >
                                {loadingSub ? "Procesando..." : "Comenzar Prueba Gratis"}
                            </button>
                        </div>
                    </div>

                    {/* === OPCIÓN 2: VITALICIO (PREMIUM) === */}
                    <div className="bg-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col border border-yellow-500/50 relative transform hover:scale-[1.02] transition duration-300">
                        {/* Etiqueta Mejor Opción */}
                        <div className="absolute top-0 right-0 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl z-20 shadow-md">
                            MEJOR OPCIÓN
                        </div>

                        <div className="bg-slate-900 p-6 text-center relative border-b border-slate-700">
                            <h3 className="text-xl font-bold text-white flex justify-center items-center gap-2">
                                <Crown size={24} className="text-yellow-500 fill-yellow-500" /> Acceso Vitalicio
                            </h3>
                            <p className="text-slate-400 text-xs mt-2">Pago único para siempre</p>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="text-center mb-6">
                                <p className="text-4xl font-extrabold text-white">$150.000</p>
                                <p className="text-slate-400 text-sm">único pago</p>
                                <p className="text-xs text-yellow-500 font-bold mt-2 bg-yellow-500/10 inline-block px-2 py-1 rounded border border-yellow-500/20">
                                    Ahorras a largo plazo
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1 text-sm text-slate-300">
                                <li className="flex gap-2 items-center"><CheckCircle size={18} className="text-yellow-500" /> Acceso de por vida</li>
                                <li className="flex gap-2 items-center"><CheckCircle size={18} className="text-yellow-500" /> Sin mensualidades nunca</li>
                                <li className="flex gap-2 items-center"><CheckCircle size={18} className="text-yellow-500" /> Actualizaciones futuras</li>
                            </ul>

                            <button
                                onClick={handleVitalicio}
                                disabled={loadingLife || loadingSub}
                                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-yellow-950 font-bold rounded-xl transition shadow-lg shadow-yellow-900/20"
                            >
                                {loadingLife ? "Procesando..." : "Obtener Acceso Vitalicio"}
                            </button>
                        </div>
                    </div>

                </div>

                {/* BOTONES AUXILIARES */}
                <div className="mt-8 flex flex-col items-center gap-4 max-w-md mx-auto">
                    <button
                        onClick={handleVerificarManual}
                        disabled={verificando}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
                    >
                        {verificando ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                        Ya realicé el pago, verificar estado
                    </button>

                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 transition">
                        <LogOut size={12} /> Cerrar Sesión
                    </button>
                </div>

            </div>
        </div>
    );
};