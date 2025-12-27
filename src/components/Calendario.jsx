import { useState, useEffect } from 'react';

export const Calendario = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    const [formData, setFormData] = useState({
        paciente: '',
        fechaInicio: '',
    });

    // 👇 DEFINIMOS LA URL DEL BACKEND (RENDER)
    const API_URL = import.meta.env.VITE_API_URL || "https://psico-app-backend-q5fm.onrender.com";

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const status = queryParams.get('status');
        const dataParam = queryParams.get('data');

        if (status === 'success' && dataParam) {
            const decodedData = JSON.parse(decodeURIComponent(dataParam));
            localStorage.setItem('googleSession', JSON.stringify(decodedData));
            setUserData(decodedData);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            const savedSession = localStorage.getItem('googleSession');
            if (savedSession) {
                setUserData(JSON.parse(savedSession));
            }
        }
    }, []);

    const handleAuth = () => {
        // 👇 AQUÍ ESTABA EL ERROR: Usamos API_URL en vez de localhost
        window.location.href = `${API_URL}/api/calendar/auth`;
    };

    const handleLogout = () => {
        localStorage.removeItem('googleSession');
        setUserData(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const startDateTime = new Date(formData.fechaInicio);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

        const sessionData = {
            summary: `Sesión con ${formData.paciente}`,
            description: 'Sesión creada desde PsicoApp',
            start: { dateTime: startDateTime.toISOString(), timeZone: 'America/Argentina/Buenos_Aires' },
            end: { dateTime: endDateTime.toISOString(), timeZone: 'America/Argentina/Buenos_Aires' },
        };

        try {
            // 👇 AQUÍ TAMBIÉN CORREGIMOS EL FETCH
            const response = await fetch(`${API_URL}/api/calendar/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionData,
                    tokens: userData.tokens
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('✅ Turno agendado con éxito');
                setFormData({ paciente: '', fechaInicio: '' });
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

    // ... (El resto de tu renderizado visual se mantiene igual)
    // ... Copia tu return del componente tal cual lo tenías ...

    // VISTA 1: LOGIN (Solo para referencia de dónde usar handleAuth)
    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm w-full">
                    <div className="mb-4 text-5xl">📅</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido</h2>
                    <p className="text-gray-500 mb-6">Vincula tu cuenta para gestionar pacientes.</p>
                    <button
                        onClick={handleAuth} // <--- Esto ahora llamará a Render, no a localhost
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                        Vincular con Google
                    </button>
                </div>
            </div>
        );
    }

    // VISTA 2: DASHBOARD
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* ... (Pega aquí el resto de tu código de dashboard que ya estaba bien) ... */}
                {/* ... Solo asegúrate de usar las funciones corregidas arriba ... */}

                {/* HEADER */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {userData.user.picture && (
                            <img src={userData.user.picture} alt="Perfil" className="w-12 h-12 rounded-full border-2 border-blue-500" />
                        )}
                        <div>
                            <p className="text-sm text-gray-500">Conectado como</p>
                            <h3 className="font-bold text-gray-800">{userData.user.name || userData.user.email}</h3>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="text-red-500 text-sm hover:underline font-medium">Desvincular Cuenta</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* FORMULARIO */}
                    <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
                        <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">Nuevo Turno</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Paciente</label>
                                <input type="text" required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nombre completo" value={formData.paciente} onChange={(e) => setFormData({ ...formData, paciente: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Fecha y Hora</label>
                                <input type="datetime-local" required className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={formData.fechaInicio} onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })} />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors">
                                {loading ? 'Agendando...' : 'Confirmar Turno'}
                            </button>
                        </form>
                    </div>

                    {/* CALENDARIO */}
                    <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-sm h-[500px]">
                        <iframe src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(userData.user.email)}&ctz=America%2FArgentina%2FBuenos_Aires`} style={{ border: 0 }} width="100%" height="100%" frameBorder="0" scrolling="no" title="Mi Calendario"></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};