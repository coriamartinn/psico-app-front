import { useState, useEffect } from 'react';
import { Save, Download, FileText, User } from 'lucide-react';

export const NuevoInforme = () => {
    const [pacientes, setPacientes] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    // Estados del formulario
    const [selectedPatient, setSelectedPatient] = useState("");
    const [formData, setFormData] = useState({
        motivo: "",
        tecnicas: "Escala de inteligencia para niños (WISC V).\nProlexia, Diagnóstico y Detección Temprano de la Dislexia.",
        cognitivo: "",
        lectoescritura: "",
        conclusiones: ""
    });

    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    // 1. Cargar lista de pacientes al iniciar
    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/pacientes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPacientes(data);
                }
            } catch (error) {
                console.error("Error cargando pacientes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPacientes();
    }, []);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. FUNCIÓN PARA GUARDAR EN LA BD
    const handleGuardar = async () => {
        if (!selectedPatient) return alert("Por favor selecciona un paciente");

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
                    paciente_id: selectedPatient,
                    ...formData
                })
            });

            if (res.ok) {
                alert("¡Informe guardado en el historial correctamente!");
                // Opcional: Redirigir al historial o limpiar formulario
            } else {
                alert("Error al guardar el informe");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setGuardando(false);
        }
    };

    // Función para imprimir/descargar PDF (ya la tenías, la mantenemos simple)
    const handleDescargar = () => {
        window.print();
    };

    // Encontrar nombre del paciente seleccionado para la vista previa
    const pacienteNombre = pacientes.find(p => p.id === parseInt(selectedPatient))
        ? `${pacientes.find(p => p.id === parseInt(selectedPatient)).first_name} ${pacientes.find(p => p.id === parseInt(selectedPatient)).last_name}`
        : "Nombre del Paciente";

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">

            {/* LADO IZQUIERDO: EDITOR */}
            <div className="w-full lg:w-1/2 p-6 overflow-y-auto bg-white border-r border-gray-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FileText className="text-purple-600" /> Redacción de Informe
                </h2>

                <div className="space-y-6">
                    {/* Selector de Paciente */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar Paciente</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <select
                                value={selectedPatient}
                                onChange={(e) => setSelectedPatient(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none appearance-none bg-white"
                            >
                                <option value="">-- Elige un paciente --</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Campos de Texto */}
                    {[
                        { label: "1. Motivo de Consulta", name: "motivo", rows: 3 },
                        { label: "2. Técnicas Administradas", name: "tecnicas", rows: 4 },
                        { label: "3. Funcionamiento Cognitivo", name: "cognitivo", rows: 6 },
                        { label: "4. Habilidades Lectoescritas", name: "lectoescritura", rows: 5 },
                        { label: "5. Conclusiones y Orientaciones", name: "conclusiones", rows: 5 },
                    ].map((campo) => (
                        <div key={campo.name}>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wide">
                                {campo.label}
                            </label>
                            <textarea
                                name={campo.name}
                                value={formData[campo.name]}
                                onChange={handleChange}
                                rows={campo.rows}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-700 text-sm bg-slate-50 resize-none"
                                placeholder={`Escribe aquí el contenido de ${campo.label.toLowerCase()}...`}
                            />
                        </div>
                    ))}
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="mt-8 flex gap-4 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
                    <button
                        onClick={handleGuardar}
                        disabled={guardando}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        {guardando ? "Guardando..." : "Guardar en Historial"}
                    </button>

                    <button
                        onClick={handleDescargar}
                        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-xl font-bold border border-blue-200 transition flex items-center justify-center gap-2"
                    >
                        <Download size={20} />
                        Descargar PDF
                    </button>
                </div>
            </div>

            {/* LADO DERECHO: VISTA PREVIA (Papel) */}
            <div className="hidden lg:block w-1/2 p-8 bg-slate-800 overflow-y-auto flex justify-center">
                <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] p-12 shadow-2xl rounded-sm text-slate-800 text-sm leading-relaxed" id="informe-preview">

                    {/* Encabezado del Papel */}
                    <div className="border-b-2 border-slate-800 pb-4 mb-8">
                        <h1 className="text-2xl font-bold text-center uppercase tracking-widest">Informe Psicopedagógico</h1>
                        <div className="mt-4 flex justify-between text-xs text-slate-500">
                            <span>Paciente: <strong className="text-slate-800 text-base">{pacienteNombre}</strong></span>
                            <span>Fecha: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Contenido Dinámico */}
                    <div className="space-y-6">
                        {formData.motivo && (
                            <div>
                                <h3 className="font-bold bg-slate-100 p-1 mb-2">1. MOTIVO DE CONSULTA</h3>
                                <p className="whitespace-pre-wrap">{formData.motivo}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="font-bold bg-slate-100 p-1 mb-2">2. TÉCNICAS ADMINISTRADAS</h3>
                            <p className="whitespace-pre-wrap">{formData.tecnicas}</p>
                        </div>

                        {formData.cognitivo && (
                            <div>
                                <h3 className="font-bold bg-slate-100 p-1 mb-2">3. FUNCIONAMIENTO COGNITIVO</h3>
                                <p className="whitespace-pre-wrap">{formData.cognitivo}</p>
                            </div>
                        )}

                        {formData.lectoescritura && (
                            <div>
                                <h3 className="font-bold bg-slate-100 p-1 mb-2">4. HABILIDADES LECTOESCRITAS</h3>
                                <p className="whitespace-pre-wrap">{formData.lectoescritura}</p>
                            </div>
                        )}

                        {formData.conclusiones && (
                            <div>
                                <h3 className="font-bold bg-slate-100 p-1 mb-2">5. CONCLUSIONES Y ORIENTACIONES</h3>
                                <p className="whitespace-pre-wrap">{formData.conclusiones}</p>
                            </div>
                        )}
                    </div>

                    {/* Pie de Página (Firma) */}
                    <div className="mt-20 flex justify-end">
                        <div className="text-center border-t border-slate-800 pt-2 w-48">
                            <p className="font-bold">Lic. Martín Coria</p>
                            <p className="text-xs text-slate-500">Psicopedagogo - Mat. 1234</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};