import { useEffect, useRef } from "react";
import { useDatos } from "./context/DatosContext";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea
} from "recharts";
import { BarChart3, RotateCcw, Download, FileInput } from "lucide-react";
import { toPng } from 'html-to-image';
import Swal from 'sweetalert2'; // <--- IMPORTAMOS SWEETALERT

export const Graficos = () => {
    const {
        datosGrafico, setDatosGrafico,
        tipoGraficoActual, setTipoGraficoActual,
        guardarImagenGrafico
    } = useDatos();

    const chartRef = useRef(null);

    // ... (MANTÉN TUS CONSTANTES SECCIONES Y PLANTILLAS IGUAL QUE ANTES) ...
    const SECCIONES = [
        { titulo: "WISC-V", opciones: [{ id: "compuesto", label: "Análisis Primario" }, { id: "secundario", label: "Análisis Secundario" }] },
        { titulo: "PROLEXIA", opciones: [{ id: "prolexia", label: "Diagnóstico Dislexia" }] },
        { titulo: "BRIEF-2", opciones: [{ id: "brief2", label: "Funciones Ejecutivas" }] }
    ];

    const PLANTILLAS = {
        compuesto: ["ICV", "IVE", "IRF", "IMT", "IVP", "CIT"],
        secundario: ["IRC", "IMTA", "INV", "ICG", "ICC"],
        prolexia: ["OMSI", "SUFO", "INSI", "DEPA", "DEPS", "DIG", "LEPA", "LEPAT", "LEPS", "LEPST", "DIPA", "DIPAT", "DIPS", "DIPST", "RCOL", "RCOLT", "ROBJ", "ROBJT"],
        brief2: ["INH", "SMI", "FLE", "CEM", "INI", "MTR", "PLA", "STA", "ORG"]
    };

    useEffect(() => {
        if (datosGrafico.length === 0) cargarPlantilla(tipoGraficoActual);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarPlantilla = (tipo) => {
        setTipoGraficoActual(tipo);
        const nombres = PLANTILLAS[tipo] || [];
        setDatosGrafico(nombres.map((nombre, index) => ({
            id: index + 1, name: nombre, uniqueName: `${nombre}_${index}`, puntuacion: "", pd: "", pt: ""
        })));
    };

    const cambiarTipoGrafico = (nuevoTipo) => cargarPlantilla(nuevoTipo);

    const actualizarDato = (id, campo, valor) => {
        setDatosGrafico(datosGrafico.map(item => item.id === id ? { ...item, [campo]: valor } : item));
    };

    // --- GUARDAR EN PC ---
    const handleGuardarImagen = async () => {
        if (chartRef.current) {
            try {
                const filter = (node) => !node.classList?.contains('hide-on-export');
                const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#ffffff', pixelRatio: 2, filter: filter });
                const link = document.createElement("a");
                link.download = `grafico-${tipoGraficoActual}.png`;
                link.href = dataUrl;
                link.click();

                // Alerta suave al descargar
                const Toast = Swal.mixin({
                    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true
                });
                Toast.fire({ icon: 'success', title: 'Imagen descargada' });

            } catch (error) { console.error(error); }
        }
    };

    // --- ADJUNTAR AL INFORME (CON SWEETALERT) ---
    const handleAdjuntarAlInforme = async () => {
        if (chartRef.current) {
            try {
                const filter = (node) => !node.classList?.contains('hide-on-export');
                const dataUrl = await toPng(chartRef.current, { cacheBust: true, backgroundColor: '#ffffff', pixelRatio: 2, filter: filter });

                let categoria = "wisc";
                if (tipoGraficoActual === "prolexia") categoria = "prolexia";
                if (tipoGraficoActual === "brief2") categoria = "brief";

                guardarImagenGrafico(categoria, dataUrl);

                // --- AVISO LINDO ---
                Swal.fire({
                    title: '¡Adjuntado!',
                    text: `El gráfico de ${categoria.toUpperCase()} se ha añadido al informe correctamente.`,
                    icon: 'success',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'Genial'
                });

            } catch (error) { console.error(error); }
        }
    };

    const obtenerTitulo = () => {
        if (tipoGraficoActual === "compuesto") return "Perfil de Puntuaciones Compuestas";
        if (tipoGraficoActual === "secundario") return "Perfil de Puntuaciones Secundarias";
        if (tipoGraficoActual === "prolexia") return "Perfil PROLEXIA";
        if (tipoGraficoActual === "brief2") return "BRIEF 2";
        return "Gráfico";
    };

    const dataGrafico = datosGrafico.map(d => ({
        name: d.name,
        valor: tipoGraficoActual === 'prolexia' ? (d.pt === "" ? null : Number(d.pt)) : (d.puntuacion === "" ? null : Number(d.puntuacion)),
        pd: d.pd, pt: d.pt
    }));

    const isWisc = ["compuesto", "secundario"].includes(tipoGraficoActual);
    const isBrief = tipoGraficoActual === "brief2";
    const isProlexia = tipoGraficoActual === "prolexia";
    const showLegend = isWisc || isBrief;

    const ChartLegend = () => (
        <div className="absolute top-28 right-10 bg-white border border-gray-300 p-3 rounded shadow-sm z-20 text-xs space-y-2">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-700 flex items-center justify-center"><div className="w-full h-[3px] bg-blue-700"></div></div><span className="text-gray-700 font-medium">Puntuación</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-[3px] bg-red-500"></div><span className="text-gray-600">{isBrief ? "Clínico / +1 DE" : "Desviación Estándar"}</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-[3px] bg-green-500"></div><span className="text-gray-600">Media</span></div>
        </div>
    );

    const renderReferenceLines = () => {
        if (isProlexia) return null;
        if (isBrief) return <><ReferenceLine y={65} stroke="#ef4444" strokeWidth={1.5} /><ReferenceLine y={60} stroke="#ef4444" strokeWidth={1} /><ReferenceLine y={50} stroke="#22c55e" strokeWidth={1.5} /><ReferenceLine y={40} stroke="#ef4444" strokeWidth={1} /></>;
        return <><ReferenceLine y={115} stroke="#ef4444" strokeWidth={1} /><ReferenceLine y={100} stroke="#22c55e" strokeWidth={1.5} /><ReferenceLine y={85} stroke="#ef4444" strokeWidth={1} /></>;
    };

    const obtenerPieDeGrafico = () => {
        const hayDatos = dataGrafico.some(d => d.valor !== null);
        if (!hayDatos) return null;
        if (isWisc) return <div className="mt-4 text-center"><p className="text-xs text-black inline-block">* Se debe tener en cuenta que la media es de 100 con un desvío estándar de 15.</p></div>;
        if (isBrief) return <div className="mt-4 text-center"><p className="text-lg text-slate-800 italic font-serif">* T escala típica con media=50 y desviación típica=10</p></div>;
        return null;
    };

    return (
        <div className="flex h-[calc(100vh-50px)] w-full bg-gray-100 overflow-hidden">
            {/* PANEL IZQUIERDO */}
            <div className="w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col shadow-xl z-10">
                <div className="p-6 bg-slate-50 border-b">
                    <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2"><BarChart3 size={20} className="text-blue-600" /> Tipo de Perfil</h2>
                    <div className="space-y-5">
                        {SECCIONES.map((seccion) => (
                            <div key={seccion.titulo}>
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1 tracking-wider">{seccion.titulo}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {seccion.opciones.map((opcion) => (
                                        <button key={opcion.id} onClick={() => cambiarTipoGrafico(opcion.id)} className={`py-2 px-2 text-xs font-bold rounded transition-all truncate border ${seccion.opciones.length === 1 ? 'col-span-2' : ''} ${tipoGraficoActual === opcion.id ? "bg-blue-600 text-white shadow-md border-blue-600" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600"}`}>{opcion.label}</button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-400 px-2 uppercase mb-2"><span className="flex-1">Prueba</span><span className="w-20 text-center">Puntaje</span></div>
                    {datosGrafico.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded border hover:border-blue-300">
                            <div className="flex-1 font-bold text-slate-700 pl-1 truncate text-xs">{item.name}</div>
                            {isProlexia ? (
                                <><input type="number" placeholder="PD" className="w-10 border rounded text-center text-sm outline-none" value={item.pd} onChange={(e) => actualizarDato(item.id, 'pd', e.target.value)} /><input type="number" placeholder="PT" className="w-10 border rounded text-center font-bold text-blue-600 text-sm outline-none" value={item.pt} onChange={(e) => actualizarDato(item.id, 'pt', e.target.value)} /></>
                            ) : (
                                <input type="number" placeholder="-" className="w-20 border rounded px-2 text-center font-bold text-blue-600 outline-none" value={item.puntuacion} onChange={(e) => actualizarDato(item.id, 'puntuacion', e.target.value)} />
                            )}
                        </div>
                    ))}
                    <button onClick={() => cargarPlantilla(tipoGraficoActual)} className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-blue-600 flex items-center justify-center gap-2"><RotateCcw size={16} /> Limpiar</button>
                </div>
            </div>

            {/* PANEL DERECHO */}
            <div className="flex-1 min-w-0 p-8 flex flex-col bg-gray-50 overflow-y-auto">
                <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-6 pb-12 flex-1 flex flex-col font-sans relative">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h1 className="text-xl font-bold text-gray-800">{obtenerTitulo()}</h1>
                        <div className="flex gap-2 hide-on-export">
                            <button onClick={handleAdjuntarAlInforme} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-bold flex items-center gap-2 shadow-md hover:scale-105"><FileInput size={20} /> Adjuntar</button>
                            <button onClick={handleGuardarImagen} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold flex items-center gap-2 shadow-md hover:scale-105"><Download size={20} /> Guardar Imagen</button>
                        </div>
                    </div>
                    {showLegend && <ChartLegend />}
                    <div className="flex-1 min-h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataGrafico} layout={isProlexia ? "vertical" : "horizontal"} margin={{ top: 20, right: 30, left: isProlexia ? 40 : 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="0" stroke="#e5e7eb" vertical={false} />
                                {isProlexia ? <><XAxis type="number" domain={[0, 250]} ticks={[0, 50, 100, 200]} /><YAxis dataKey="name" type="category" width={50} interval={0} tick={{ fontSize: 10, fontWeight: 'bold' }} /></> : <><XAxis dataKey="name" height={60} interval={0} tick={{ fontSize: 11, fontWeight: 'bold' }} /><YAxis domain={isBrief ? [20, 100] : [40, 160]} /></>}
                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                {isProlexia && <><ReferenceArea x1={0} x2={49} fill="#E2F0D9" fillOpacity={0.6} /><ReferenceArea x1={50} x2={99} fill="#A9D18E" fillOpacity={0.6} /><ReferenceArea x1={100} x2={199} fill="#F8CBAD" fillOpacity={0.6} /><ReferenceArea x1={200} x2={250} fill="#F4B183" fillOpacity={0.6} /></>}
                                {renderReferenceLines()}
                                <Line type="linear" dataKey="valor" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 5, fill: "#1d4ed8", strokeWidth: 0 }} activeDot={{ r: 7 }} isAnimationActive={false} connectNulls={true} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {obtenerPieDeGrafico()}
                </div>
            </div>
        </div>
    );
};