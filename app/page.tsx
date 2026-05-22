"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Map component to avoid SSR issues
const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-medium tracking-wider animate-pulse">CARREGANDO MAPA DE SANTA CATARINA...</p>
    </div>
  ),
});

export default function Home() {
  const [mapStyle, setMapStyle] = useState<"dark" | "light" | "satellite">("dark");

  const isDarkUI = mapStyle === "dark" || mapStyle === "satellite";

  return (
    <div className={`relative w-screen h-screen overflow-hidden font-sans ${isDarkUI ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Background Map Container */}
      <div className="absolute inset-0 z-0">
        <Map styleId={mapStyle} />
      </div>

      {/* Floating Header / Brand Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-xl flex flex-col gap-1 transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
              SANTA CATARINA
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              MAPA
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wider">
            Visualização Geográfica
          </p>
        </div>
      </div>

      {/* Floating Style Selector (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col md:flex-row items-end md:items-center gap-2">
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-1.5 shadow-xl flex gap-1">
          <button
            onClick={() => setMapStyle("dark")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              mapStyle === "dark"
                ? "bg-slate-900 text-white shadow-md dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Escuro
          </button>
          <button
            onClick={() => setMapStyle("light")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              mapStyle === "light"
                ? "bg-blue-500 text-white shadow-md dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Claro
          </button>
          <button
            onClick={() => setMapStyle("satellite")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              mapStyle === "satellite"
                ? "bg-emerald-600 text-white shadow-md dark:bg-slate-800 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Satélite
          </button>
        </div>
      </div>

      {/* Helper text overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 pointer-events-none md:pointer-events-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/30 dark:border-slate-800/30 shadow-sm text-[10px] text-slate-500 dark:text-slate-400 font-medium">
        <span>Arraste com o botão esquerdo. Roda do mouse para zoom.</span>
      </div>
    </div>
  );
}
