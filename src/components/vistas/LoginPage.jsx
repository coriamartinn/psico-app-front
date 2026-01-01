import { useState } from 'react';
import DevBanner from './components/DevBanner';
import PaymentModal from './components/PaymentModal';

function LoginPage() {
    const [showPaywall, setShowPaywall] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        // ACÁ ESTÁ LA MAGIA:
        // En lugar de loguear directo, simulamos que el usuario no pagó.
        // Más adelante acá iría un: if (user.status !== 'premium') ...

        const usuarioPago = false; // Forzamos a que sea falso para probar

        if (!usuarioPago) {
            setShowPaywall(true); // ¡PUM! Le mostramos el cartel
            return;
        }

        // ... lógica normal de login ...
    };

    return (
        <div className="min-h-screen bg-gray-100 pt-12"> {/* pt-12 para dar espacio al banner */}

            <DevBanner /> {/* El cartelito amarillo arriba */}

            <div className="p-10 flex flex-col items-center">
                <h1 className="text-3xl font-bold mb-8">PsicoApp Login</h1>

                {/* Botón de Ingreso */}
                <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                >
                    Ingresar al Sistema
                </button>
            </div>

            {/* El Modal que está oculto hasta que showPaywall sea true */}
            <PaymentModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
            />

        </div>
    );
}

export default LoginPage;