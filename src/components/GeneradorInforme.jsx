/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentoPDF } from './DocumentoPdf';
import { FileText, Download, FolderOpen, User, RefreshCw, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useDatos } from "./context/DatosContext";

export const GeneradorInforme = ({ pacienteActual: pacienteInicial }) => {
    const { imagenes, guardarImagenGrafico } = useDatos();

    // 1. DEFINIMOS LA URL INTELIGENTE AQUÍ
    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    const [profesional] = useState(() => {
        try {
            const u = localStorage.getItem("usuario");
            if (u) {
                const user = JSON.parse(u);
                return { nombre: user.first_name ? `${user.first_name} ${user.last_name}` : user.nombre, matricula: user.matricula || "M.P." };
            }
        } catch (e) {
            console.error("Error al obtener el usuario del localStorage:", e);
        }
        return { nombre: "Profesional", matricula: "" };
    });

    const [paciente, setPaciente] = useState(pacienteInicial);
    const [listaPacientes, setListaPacientes] = useState([]);
    const [contenido, setContenido] = useState({
        motivo: "Se realiza la siguiente evaluación psicopedagógica para reevaluar el perfil cognitivo luego de periodo de tratamiento.",
        tecnicas: "- Escala de inteligencia para niños (WISC V).\n- Prolexia, Diagnóstico y Detección Temprano de la Dislexia.",
        cognitivo: "",
        lectoescritura: "",
        conclusiones: ""
    });

    useEffect(() => {
        let montado = true;
        // 2. USAMOS LA VARIABLE API_URL AQUÍ EN LUGAR DE LOCALHOST
        fetch(`${API_URL}/api/pacientes`)
            .then(r => r.json())
            .then(d => montado && setListaPacientes(d))
            .catch(console.error);

        return () => { montado = false };
    }, []);

    useEffect(() => {
        if (pacienteInicial) setPaciente(prev => (prev && prev.id === pacienteInicial.id) ? prev : pacienteInicial);
    }, [pacienteInicial]);

    const handleChange = (e) => setContenido({ ...contenido, [e.target.name]: e.target.value });
    const handlePacienteChange = (e) => {
        const p = listaPacientes.find(x => x.id === Number(e.target.value));
        if (p) setPaciente(p);
    };

    return (
        <div className="flex h-[calc(100vh-50px)] bg-gray-100 overflow-hidden">
            <div className="w-[45%] flex flex-col border-r border-gray-300 bg-white shadow-xl z-10">

                {/* --- HEADER ARREGLADO VISUALMENTE --- */}
                <div className="p-4 bg-slate-800 text-white flex flex-col gap-3 shadow-md">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="text-blue-400" size={24} />
                        <h2 className="font-bold text-xl tracking-wide">Informe</h2>
                    </div>

                    <div className="flex gap-3 items-center">
                        {/* Selector con diseño mejorado: Fondo blanco, altura fija, texto oscuro */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-slate-500" />
                            </div>
                            <select
                                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white text-slate-900 border-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer appearance-none shadow-sm"
                                onChange={handlePacienteChange}
                                value={paciente?.id || ""}
                            >
                                <option value="" disabled>Seleccionar Paciente...</option>
                                {listaPacientes.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                            </select>
                        </div>

                        {/* Botón Drive más visible */}
                        {paciente?.drive_link && (
                            <a
                                href={paciente.drive_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 font-bold shadow-md transition transform hover:scale-105"
                                title="Abrir carpeta de Drive"
                            >
                                <FolderOpen size={20} />
                                <span className="hidden xl:inline">Drive</span>
                            </a>
                        )}
                    </div>

                    <div className="text-xs text-slate-400 mt-1 pl-1">
                        Firmará: Lic. {profesional.nombre} ({profesional.matricula})
                    </div>
                </div>

                {/* --- RESTO DEL FORMULARIO --- */}
                {paciente ? (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Motivo de Consulta</label>
                            <textarea name="motivo" className="w-full h-20 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.motivo} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pruebas Administradas</label>
                            <textarea name="tecnicas" className="w-full h-20 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.tecnicas} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Funcionamiento Cognitivo</label>
                            <textarea name="cognitivo" className="w-full h-32 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.cognitivo} onChange={handleChange} />
                            {imagenes.wisc ? (
                                <div className="mt-2 flex justify-between items-center bg-blue-50 p-2 rounded border border-blue-200 shadow-sm">
                                    <span className="flex gap-2 text-blue-800 text-xs font-bold items-center"><ImageIcon size={16} /> Gráfico WISC adjuntado</span>
                                    <button onClick={() => guardarImagenGrafico('wisc', null)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                                </div>
                            ) : <div className="mt-1 text-xs text-gray-400 italic flex items-center gap-1">ℹ️ Gráfico WISC no adjuntado</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Conocimientos Lectoescritos</label>
                            <textarea name="lectoescritura" className="w-full h-32 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.lectoescritura} onChange={handleChange} />
                            {imagenes.prolexia && (
                                <div className="mt-2 flex justify-between items-center bg-green-50 p-2 rounded border border-green-200 shadow-sm">
                                    <span className="flex gap-2 text-green-800 text-xs font-bold items-center"><ImageIcon size={16} /> Gráfico PROLEXIA adjuntado</span>
                                    <button onClick={() => guardarImagenGrafico('prolexia', null)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Conclusiones</label>
                            <textarea name="conclusiones" className="w-full h-32 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.conclusiones} onChange={handleChange} />
                        </div>
                    </div>
                ) : <div className="flex-1 p-10 flex flex-col items-center justify-center text-slate-400"><User size={48} className="mb-4 opacity-30" /><p>Selecciona un paciente para comenzar.</p></div>}

                {paciente && (
                    <div className="p-4 bg-white border-t border-gray-200">
                        <PDFDownloadLink
                            document={<DocumentoPDF paciente={paciente} contenido={contenido} profesional={profesional} imagenes={imagenes} />}
                            fileName={`Informe_${paciente.last_name}.pdf`}
                        >
                            {({ loading }) => <button disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2 transition transform active:scale-95">{loading ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />} {loading ? "Generando..." : "Descargar Informe PDF"}</button>}
                        </PDFDownloadLink>
                    </div>
                )}
            </div>

            <div className="flex-1 bg-slate-600 h-full flex flex-col">
                <div className="bg-slate-900 text-gray-300 text-xs py-2 px-4 font-bold uppercase tracking-wider text-center shadow-md">Vista Previa en Tiempo Real</div>
                {paciente ? (
                    <div className="flex-1 p-4 overflow-hidden">
                        <PDFViewer className="w-full h-full rounded-lg shadow-2xl border-none"><DocumentoPDF paciente={paciente} contenido={contenido} profesional={profesional} imagenes={imagenes} /></PDFViewer>
                    </div>
                ) : <div className="flex-1 flex items-center justify-center text-gray-400 flex-col"><FileText size={64} className="opacity-20 mb-4" /><p>El documento aparecerá aquí.</p></div>}
            </div>
        </div>
    );
};