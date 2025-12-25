import { createContext, useState, useContext } from "react";

const DatosContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useDatos = () => useContext(DatosContext);

export const DatosProvider = ({ children }) => {
    // 1. Datos numéricos (para que no se borren los inputs)
    const [datosGrafico, setDatosGrafico] = useState([]);

    // 2. FOTOS de los gráficos (Un espacio para cada uno)
    const [imagenes, setImagenes] = useState({
        wisc: null,
        prolexia: null,
        brief: null
    });

    // Función para guardar una foto en su casilla correspondiente
    const guardarImagenGrafico = (tipo, base64) => {
        setImagenes(prev => ({
            ...prev,
            [tipo]: base64
        }));
    };

    const [tipoGraficoActual, setTipoGraficoActual] = useState("compuesto");

    return (
        <DatosContext.Provider value={{
            datosGrafico,
            setDatosGrafico,
            imagenes,            // <--- IMPORTANTE: Exportamos el objeto completo
            guardarImagenGrafico,// <--- IMPORTANTE: La función para guardar
            tipoGraficoActual,
            setTipoGraficoActual
        }}>
            {children}
        </DatosContext.Provider>
    );
};