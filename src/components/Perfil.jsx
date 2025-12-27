import { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, Key, AlertCircle, CheckCircle } from 'lucide-react';

export const Perfil = () => {
    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    const [usuario, setUsuario] = useState({
        first_name: '',
        last_name: '',
        email: '',
        matricula: ''
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    });

    const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
    const [loading, setLoading] = useState(false);

    // Cargar datos al montar
    useEffect(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUsuario({
                first_name: parsedUser.first_name || '',
                last_name: parsedUser.last_name || '',
                email: parsedUser.email || '',
                matricula: parsedUser.matricula || ''
            });
        }
    }, []);

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ tipo: '', texto: '' });

        const token = localStorage.getItem('token');
        if (!token) {
            setMensaje({ tipo: 'error', texto: 'Sesión expirada. Por favor inicie sesión nuevamente.' });
            setLoading(false);
            return;
        }

        try {
            // Preparamos el payload. Si los campos de password están vacíos, no los enviamos
            const payload = { ...usuario };
            if (passwords.currentPassword && passwords.newPassword) {
                payload.currentPassword = passwords.currentPassword;
                payload.newPassword = passwords.newPassword;
            }

            const response = await fetch(`${API_URL}/api/usuarios/perfil`, {
                method: 'PUT', // Asumiendo que tu backend usa PUT para actualizar
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setMensaje({ tipo: 'success', texto: 'Perfil actualizado correctamente.' });

                // Actualizamos el localStorage con los nuevos datos (menos el password)
                const userToStore = { ...data.user || usuario };
                // Aseguramos mantener la estructura del objeto usuario
                localStorage.setItem('usuario', JSON.stringify(userToStore));

                // Limpiar campos de contraseña
                setPasswords({ currentPassword: '', newPassword: '' });
            } else {
                setMensaje({ tipo: 'error', texto: data.message || 'Error al actualizar el perfil.' });
            }
        } catch (error) {
            console.error(error);
            setMensaje({ tipo: 'error', texto: 'Error de conexión con el servidor.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                    <User className="text-blue-600" size={32} /> Mi Perfil
                </h1>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="p-6 md:p-8">

                        {/* Mensajes de feedback */}
                        {mensaje.texto && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                                {mensaje.tipo === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <p className="font-medium">{mensaje.texto}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Sección Datos Personales */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">Información Personal</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Nombre</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={usuario.first_name}
                                                onChange={handleChange}
                                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Apellido</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={usuario.last_name}
                                                onChange={handleChange}
                                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                name="email"
                                                value={usuario.email}
                                                onChange={handleChange}
                                                disabled // Generalmente el email es el ID y no se cambia fácilmente
                                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Matrícula Profesional</label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="matricula"
                                                value={usuario.matricula}
                                                onChange={handleChange}
                                                placeholder="Ej: M.P. 12345"
                                                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">* Aparecerá en la firma de tus informes.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección Seguridad */}
                            <div className="pt-4">
                                <h3 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2 flex items-center gap-2">
                                    <Key size={20} /> Seguridad
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Contraseña Actual</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwords.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-600">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 col-span-1 md:col-span-2">
                                        Deja estos campos vacíos si no deseas cambiar tu contraseña.
                                    </p>
                                </div>
                            </div>

                            {/* Botón Guardar */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center gap-2 transition transform active:scale-95 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>Guardando...</>
                                    ) : (
                                        <><Save size={20} /> Guardar Cambios</>
                                    )}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};