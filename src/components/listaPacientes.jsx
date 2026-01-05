import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus, BarChart3, Trash2, Edit } from "lucide-react";
import { BotonDrive } from "./BotonDrive";
import Swal from 'sweetalert2';

export const ListaPacientes = ({ setPacienteSeleccionado }) => {
    const [pacientes, setPacientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");

    // 1. DEFINIMOS LA URL UNA SOLA VEZ AL PRINCIPIO
    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    const cargarPacientes = async () => {
        try {
            const token = localStorage.getItem("token");

            // Si no hay token, no intentamos cargar nada (evita errores 401 innecesarios)
            if (!token) return;

            const response = await fetch(`${API_URL}/api/pacientes`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Error al conectar con el servidor");
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setPacientes(data);
                setError("");
            } else {
                setError("Error: El servidor envió datos incorrectos.");
            }

        } catch {
            setError("No se pudo conectar con el Backend.");
        }
    };

    useEffect(() => {
        cargarPacientes();
    }, []);

    const eliminarPaciente = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás segura?',
            text: "No podrás revertir esto. Se borrará el paciente y sus datos.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");

                // 2. USAMOS LA MISMA URL CORRECTA AQUÍ
                const res = await fetch(`${API_URL}/api/pacientes/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.ok) {
                    setPacientes(prev => prev.filter((p) => p.id !== id));
                    Swal.fire('¡Eliminado!', 'El paciente ha sido eliminado.', 'success');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el paciente.', 'error');
                }
            } catch {
                Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
            }
        }
    };

    // ... (El resto de tu código: filtros, Toast y Return están perfectos)

    const pacientesFiltrados = pacientes.filter((p) =>
        p.first_name?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.last_name?.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.school_name?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    return (
        // ... (Tu JSX está perfecto, no hace falta cambiarlo)
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* ... Resto del JSX ... */}
            {/* Solo asegúrate de copiar todo el return que ya tenías */}
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
                {/* ENCABEZADO */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Mis Pacientes</h1>
                        <p className="text-gray-500 text-sm">Gestiona expedientes, gráficos e informes</p>
                    </div>
                    <Link to="/crear" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition shadow-md hover:shadow-lg">
                        <UserPlus size={20} />
                        Nuevo Paciente
                    </Link>
                </div>

                {/* BARRA DE BÚSQUEDA */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, apellido o escuela..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 text-center font-medium border-b border-red-100">
                        {error}
                    </div>
                )}

                {/* TABLA */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-gray-200 bg-gray-50 text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Paciente</th>
                                <th className="px-6 py-4">Diagnóstico</th>
                                <th className="px-6 py-4">Escolaridad</th>
                                <th className="px-6 py-4 text-center">Carpeta</th>
                                <th className="px-6 py-4 text-center">Contacto Padres</th>
                                <th className="px-6 py-4 text-center">Contacto escuela</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pacientesFiltrados?.map((paciente) => (
                                <tr key={paciente.id} className="hover:bg-blue-50 transition-colors duration-150">

                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-800 text-base">
                                            {paciente.first_name} {paciente.last_name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {paciente.birth_date ? new Date(paciente.birth_date).toLocaleDateString() : "Sin fecha nac."}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                                            {paciente.diagnosis || "En proceso de evaluación..."}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="text-gray-800 font-medium">
                                            {paciente.school_grade || "-"}
                                        </div>
                                        <div className="text-xs text-gray-500 italic">
                                            {paciente.school_name || "Sin escuela"}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-center flex justify-center">
                                        <BotonDrive url={paciente.drive_link} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-gray-800 font-medium">
                                            {paciente.parent_contact || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-gray-800 font-medium">
                                            {paciente.school_contact || "-"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-3 items-center">

                                            {/* 1. SELECCIONAR (GRAFICOS) */}
                                            <Link
                                                to="/graficos"
                                                onClick={() => {
                                                    setPacienteSeleccionado(paciente);
                                                    Toast.fire({
                                                        icon: 'success',
                                                        title: `Paciente ${paciente.first_name} seleccionado`
                                                    });
                                                }}
                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                                                title="Ver Gráficos e Informes"
                                            >
                                                <BarChart3 size={16} />
                                                Seleccionar
                                            </Link>

                                            <div className="h-4 w-px bg-gray-300 mx-1"></div>

                                            {/* 2. EDITAR (NUEVO BOTÓN) */}
                                            <Link
                                                to={`/editar/${paciente.id}`}
                                                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                                                title="Editar Datos"
                                            >
                                                <Edit size={18} />
                                            </Link>

                                            {/* 3. ELIMINAR */}
                                            <button
                                                onClick={() => eliminarPaciente(paciente.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                                                title="Eliminar Paciente"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pacientesFiltrados.length === 0 && !error && (
                        <div className="text-center py-12">
                            <div className="text-gray-300 mb-3">
                                <Search size={48} className="mx-auto" />
                            </div>
                            <p className="text-gray-500 font-medium">No se encontraron pacientes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};