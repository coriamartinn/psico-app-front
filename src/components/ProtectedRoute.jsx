import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
    // 1. Buscamos al usuario en la cajita del navegador
    const isAllowed = localStorage.getItem("usuario");

    // 2. Si NO hay usuario, lo mandamos al Login (replace evita que vuelva atrás)
    if (!isAllowed) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si SÍ hay usuario, dejamos que se rendericen las rutas hijas (Outlet)
    return <Outlet />;
};