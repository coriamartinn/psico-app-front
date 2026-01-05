import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
    User,
    FileText,
    GraduationCap,
    Phone,
    Save,
    ArrowLeft,
    Calendar,
    Link as LinkIcon,
    Building,
    Edit
} from "lucide-react";
import Swal from 'sweetalert2';

export const FormularioPaciente = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Estado inicial con strings vacíos (para evitar el error en modo "Crear")
    const [datos, setDatos] = useState({
        first_name: "",
        last_name: "",
        diagnosis: "",
        school_grade: "",
        school_name: "",
        school_contact: "",
        parent_contact: "",
        drive_link: "",
        birth_date: ""
    });

    useEffect(() => {
        if (id) {
            const cargarPaciente = async () => {
                try {
                    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";
                    const token = localStorage.getItem("token");

                    const response = await fetch(`${API_URL}/api/pacientes/${id}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (response.ok) {
                        const data = await response.json();

                        // Formatear fecha para el input date (YYYY-MM-DD)
                        const fechaFormateada = data.birth_date
                            ? new Date(data.birth_date).toISOString().split('T')[0]
                            : "";

                        // --- AQUÍ ESTÁ EL ARREGLO MÁGICO ---
                        // Usamos "|| ''" para que si viene null de la BD, React reciba un string vacío
                        setDatos({
                            first_name: data.first_name || "",
                            last_name: data.last_name || "",
                            diagnosis: data.diagnosis || "",
                            school_grade: data.school_grade || "",
                            school_name: data.school_name || "",
                            school_contact: data.school_contact || "",
                            parent_contact: data.parent_contact || "",
                            drive_link: data.drive_link || "",
                            birth_date: fechaFormateada
                        });

                    } else {
                        Swal.fire('Error', 'No se pudo cargar el paciente', 'error');
                        navigate("/");
                    }
                } catch {
                    Swal.fire('Error', 'Error de conexión', 'error');
                }
            };
            cargarPaciente();
        }
    }, [id, navigate]);

    const handleChange = (e) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuarioLogueado = JSON.parse(localStorage.getItem("usuario"));
        if (!usuarioLogueado || !usuarioLogueado.id) {
            return Swal.fire({ icon: 'error', title: 'Sesión expirada', text: 'Inicia sesión nuevamente.' });
        }

        try {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
            const token = localStorage.getItem("token");

            const url = id ? `${API_URL}/api/pacientes/${id}` : `${API_URL}/api/pacientes`;
            const method = id ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...datos, user_id: usuarioLogueado.id })
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: id ? '¡Actualizado!' : '¡Guardado!',
                    text: id ? 'Datos actualizados correctamente.' : 'Paciente creado exitosamente.',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    navigate("/");
                });
            } else {
                const errorData = await response.json();
                Swal.fire({ icon: 'error', title: 'Error', text: errorData.message || "Hubo un problema." });
            }
        } catch {
            Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'Verifica tu internet.' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/" className="p-2 hover:bg-slate-200 rounded-full transition text-slate-600">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {id ? "Editar Paciente" : "Nuevo Paciente"}
                    </h1>
                    <p className="text-slate-500">
                        {id ? "Modifica los datos del expediente" : "Ingresa los datos del expediente"}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* DATOS PERSONALES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-slate-400" /></div>
                                    <input type="text" name="first_name" required placeholder="Ej: Juan" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={datos.first_name} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Apellido</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-slate-400" /></div>
                                    <input type="text" name="last_name" required placeholder="Ej: Pérez" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={datos.last_name} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* FECHA */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de Nacimiento</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Calendar size={18} className="text-slate-400" /></div>
                                <input type="date" name="birth_date" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-600" value={datos.birth_date} onChange={handleChange} />
                            </div>
                        </div>

                        {/* DIAGNÓSTICO */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Diagnóstico / Motivo</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FileText size={18} className="text-slate-400" /></div>
                                <input type="text" name="diagnosis" placeholder="Ej: Dislexia..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={datos.diagnosis} onChange={handleChange} />
                            </div>
                        </div>

                        {/* ESCOLARIDAD */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Grado Escolar</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><GraduationCap size={18} className="text-slate-400" /></div>
                                    <input type="text" name="school_grade" placeholder="Ej: 3° Grado" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={datos.school_grade} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Institución / Escuela</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Building size={18} className="text-slate-400" /></div>
                                    <input type="text" name="school_name" placeholder="Ej: Instituto French" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={datos.school_name} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Contacto escuela 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        </div>*/}

                        {/* CONTACTO */}
                        <div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Contacto de la institución</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><GraduationCap size={18} className="text-slate-400" /></div>
                                    <input type="text" name="school_contact" placeholder="Ej: 1131745876" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={datos.school_contact} onChange={handleChange} />
                                </div>
                            </div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">Contacto Padres</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={18} className="text-slate-400" /></div>
                                <input type="text" name="parent_contact" placeholder="Ej: Madre - 11 1234 5678" className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={datos.parent_contact} onChange={handleChange} />
                            </div>
                        </div>

                        {/* DRIVE */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <LinkIcon size={16} /> Link a Carpeta Drive
                            </label>
                            <input type="url" name="drive_link" placeholder="https://drive.google.com/..." className="w-full px-4 py-3 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-600" value={datos.drive_link} onChange={handleChange} />
                        </div>

                        {/* BOTÓN */}
                        <div className="pt-4 flex justify-end">
                            <button type="submit" className={`flex items-center gap-2 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 ${id ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {id ? <Edit size={20} /> : <Save size={20} />}
                                {id ? "Actualizar Paciente" : "Guardar Paciente"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};