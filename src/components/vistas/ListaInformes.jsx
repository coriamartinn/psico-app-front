import { useState, useEffect } from 'react';
import { FileText, Search, Download, Trash2, FileSignature, CheckCircle, Clock, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 👈 1. IMPORTANTE: Para navegar

export const ListaInformes = () => {
    const [informes, setInformes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [filtro, setFiltro] = useState("todos");

    const navigate = useNavigate(); // 👈 2. INICIALIZAMOS EL HOOK
    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    useEffect(() => {
        fetchInformes();
    }, []);

    const fetchInformes = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/informes`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setInformes(data);
            } else {
                console.error("Error al cargar informes");
            }
        } catch (error) {
            console.error("Error al obtener informes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerPDF = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/informes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const usuarioLogueado = JSON.parse(localStorage.getItem("usuario")) || {};
            const nombreProfesional = usuarioLogueado.first_name
                ? `${usuarioLogueado.first_name} ${usuarioLogueado.last_name}`
                : "Profesional";
            const matriculaProfesional = usuarioLogueado.matricula || "N/A";

            if (res.ok) {
                const informe = await res.json();
                const ventana = window.open('', '_blank');
                ventana.document.write(`
                    <html>
                    <head>
                        <title>Informe - ${informe.first_name} ${informe.last_name}</title>
                        <style>
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 800px; margin: auto; color: #333; }
                            h1 { color: #2d3748; border-bottom: 2px solid #805ad5; padding-bottom: 10px; margin-bottom: 20px; }
                            .header { margin-bottom: 40px; background: #f7fafc; padding: 20px; border-radius: 8px; }
                            .section { margin-bottom: 25px; }
                            h3 { color: #805ad5; margin-bottom: 8px; font-size: 1.1em; border-left: 4px solid #805ad5; padding-left: 10px; }
                            p { line-height: 1.6; text-align: justify; margin-top: 0; }
                            .firma-container { margin-top: 60px; display: flex; justify-content: flex-end; }
                            .firma-box { text-align: center; border-top: 1px solid #333; padding-top: 10px; width: 250px; }
                            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(0,0,0,0.05); z-index: -1; pointer-events: none; }
                        </style>
                    </head>
                    <body>
                        ${informe.status !== 'firmado' ? '<div class="watermark">BORRADOR</div>' : ''}
                        
                        <div class="header">
                            <h1>Informe Psicopedagógico</h1>
                            <p><strong>Paciente:</strong> ${informe.first_name} ${informe.last_name}</p>
                            <p><strong>Fecha de Emisión:</strong> ${new Date(informe.created_at).toLocaleDateString('es-AR')}</p>
                            <p><strong>Profesional:</strong> Lic. ${nombreProfesional}</p> 
                        </div>

                        <div class="section"><h3>Motivo de Consulta</h3><p>${informe.motivo || 'No especificado'}</p></div>
                        <div class="section"><h3>Técnicas Aplicadas</h3><p>${informe.tecnicas || 'No especificado'}</p></div>
                        <div class="section"><h3>Aspectos Cognitivos</h3><p>${informe.cognitivo || 'No especificado'}</p></div>
                        <div class="section"><h3>Lectoescritura</h3><p>${informe.lectoescritura || 'No especificado'}</p></div>
                        <div class="section"><h3>Conclusiones</h3><p>${informe.conclusiones || 'No especificado'}</p></div>

                        ${informe.status === 'firmado' ? `
                            <div class="firma-container">
                                <div class="firma-box">
                                    <p>Lic. ${nombreProfesional}</p>
                                    <p style="font-size: 0.8em; color: #666;">Psicopedagogia - Mat. ${matriculaProfesional}</p>
                                    <p style="font-size: 0.7em; color: green;">✔ Documento Firmado Digitalmente</p>
                                </div>
                            </div>
                        ` : ''}
                        
                        <script>setTimeout(() => { window.print(); }, 500);</script>
                    </body>
                    </html>
                `);
                ventana.document.close();
            } else {
                alert("No se pudo cargar el detalle del informe.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al cargar el documento");
        }
    };

    const handleFirmar = async (id) => {
        if (!confirm("¿Deseas firmar digitalmente este documento? Una vez firmado, no podrás editarlo.")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/informes/${id}/firmar`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setInformes(prev => prev.map(inf =>
                    inf.id === id ? { ...inf, firmado: true } : inf
                ));
            } else {
                alert("Error al firmar.");
            }
        } catch (error) {
            console.error("Error de conexión", error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este informe?")) return;
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
                        <FileText className="text-purple-600" /> Historial de Informes
                    </h1>
                    <p className="text-slate-500 mt-1">Gestiona, firma y descarga los documentos generados.</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
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
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['todos', 'firmados', 'pendientes'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFiltro(f)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${filtro === f ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

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
                                <th className="p-4 font-bold border-b border-slate-100">Fecha</th>
                                <th className="p-4 font-bold border-b border-slate-100">Estado</th>
                                <th className="p-4 font-bold border-b border-slate-100 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {informesFiltrados.map((inf) => (
                                <tr key={inf.id} className="hover:bg-slate-50 transition">
                                    <td className="p-4 font-bold text-slate-700">{inf.paciente}</td>
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

                                        {/* 👇 AQUÍ ESTÁ EL BOTÓN DE EDITAR QUE FALTABA */}
                                        {!inf.firmado && (
                                            <button
                                                onClick={() => navigate(`/informes/editar/${inf.id}`)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                                title="Editar Informe"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}

                                        {!inf.firmado && (
                                            <button
                                                onClick={() => handleFirmar(inf.id)}
                                                className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition"
                                                title="Firmar documento"
                                            >
                                                <FileSignature size={18} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleVerPDF(inf.id)}
                                            className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition"
                                            title="Ver e Imprimir PDF"
                                        >
                                            <Eye size={18} />
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