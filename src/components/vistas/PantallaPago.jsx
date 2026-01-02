import { useState, useEffect } from "react";
import { CreditCard, RefreshCw, LogOut, CheckCircle, Loader2 } from "lucide-react";

export const PantallaPago = () => {
    const [loading, setLoading] = useState(false);
    const [verificando, setVerificando] = useState(false);

    // URL del Backend
    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    // --- 1. AUTODETECCIÓN (POLLING) ---
    // Este efecto se ejecuta automáticamente cada 5 segundos para ver si el pago entró
    useEffect(() => {
        const intervalo = setInterval(() => {
            checkPaymentStatus();
        }, 5000); // 5000 ms = 5 segundos

        // Limpieza: detener el reloj si el usuario sale de la pantalla
        return () => clearInterval(intervalo);
    }, []);

    // Función que consulta el estado sin molestar al usuario
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

                // ¡MAGIA AQUÍ! Si el backend dice que ya pagó...
                if (usuarioActualizado.is_paid === 1) {
                    console.log("Pago detectado automáticamente!");

                    // 1. Actualizamos el usuario en el navegador
                    localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

                    // 2. Recargamos la página para que el Router te deje pasar
                    window.location.reload();
                }
            }
        } catch (error) {
            // Si falla la conexión silenciosa, no mostramos error para no asustar
            console.log("Esperando pago...", error);
        }
    };

    // --- 2. INICIAR PAGO (Genera Link) ---
    const handlePagar = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/pagos/crear-orden`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.init_point) {
                window.location.href = data.init_point;
            }
        } catch (error) {
            console.error("Error al generar pago:", error);
            alert("Error al conectar con Mercado Pago");
        } finally {
            setLoading(false);
        }
    };

    // --- 3. VERIFICACIÓN MANUAL (Botón) ---
    const handleVerificarManual = async () => {
        setVerificando(true);
        await checkPaymentStatus(); // Reutilizamos la misma lógica

        // Si llegamos acá y no recargó la página, es que todavía no impactó
        setTimeout(() => {
            setVerificando(false);
            // Solo mostramos alerta en el manual, no en el automático
            const usuario = JSON.parse(localStorage.getItem("usuario"));
            if (usuario.is_paid === 0) {
                alert("Aún no detectamos el pago. Espera unos segundos más.");
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
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-12 scale-150"></div>

                    <div className="relative z-10">
                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm shadow-inner">
                            <CreditCard className="text-white" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-white mt-4">Suscripción Requerida</h1>
                        <p className="text-purple-100 text-sm mt-2">
                            Acceso completo a PsicoApp
                        </p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-800">Plan Profesional</h3>
                        <p className="text-4xl font-extrabold text-purple-600">$15.000 <span className="text-sm text-slate-400 font-normal">/ único</span></p>
                        <ul className="text-slate-500 text-sm text-left space-y-2 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-green-500" /> Informes Ilimitados</li>
                            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-green-500" /> Firma Digital Automática</li>
                            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-green-500" /> Soporte Prioritario</li>
                        </ul>
                    </div>

                    <div className="space-y-3 pt-4">
                        <button
                            onClick={handlePagar}
                            disabled={loading}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition shadow-lg hover:shadow-purple-500/30 flex justify-center items-center gap-2 transform active:scale-95"
                        >
                            {loading ? "Cargando..." : "Pagar con Mercado Pago"}
                        </button>

                        <button
                            onClick={handleVerificarManual}
                            disabled={verificando}
                            className="w-full py-3 bg-white border-2 border-purple-100 text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition flex justify-center items-center gap-2"
                        >
                            {verificando ? <Loader2 className="animate-spin" size={20} /> : "Verificar estado del pago"}
                        </button>

                        {/* Mensaje de espera */}
                        <div className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-2">
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Buscando confirmación automáticamente...</span>
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