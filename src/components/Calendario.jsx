import { useState, useEffect } from 'react';

export const Calendario = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null); // Aquí guardamos nombre, foto, tokens

    const [formData, setFormData] = useState({
        paciente: '',
        fechaInicio: '',
    });

    // --- AL CARGAR: Revisar URL o LocalStorage ---
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const status = queryParams.get('status');
        const dataParam = queryParams.get('data');

        if (status === 'success' && dataParam) {
            // 1. Venimos de Google con datos nuevos
            const decodedData = JSON.parse(decodeURIComponent(dataParam));

            // Guardamos en navegador para persistencia
            localStorage.setItem('googleSession', JSON.stringify(decodedData));
            setUserData(decodedData);

            // Limpiamos la URL
            window.history.replaceState({}, document.title, window.location.pathname);

        } else {
            // 2. Revisamos si ya estábamos logueados de antes
            const savedSession = localStorage.getItem('googleSession');
            if (savedSession) {
                setUserData(JSON.parse(savedSession));
            }
        }
    }, []);

    const handleAuth = () => {
        window.location.href = 'http://localhost:3000/api/calendar/auth';
    };

    const handleLogout = () => {
        localStorage.removeItem('googleSession');
        setUserData(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Ajuste de hora (backend espera ISO)
        const startDateTime = new Date(formData.fechaInicio);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hora

        const sessionData = {
            summary: `Sesión con ${formData.paciente}`,
            description: 'Sesión creada desde PsicoApp',
            start: { dateTime: startDateTime.toISOString(), timeZone: 'America/Argentina/Buenos_Aires' },
            end: { dateTime: endDateTime.toISOString(), timeZone: 'America/Argentina/Buenos_Aires' },
        };

        try {
            const response = await fetch('http://localhost:3000/api/calendar/schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionData,
                    tokens: userData.tokens // Usamos los tokens del estado
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('✅ Turno agendado con éxito');
                setFormData({ paciente: '', fechaInicio: '' }); // Limpiar form
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    // --- VISTA 1: NO CONECTADO (Login limpio) ---
    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm w-full">
                    <div className="mb-4 text-5xl">📅</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido</h2>
                    <p className="text-gray-500 mb-6">Vincula tu cuenta para gestionar pacientes.</p>
                    <button
                        onClick={handleAuth}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>
                        Vincular con Google
                    </button>
                </div>
            </div>
        );
    }

    // --- VISTA 2: CONECTADO (Dashboard completo) ---
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">

                {/* HEADER: Datos del Usuario */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {userData.user.picture && (
                            <img
                                src={userData.user.picture}
                                alt="Perfil"
                                className="w-12 h-12 rounded-full border-2 border-blue-500"
                            />
                        )}
                        <div>
                            <p className="text-sm text-gray-500">Conectado como</p>
                            <h3 className="font-bold text-gray-800">{userData.user.name || userData.user.email}</h3>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="text-red-500 text-sm hover:underline font-medium">
                        Desvincular Cuenta
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* COLUMNA IZQUIERDA: Formulario */}
                    <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Nuevo Turno</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Paciente</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Nombre completo"
                                    value={formData.paciente}
                                    onChange={(e) => setFormData({ ...formData, paciente: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Fecha y Hora</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.fechaInicio}
                                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors"
                            >
                                {loading ? 'Agendando...' : 'Confirmar Turno'}
                            </button>
                        </form>
                    </div>

                    {/* COLUMNA DERECHA: Calendario Embebido */}
                    <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm h-[500px]">
                        {/* Iframe de Google Calendar embebido con el mail del usuario */}
                        <iframe
                            src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userData.user.email)}&ctz=America%2FArgentina%2FBuenos_Aires`}
                            style={{ border: 0 }}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            title="Mi Calendario"
                        ></iframe>
                    </div>

                </div>
            </div>
        </div>
    );
};