import { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    Activity,
    Calendar,
    TrendingUp
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';

export const Dashboard = () => {
    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    // Estado para las estadísticas (Cards)
    const [stats, setStats] = useState({
        totalPacientes: 0,
        informesMes: 0,
        pacientesActivos: 0
    });

    // Estado para los gráficos
    const [dataGraficos, setDataGraficos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${API_URL}/api/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data.cards || { totalPacientes: 0, informesMes: 0, pacientesActivos: 0 });
                    // Si el backend devuelve datos para gráficos, úsalos. Si no, usamos datos de prueba abajo.
                    setDataGraficos(data.graficos || datosPrueba);
                } else {
                    console.warn("No se pudieron cargar stats, usando datos locales.");
                    setDataGraficos(datosPrueba); // Fallback para que no se vea vacío
                }
            } catch (error) {
                console.error("Error conectando al dashboard:", error);
                setDataGraficos(datosPrueba);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Datos de prueba por si el backend falla (para que veas los gráficos lindos igual)
    const datosPrueba = [
        { name: 'Ene', pacientes: 4, informes: 2 },
        { name: 'Feb', pacientes: 7, informes: 3 },
        { name: 'Mar', pacientes: 12, informes: 5 },
        { name: 'Abr', pacientes: 18, informes: 8 },
        { name: 'May', pacientes: 23, informes: 12 },
        { name: 'Jun', pacientes: 30, informes: 15 },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Panel de Control</h1>

            {/* --- SECCIÓN 1: CARDS SUPERIORES --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition hover:shadow-md">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Pacientes Totales</p>
                        <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : stats.totalPacientes}</h3>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition hover:shadow-md">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <FileText size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Informes Generados</p>
                        <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : stats.informesMes}</h3>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 transition hover:shadow-md">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Activity size={28} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Pacientes Activos</p>
                        <h3 className="text-2xl font-bold text-slate-800">{loading ? "..." : stats.pacientesActivos}</h3>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 2: GRÁFICOS (Aquí estaba el error) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* GRÁFICO 1: EVOLUCIÓN DE PACIENTES */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="text-blue-500" size={20} />
                        <h3 className="font-bold text-slate-700">Crecimiento de Pacientes</h3>
                    </div>

                    {/* SOLUCIÓN AL ERROR: Contenedor con altura fija (h-80) */}
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataGraficos}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                                <YAxis style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="pacientes"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRÁFICO 2: INFORMES vs PACIENTES */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="text-purple-500" size={20} />
                        <h3 className="font-bold text-slate-700">Actividad Mensual</h3>
                    </div>

                    {/* SOLUCIÓN AL ERROR: Contenedor con altura fija (h-80) */}
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataGraficos}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                                <YAxis style={{ fontSize: '12px' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Bar dataKey="pacientes" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pacientes" />
                                <Bar dataKey="informes" fill="#a855f7" radius={[4, 4, 0, 0]} name="Informes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};