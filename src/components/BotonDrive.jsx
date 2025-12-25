import { FolderOpen, ExternalLink } from "lucide-react";

export const BotonDrive = ({ url }) => {
    // Si el paciente no tiene carpeta asignada, podemos no mostrar nada 
    // o mostrar un botón deshabilitado.
    if (!url) {
        return (
            <button disabled className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium">
                <FolderOpen size={18} />
                Sin Carpeta
            </button>
        );
    }

    return (
        <a
            href={url}
            target="_blank" // Abre en pestaña nueva
            rel="noopener noreferrer" // Seguridad: evita que la nueva página acceda a tu app
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-bold shadow-sm hover:shadow-md"
        >
            <FolderOpen size={18} />
            <span>Abrir Carpeta</span>
            {/* Icono pequeño extra para indicar que sale de la app */}
            <ExternalLink size={14} className="opacity-70" />
        </a>
    );
};