import { useState, useEffect } from 'react';
import { FileText, Search, Download, Trash2, FileSignature, CheckCircle, Clock } from 'lucide-react';

export const ListaInformes = () => {
    const [informes, setInformes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("todos"); // 'todos', 'firmados', 'pendientes'

    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    // Cargar informes desde la API
    useEffect(() => {
        fetchInformes();
    }, []);

    const fetchInformes = async () => {
        try {
            const token = localStorage.getItem("token");
            // Asumo que tienes una ruta /api/informes. Si no, ajusta esta URL
            const res = await fetch(`${API_URL}/api/informes`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setInformes(data);
            } else {
                // Mock data temporal si no hay backend aún para esto
                setInformes([
                    { id: 1, paciente: "Martín Coria", fecha: "2024-03-10", tipo: "Evaluación WISC-V", firmado: true },
                    { id: 2, paciente: "Lucía Gomez", fecha: "2024-03-12", tipo: "Informe Evolutivo", firmado: false },
                    { id: 3, paciente: "Pedro Almodovar", fecha: "2024-03-15", tipo: "Alta Clínica", firmado: false },
                ]);
            }
        } catch (error) {
            console.error("Error al obtener informes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFirmar = async (id) => {
        if (!confirm("¿Deseas firmar digitalmente este documento?")) return;

        try {
            const token = localStorage.getItem("token");
            // Aquí llamarías a tu endpoint PUT /api/informes/:id/firmar
            const res = await fetch(`${API_URL}/api/informes/${id}/firmar`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                // Actualizar estado localmente
                setInformes(prev => prev.map(inf =>
                    inf.id === id ? { ...inf, firmado: true } : inf
                ));
            } else {
                alert("Error al firmar. Intenta nuevamente.");
            }
        } catch (error) {
            console.error("Error de conexión", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este informe? Esta acción no se puede deshacer.")) return;

        try {
            const token = localStorage.getItem("token");
            await fetch(`${API_URL}/api/informes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setInformes(prev => prev.filter(inf => inf.id !== id));
        } catch (error) {
            console.error("Error al eliminar", error);
        }
    };

    // Filtrado lógico
    const informesFiltrados = informes.filter(inf => {
        const coincideBusqueda = inf.paciente.toLowerCase().includes(busqueda.toLowerCase());
        const coincideFiltro =
            filtro === "todos" ? true :
                filtro === "firmados" ? inf.firmado :
                    filtro === "pendientes" ? !inf.firmado : true;

        return coincideBusqueda && coincideFiltro;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
                        <FileText className="text-purple-600" /> Historial de Informes
                    </h1>
                    <p className="text-slate-500 mt-1">Gestiona, firma y descarga los documentos generados.</p>
                </div>
            </div>

            {/* Barra de Herramientas */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Buscador */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por paciente..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-700"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>

                {/* Filtros */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['todos', 'firmados', 'pendientes'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${filtro === f
                                    ? 'bg-white text-purple-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista de Informes */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-slate-400">Cargando informes...</div>
                ) : informesFiltrados.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center gap-2 text-slate-400">
                        <FileText size={40} className="opacity-20" />
                        <p>No se encontraron informes con esos criterios.</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold border-b border-slate-100">Paciente</th>
                                <th className="p-4 font-bold border-b border-slate-100">Tipo de Informe</th>
                                <th className="p-4 font-bold border-b border-slate-100">Fecha</th>
                                <th className="p-4 font-bold border-b border-slate-100">Estado</th>
                                <th className="p-4 font-bold border-b border-slate-100 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {informesFiltrados.map((inf) => (
                                <tr key={inf.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-bold text-slate-700">{inf.paciente}</td>
                                    <td className="p-4 text-sm text-slate-600">{inf.tipo}</td>
                                    <td className="p-4 text-sm text-slate-500">{inf.fecha}</td>
                                    <td className="p-4">
                                        {inf.firmado ? (
                                            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold border border-green-100">
                                                <CheckCircle size={12} /> Firmado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-bold border border-orange-100">
                                                <Clock size={12} /> Pendiente
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 flex justify-end gap-2">
                                        {!inf.firmado && (
                                            <button
                                                onClick={() => handleFirmar(inf.id)}
                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition"
                                                title="Firmar documento"
                                            >
                                                <FileSignature size={18} />
                                            </button>
                                        )}
                                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Descargar PDF">
                                            <Download size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(inf.id)}
                                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};