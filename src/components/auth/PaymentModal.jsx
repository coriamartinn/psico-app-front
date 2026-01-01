// src/components/PaymentModal.jsx
export default function PaymentModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center border-t-4 border-indigo-600 relative">

                {/* Ícono de candado o alerta */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Suscripción Requerida</h2>
                <p className="text-gray-500 mb-6">
                    Esta funcionalidad es exclusiva para usuarios premium. Para acceder a la gestión completa, necesitás activar tu plan.
                </p>

                {/* Detalle del precio (Mockup) */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <p className="text-sm text-gray-500 uppercase font-semibold">Plan Profesional</p>
                    <p className="text-3xl font-bold text-gray-900">$15.000 <span className="text-sm font-normal text-gray-500">/mes</span></p>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                    Entendido
                </button>

                <p className="mt-4 text-xs text-gray-400">Desarrollado por Coria Dev</p>
            </div>
        </div>
    );
}