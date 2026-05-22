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
  const [showSC, setShowSC] = useState(false); // Default SC borders to false so the user focuses on the city
  const [showGaivota, setShowGaivota] = useState(true);
  const [showLagoinhas, setShowLagoinhas] = useState(true);
  const [showAllStreets, setShowAllStreets] = useState(true);
  const [showLotes, setShowLotes] = useState(false);
  const [lotesOpacity, setLotesOpacity] = useState(0.7);
  const [lotesRotation, setLotesRotation] = useState(-52);

  const isDarkUI = mapStyle === "dark" || mapStyle === "satellite";

  return (
    <div className={`relative w-screen h-screen overflow-hidden font-sans ${isDarkUI ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
      {/* Background Map Container */}
      <div className="absolute inset-0 z-0">
        <Map
          styleId={mapStyle}
          showSC={showSC}
          showGaivota={showGaivota}
          showLagoinhas={showLagoinhas}
          showAllStreets={showAllStreets}
          showLotes={showLotes}
          lotesOpacity={lotesOpacity}
          lotesRotation={lotesRotation}
        />
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

      {/* Layer Control Panel (Below Header) */}
      <div className="absolute top-28 left-4 z-10 w-64">
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Camadas do Mapa
            </span>
            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
              Filtro
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Santa Catarina Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={showSC}
                onChange={() => setShowSC(!showSC)}
                className="hidden peer"
              />
              <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-150">
                {showSC && (
                  <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                Limites de SC (Azul)
              </span>
            </label>

            {/* Balneário Gaivota Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={showGaivota}
                onChange={() => setShowGaivota(!showGaivota)}
                className="hidden peer"
              />
              <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all duration-150">
                {showGaivota && (
                  <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                B. Gaivota - Geral (Ouro)
              </span>
            </label>

            {/* Balneário Lagoinha Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={showLagoinhas}
                onChange={() => setShowLagoinhas(!showLagoinhas)}
                className="hidden peer"
              />
              <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all duration-150">
                {showLagoinhas && (
                  <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                B. Lagoinha - Bairro (Ciano)
              </span>
            </label>

            {/* Todas as Ruas Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={showAllStreets}
                onChange={() => setShowAllStreets(!showAllStreets)}
                className="hidden peer"
              />
              <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center peer-checked:bg-sky-500 peer-checked:border-sky-500 transition-all duration-150">
                {showAllStreets && (
                  <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                Todas as Ruas (Malha Urbana)
              </span>
            </label>

            {/* Imagem de Lotes Toggle */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={showLotes}
                  onChange={() => setShowLotes(!showLotes)}
                  className="hidden peer"
                />
                <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-all duration-150">
                  {showLotes && (
                    <svg className="w-2.5 h-2.5 text-white fill-current" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                  Lotes e Quadras (Imagem)
                </span>
              </label>

              {showLotes && (
                <div className="flex flex-col gap-2 mt-1.5 pl-6 bg-slate-100/50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      <span>Opacidade</span>
                      <span>{Math.round(lotesOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={lotesOpacity}
                      onChange={(e) => setLotesOpacity(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>

                  <div className="h-px bg-slate-200/50 dark:bg-slate-800/50 my-0.5" />

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      <span>Rotação</span>
                      <span>{lotesRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={lotesRotation}
                      onChange={(e) => setLotesRotation(parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
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
