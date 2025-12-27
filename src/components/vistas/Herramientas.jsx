import { useState, useRef, useEffect } from "react";
import { PenTool, Eraser, Download, Wind, Palette, RefreshCcw } from "lucide-react";

export const Herramientas = () => {
    const [tab, setTab] = useState("pizarra"); // 'pizarra' o 'respiracion'

    return (
        <div className="flex h-[calc(100vh-50px)] bg-gray-100">
            {/* BARRA LATERAL DE HERRAMIENTAS */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg z-10">
                <div className="p-6 bg-slate-800 text-white">
                    <h2 className="text-xl font-bold tracking-wide">Caja de Herramientas</h2>
                    <p className="text-slate-400 text-xs mt-1">Recursos para la sesión</p>
                </div>
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => setTab("pizarra")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${tab === "pizarra" ? "bg-blue-50 text-blue-600 font-bold shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        <Palette size={20} /> Pizarra Interactiva
                    </button>
                    <button
                        onClick={() => setTab("respiracion")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${tab === "respiracion" ? "bg-green-50 text-green-600 font-bold shadow-sm" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        <Wind size={20} /> Respiración Guiada
                    </button>
                </div>
            </div>

            {/* ÁREA DE TRABAJO */}
            <div className="flex-1 relative overflow-hidden">
                {tab === "pizarra" && <PizarraCanvas />}
                {tab === "respiracion" && <RespiracionGuiada />}
            </div>
        </div>
    );
};

// --- COMPONENTE 1: PIZARRA ---
const PizarraCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        // Ajustamos el tamaño del canvas al contenedor padre
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.fillStyle = "white"; // Fondo blanco inicial
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = canvasRef.current.getContext("2d");
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const downloadCanvas = () => {
        const link = document.createElement('a');
        link.download = 'dibujo_sesion.png';
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div className="w-full h-full relative cursor-crosshair bg-white">
            {/* BARRA DE CONTROL FLOTANTE */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-gray-200 z-50">
                <div className="flex gap-2">
                    {['#000000', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'].map(c => (
                        <button
                            key={c}
                            onClick={() => { setColor(c); setLineWidth(3); }}
                            className={`w-6 h-6 rounded-full border-2 ${color === c && lineWidth !== 20 ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <button onClick={() => { setColor("#FFFFFF"); setLineWidth(20); }} className={`p-2 rounded-lg hover:bg-gray-100 ${lineWidth === 20 ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`} title="Borrador">
                    <Eraser size={20} />
                </button>
                <button onClick={clearCanvas} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" title="Limpiar">
                    <RefreshCcw size={20} />
                </button>
                <button onClick={downloadCanvas} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600" title="Guardar">
                    <Download size={20} />
                </button>
            </div>

            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full block"
            />
        </div>
    );
};

// --- COMPONENTE 2: RESPIRACIÓN ---
const RespiracionGuiada = () => {
    const [fase, setFase] = useState("Inhala"); // Inhala, Sostén, Exhala
    const [activo, setActivo] = useState(false);

    useEffect(() => {
        if (!activo) return;

        const ciclo = async () => {
            while (activo) {
                setFase("Inhala");
                await new Promise(r => setTimeout(r, 4000));
                if (!activo) break;
                setFase("Sostén");
                await new Promise(r => setTimeout(r, 4000));
                if (!activo) break;
                setFase("Exhala");
                await new Promise(r => setTimeout(r, 4000));
            }
        };
        ciclo();
        return () => setFase("Lista"); // Cleanup
    }, [activo]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-teal-100">
            <h2 className="text-3xl font-bold text-teal-800 mb-8 tracking-wide">Técnica 4-4-4</h2>

            <div className={`relative flex items-center justify-center transition-all duration-[4000ms] ease-in-out
                ${fase === "Inhala" ? "w-80 h-80 opacity-100" :
                    fase === "Sostén" ? "w-80 h-80 opacity-100" :
                        fase === "Exhala" ? "w-32 h-32 opacity-80" : "w-40 h-40 opacity-50"}
            `}>
                {/* Círculos animados */}
                <div className={`absolute inset-0 bg-teal-400 rounded-full blur-xl opacity-30 animate-pulse`}></div>
                <div className={`absolute inset-0 border-4 border-teal-500 rounded-full transition-all duration-[4000ms] ${fase === "Sostén" ? "border-8" : ""}`}></div>

                <div className="z-10 text-4xl font-black text-teal-700 transition-all duration-500">
                    {activo ? fase : "Relájate"}
                </div>
            </div>

            <button
                onClick={() => setActivo(!activo)}
                className={`mt-12 px-8 py-3 rounded-full font-bold text-white shadow-lg transform hover:scale-105 transition-all
                    ${activo ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-700"}
                `}
            >
                {activo ? "Detener Ejercicio" : "Comenzar Respiración"}
            </button>
            <p className="mt-4 text-teal-600 opacity-70 text-sm">Ayuda a reducir la ansiedad en minutos.</p>
        </div>
    );
};