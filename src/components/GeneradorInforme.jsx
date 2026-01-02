/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { DocumentoPDF } from './DocumentoPdf';
import { FileText, Download, FolderOpen, User, RefreshCw, Image as ImageIcon, Trash2, Save } from 'lucide-react';
import { useDatos } from "./context/DatosContext";

export const GeneradorInforme = ({ pacienteActual: pacienteInicial }) => {
    const { imagenes, guardarImagenGrafico } = useDatos();
    const [guardando, setGuardando] = useState(false); // Estado para el loading del guardado

    // URL Inteligente
    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    // Estado del profesional (recuperado del localStorage)
    const [profesional] = useState(() => {
        try {
            const u = localStorage.getItem("usuario");
            if (u) {
                const user = JSON.parse(u);
                return {
                    nombre: user.first_name ? `${user.first_name} ${user.last_name}` : user.nombre,
                    matricula: user.matricula || "M.P. (Sin especificar)"
                };
            }
        } catch (e) {
            console.error("Error al obtener usuario:", e);
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

    // Carga de pacientes desde el Backend
    useEffect(() => {
        let montado = true;
        const token = localStorage.getItem('token');

        if (!token) return;

        fetch(`${API_URL}/api/pacientes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(r => r.json())
            .then(d => {
                if (montado) {
                    if (Array.isArray(d)) {
                        setListaPacientes(d);
                    } else {
                        console.error("La API no devolvió un array:", d);
                        setListaPacientes([]);
                    }
                }
            })
            .catch(err => console.error("Error fetching pacientes:", err));

        return () => { montado = false };
    }, []);

    // Actualizar paciente si cambia la prop inicial
    useEffect(() => {
        if (pacienteInicial) {
            setPaciente(prev => (prev && prev.id === pacienteInicial.id) ? prev : pacienteInicial);
        }
    }, [pacienteInicial]);

    const handleChange = (e) => setContenido({ ...contenido, [e.target.name]: e.target.value });

    const handlePacienteChange = (e) => {
        const p = listaPacientes.find(x => x.id === Number(e.target.value));
        if (p) setPaciente(p);
    };

    // --- NUEVA FUNCIÓN: GUARDAR EN BASE DE DATOS ---
    const handleGuardar = async () => {
        if (!paciente) return alert("Por favor selecciona un paciente primero.");

        setGuardando(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/informes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    paciente_id: paciente.id,
                    motivo: contenido.motivo,
                    tecnicas: contenido.tecnicas,
                    cognitivo: contenido.cognitivo,
                    lectoescritura: contenido.lectoescritura,
                    conclusiones: contenido.conclusiones
                    // Nota: Si quieres guardar las imágenes en la BD, deberías procesarlas aquí también,
                    // pero usualmente se guardan solo las referencias o texto.
                })
            });

            if (res.ok) {
                alert("¡Informe guardado exitosamente en el Historial!");
                // Opcional: Podrías limpiar el formulario aquí si quisieras
            } else {
                const errorData = await res.json();
                alert("Error al guardar: " + (errorData.message || "Error desconocido"));
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error de conexión al intentar guardar.");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-50px)] bg-gray-100 overflow-hidden">
            {/* --- PANEL IZQUIERDO: EDITOR --- */}
            <div className="w-full md:w-[45%] flex flex-col border-r border-gray-300 bg-white shadow-xl z-10">

                {/* Header del Editor */}
                <div className="p-4 bg-slate-800 text-white flex flex-col gap-3 shadow-md">
                    <div className="flex items-center gap-2 mb-1">
                        <FileText className="text-blue-400" size={24} />
                        <h2 className="font-bold text-xl tracking-wide">Redacción de Informe</h2>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User size={18} className="text-slate-500" />
                            </div>
                            <select
                                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white text-slate-900 border-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer shadow-sm text-sm"
                                onChange={handlePacienteChange}
                                value={paciente?.id || ""}
                            >
                                <option value="" disabled>Seleccionar Paciente...</option>
                                {listaPacientes.map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                            </select>
                        </div>

                        {paciente?.drive_link && (
                            <a
                                href={paciente.drive_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-10 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 font-bold shadow-md transition hover:scale-105"
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

                {/* Formulario */}
                {paciente ? (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Motivo de Consulta</label>
                            <textarea name="motivo" className="w-full h-24 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.motivo} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pruebas Administradas</label>
                            <textarea name="tecnicas" className="w-full h-24 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.tecnicas} onChange={handleChange} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Funcionamiento Cognitivo</label>
                            <textarea name="cognitivo" className="w-full h-32 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.cognitivo} onChange={handleChange} />

                            {/* Control de Gráfico WISC */}
                            {imagenes.wisc ? (
                                <div className="mt-2 flex justify-between items-center bg-blue-50 p-2 rounded border border-blue-200 shadow-sm">
                                    <span className="flex gap-2 text-blue-800 text-xs font-bold items-center"><ImageIcon size={16} /> Gráfico WISC adjuntado</span>
                                    <button onClick={() => guardarImagenGrafico('wisc', null)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"><Trash2 size={16} /></button>
                                </div>
                            ) : (
                                <div className="mt-1 text-xs text-gray-400 italic flex items-center gap-1 pl-1">
                                    <span className="w-2 h-2 rounded-full bg-gray-300"></span> Gráfico WISC no adjuntado
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Conocimientos Lectoescritos</label>
                            <textarea name="lectoescritura" className="w-full h-32 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.lectoescritura} onChange={handleChange} />

                            {/* Control de Gráfico PROLEXIA */}
                            {imagenes.prolexia && (
                                <div className="mt-2 flex justify-between items-center bg-green-50 p-2 rounded border border-green-200 shadow-sm">
                                    <span className="flex gap-2 text-green-800 text-xs font-bold items-center"><ImageIcon size={16} /> Gráfico PROLEXIA adjuntado</span>
                                    <button onClick={() => guardarImagenGrafico('prolexia', null)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"><Trash2 size={16} /></button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Conclusiones</label>
                            <textarea name="conclusiones" className="w-full h-32 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none shadow-sm" value={contenido.conclusiones} onChange={handleChange} />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 p-10 flex flex-col items-center justify-center text-slate-400">
                        <User size={64} className="mb-4 opacity-20" />
                        <p className="font-medium">Selecciona un paciente para comenzar a redactar.</p>
                    </div>
                )}

                {/* Footer con Botones de Acción */}
                {paciente && (
                    <div className="p-4 bg-white border-t border-gray-200 z-20 flex gap-3 flex-col sm:flex-row">

                        {/* BOTÓN GUARDAR */}
                        <button
                            onClick={handleGuardar}
                            disabled={guardando}
                            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {guardando ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            {guardando ? "Guardando..." : "Guardar en Historial"}
                        </button>

                        {/* BOTÓN DESCARGAR (PDF) */}
                        <PDFDownloadLink
                            document={<DocumentoPDF paciente={paciente} contenido={contenido} profesional={profesional} imagenes={imagenes} />}
                            fileName={`Informe_${paciente.last_name}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`}
                            className="flex-1"
                        >
                            {({ loading }) => (
                                <button disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
                                    {loading ? "Generando PDF..." : "Descargar PDF"}
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>
                )}
            </div>

            {/* --- PANEL DERECHO: VISTA PREVIA --- */}
            <div className="hidden md:flex flex-1 bg-slate-700 h-full flex-col">
                <div className="bg-slate-900 text-gray-300 text-xs py-2 px-4 font-bold uppercase tracking-wider text-center shadow-md">
                    Vista Previa en Tiempo Real
                </div>
                {paciente ? (
                    <div className="flex-1 p-8 overflow-hidden flex items-center justify-center bg-slate-600">
                        <PDFViewer className="w-full h-full rounded-md shadow-2xl border border-slate-500" showToolbar={true}>
                            <DocumentoPDF paciente={paciente} contenido={contenido} profesional={profesional} imagenes={imagenes} />
                        </PDFViewer>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 flex-col opacity-50">
                        <FileText size={80} className="mb-4" />
                        <p>El documento aparecerá aquí cuando selecciones un paciente.</p>
                    </div>
                )}
            </div>
        </div>
    );
};