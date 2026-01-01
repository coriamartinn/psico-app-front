import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users, School, FileText,
    PlusCircle, Activity, Brain, Clock,
    FileSignature, ArrowRight
} from "lucide-react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

export const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState({ nombre: "Profesional" });

    // Paleta de colores "Calma Clínica"
    const COLORS_PIE = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    const COLOR_BAR = '#6366f1';

    useEffect(() => {
        // Recuperar nombre del usuario para el saludo
        const userStorage = localStorage.getItem("usuario");
        if (userStorage) {
            const u = JSON.parse(userStorage);
            setUsuario({ nombre: u.first_name || u.nombre || "Profesional" });
        }

        const fetchStats = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";
                const token = localStorage.getItem("token");

                const res = await fetch(`${API_URL}/api/dashboard/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch {
                console.error("Error cargando dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getFechaHoy = () => {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('es-AR', opciones);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-sans">

            {/* HEADER */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">{getFechaHoy()}</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800">
                        Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">{usuario.nombre}</span> 👋
                    </h1>
                    <p className="text-slate-500 mt-2">Aquí tienes el resumen de tu consultorio hoy.</p>
                </div>
                <Link to="/crear" className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-slate-300/50 flex items-center gap-2 transition transform hover:-translate-y-1">
                    <PlusCircle size={20} /> Nuevo Paciente
                </Link>
            </div>

            {/* TARJETAS KPI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

                {/* Pacientes Activos */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase">Pacientes Activos</p>
                            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats?.totalPacientes || 0}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={24} /></div>
                    </div>
                    <div className="mt-4 text-xs text-green-600 font-bold bg-green-50 w-fit px-2 py-1 rounded">+2 este mes</div>
                </div>

                {/* Instituciones */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase">Instituciones</p>
                            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats?.totalEscuelas || 0}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><School size={24} /></div>
                    </div>
                    <p className="mt-4 text-xs text-slate-400">Escuelas vinculadas</p>
                </div>

                {/* Informes (Dinámico) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase">Informes Generados</p>
                            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{stats?.totalInformes || 0}</h3>
                        </div>
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><FileText size={24} /></div>
                    </div>
                    <div>
                        <p className={`text-xs font-bold mb-3 ${(stats?.informesPendientes || 0) > 0 ? "text-orange-500" : "text-green-500"}`}>
                            {stats?.informesPendientes || 0} pendientes de firma
                        </p>
                        <div className="flex gap-2">
                            <Link to="/lista-informes" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 px-2 rounded-lg font-bold text-center transition flex justify-center items-center gap-1">
                                Ver Historial
                            </Link>
                            {(stats?.informesPendientes || 0) > 0 && (
                                <Link to="/lista-informes?filter=pendientes" className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs py-2 px-2 rounded-lg font-bold text-center transition flex justify-center items-center gap-1">
                                    <FileSignature size={14} /> Firmar
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Próximo Turno */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg shadow-purple-200 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-purple-200 text-xs font-bold uppercase mb-1">Próxima Sesión</p>
                        <h3 className="text-xl font-bold">16:00 hs</h3>
                        <p className="text-white/90 text-sm mt-1">Martín Coria (TDAH)</p>
                    </div>
                    <div className="relative z-10 mt-4">
                        <Link to="/calendario" className="bg-white/20 hover:bg-white/30 text-white text-xs py-2 px-3 rounded-lg backdrop-blur-sm transition flex items-center w-fit gap-2">
                            Ver Agenda <ArrowRight size={14} />
                        </Link>
                    </div>
                    <Clock className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32" />
                </div>
            </div>

            {/* SECCIÓN GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* GRÁFICO COMBINADO (Solución al error width -1) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2">
                            <Brain size={20} className="text-purple-500" /> Distribución Clínica
                        </h3>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Torta */}
                        <div className="flex-1 h-64 w-full min-h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats?.distribucionDiagnosticos} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="cantidad" nameKey="diagnosis">
                                        {stats?.distribucionDiagnosticos?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Barras */}
                        <div className="flex-1 h-64 w-full min-h-[250px] border-l border-slate-100 pl-0 md:pl-6 pt-6 md:pt-0">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 text-center">Nivel Escolar</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats?.distribucionEscolaridad}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="school_grade" tick={{ fontSize: 10 }} interval={0} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="cantidad" fill={COLOR_BAR} radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA */}
                <div className="space-y-6">
                    {/* Recientes */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-700 mb-4 text-sm flex items-center gap-2">
                            <Activity size={18} className="text-green-500" /> Recientemente Agregados
                        </h3>
                        <div className="space-y-4">
                            {stats?.pacientesRecientes?.length > 0 ? (
                                stats.pacientesRecientes.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition cursor-default">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {p.first_name[0]}{p.last_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{p.first_name} {p.last_name}</p>
                                            <p className="text-xs text-slate-400">{p.diagnosis || "Sin diagnóstico"}</p>
                                        </div>
                                    </div>
                                ))
                            ) : <p className="text-xs text-slate-400">No hay pacientes recientes.</p>}
                        </div>
                        <Link to="/pacientes" className="block text-center text-xs font-bold text-purple-600 mt-4 hover:underline">Ver todos los pacientes</Link>
                    </div>

                    {/* Herramientas */}
                    <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
                        <h3 className="font-bold text-teal-800 mb-2">Herramientas</h3>
                        <p className="text-xs text-teal-600 mb-4">Acceso rápido a utilidades de sesión.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/herramientas" className="bg-white py-2 px-3 rounded-lg text-xs font-bold text-teal-700 shadow-sm text-center hover:shadow-md transition">🎨 Pizarra</Link>
                            <Link to="/herramientas" className="bg-white py-2 px-3 rounded-lg text-xs font-bold text-teal-700 shadow-sm text-center hover:shadow-md transition">🧘 Respiración</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};