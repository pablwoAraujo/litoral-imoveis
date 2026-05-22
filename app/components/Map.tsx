"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import scBoundary from "../data/sc-boundary.json";
import gaivotaBoundary from "../data/gaivota-boundary.json";
import lagoinhasBoundary from "../data/lagoinhas-boundary.json";

interface MapProps {
  styleId: "dark" | "light" | "satellite";
  showSC: boolean;
  showGaivota: boolean;
  showLagoinhas: boolean;
}

// Balneário Gaivota central coordinates
const GAIVOTA_COORDS: [number, number] = [-49.5809, -29.1553];

// Balneário Lagoinha coordinates
const LAGOINHAS_COORDS: [number, number] = [-49.5217, -29.0926];

// Convert boundary features to valid GeoJSON FeatureCollection
const scGeoJSON = {
  type: "FeatureCollection" as const,
  features: scBoundary.features.map((f: any) => ({
    type: "Feature" as const,
    id: f.id,
    geometry: f.geometry,
    properties: {}
  }))
};

// Convert Balneário Gaivota boundary features to valid GeoJSON FeatureCollection
const gaivotaGeoJSON = {
  type: "FeatureCollection" as const,
  features: gaivotaBoundary.features.map((f: any) => ({
    type: "Feature" as const,
    geometry: f.geometry,
    properties: {}
  }))
};

// Convert Balneário Lagoinha boundary features to valid GeoJSON FeatureCollection
const lagoinhasGeoJSON = {
  type: "FeatureCollection" as const,
  features: lagoinhasBoundary.features.map((f: any) => ({
    type: "Feature" as const,
    geometry: f.geometry,
    properties: {}
  }))
};

const MAP_STYLES = {
  dark: {
    version: 8 as const,
    sources: {
      "carto-dark": {
        type: "raster" as const,
        tiles: ["https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap &copy; CARTO"
      }
    },
    layers: [
      {
        id: "carto-dark-layer",
        type: "raster" as const,
        source: "carto-dark",
        minzoom: 0,
        maxzoom: 20
      }
    ]
  },
  light: {
    version: 8 as const,
    sources: {
      "carto-voyager": {
        type: "raster" as const,
        tiles: ["https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap &copy; CARTO"
      }
    },
    layers: [
      {
        id: "carto-voyager-layer",
        type: "raster" as const,
        source: "carto-voyager",
        minzoom: 0,
        maxzoom: 20
      }
    ]
  },
  satellite: {
    version: 8 as const,
    sources: {
      "satellite": {
        type: "raster" as const,
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        tileSize: 256,
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      }
    },
    layers: [
      {
        id: "satellite-layer",
        type: "raster" as const,
        source: "satellite",
        minzoom: 0,
        maxzoom: 19
      }
    ]
  }
};

export default function Map({ styleId, showSC, showGaivota, showLagoinhas }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerGaivotaRef = useRef<maplibregl.Marker | null>(null);
  const markerLagoinhasRef = useRef<maplibregl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sync state variables in refs to prevent stale closure in event handlers
  const showSCRef = useRef(showSC);
  const showGaivotaRef = useRef(showGaivota);
  const showLagoinhasRef = useRef(showLagoinhas);

  useEffect(() => {
    showSCRef.current = showSC;
  }, [showSC]);

  useEffect(() => {
    showGaivotaRef.current = showGaivota;
  }, [showGaivota]);

  useEffect(() => {
    showLagoinhasRef.current = showLagoinhas;
  }, [showLagoinhas]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[styleId],
      center: GAIVOTA_COORDS, // Focus directly on Balneário Gaivota!
      zoom: 12, // Zoom in closer
      maxZoom: 18,
      minZoom: 4,
    });

    mapRef.current = map;

    // Add navigation controls (zoom, compass)
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    // Re-draw SC boundary and Gaivota focus circle on style load
    map.on("style.load", () => {
      // 1. Santa Catarina State Boundary
      if (!map.getSource("santa-catarina")) {
        map.addSource("santa-catarina", {
          type: "geojson",
          data: scGeoJSON
        });

        map.addLayer({
          id: "sc-fill",
          type: "fill",
          source: "santa-catarina",
          layout: {
            visibility: showSCRef.current ? "visible" : "none"
          },
          paint: {
            "fill-color": "#3b82f6",
            "fill-opacity": 0.03
          }
        });

        map.addLayer({
          id: "sc-border",
          type: "line",
          source: "santa-catarina",
          layout: {
            visibility: showSCRef.current ? "visible" : "none"
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 1.5,
            "line-opacity": 0.4
          }
        });
      }

      // 2. Balneário Gaivota Official Municipality Boundary Highlight
      if (!map.getSource("gaivota-focus")) {
        map.addSource("gaivota-focus", {
          type: "geojson",
          data: gaivotaGeoJSON
        });

        map.addLayer({
          id: "gaivota-fill",
          type: "fill",
          source: "gaivota-focus",
          layout: {
            visibility: showGaivotaRef.current ? "visible" : "none"
          },
          paint: {
            "fill-color": "#f59e0b", // Gold focus highlight
            "fill-opacity": 0.18
          }
        });

        map.addLayer({
          id: "gaivota-border",
          type: "line",
          source: "gaivota-focus",
          layout: {
            visibility: showGaivotaRef.current ? "visible" : "none"
          },
          paint: {
            "line-color": "#f59e0b",
            "line-width": 3,
            "line-dasharray": [4, 3], // Dashed radar focus outline
            "line-opacity": 0.9
          }
        });
      }

      // 3. Balneário Lagoinha Area Demarcation (Inside the town, North border)
      if (!map.getSource("lagoinhas-area")) {
        map.addSource("lagoinhas-area", {
          type: "geojson",
          data: lagoinhasGeoJSON
        });

        map.addLayer({
          id: "lagoinhas-fill",
          type: "fill",
          source: "lagoinhas-area",
          layout: {
            visibility: showLagoinhasRef.current ? "visible" : "none"
          },
          paint: {
            "fill-color": "#06b6d4", // Cyan/ocean blue highlight
            "fill-opacity": 0.15
          }
        });

        map.addLayer({
          id: "lagoinhas-border",
          type: "line",
          source: "lagoinhas-area",
          layout: {
            visibility: showLagoinhasRef.current ? "visible" : "none"
          },
          paint: {
            "line-color": "#06b6d4",
            "line-width": 2,
            "line-dasharray": [3, 2], // Dashed boundary
            "line-opacity": 0.8
          }
        });
      }
    });

    map.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.remove();
    };
  }, []);

  // Update map style when styleId changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setStyle(MAP_STYLES[styleId]);
  }, [styleId]);

  // Handle dynamic visibility changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer("sc-fill")) {
      map.setLayoutProperty("sc-fill", "visibility", showSC ? "visible" : "none");
    }
    if (map.getLayer("sc-border")) {
      map.setLayoutProperty("sc-border", "visibility", showSC ? "visible" : "none");
    }
  }, [showSC, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer("gaivota-fill")) {
      map.setLayoutProperty("gaivota-fill", "visibility", showGaivota ? "visible" : "none");
    }
    if (map.getLayer("gaivota-border")) {
      map.setLayoutProperty("gaivota-border", "visibility", showGaivota ? "visible" : "none");
    }

    if (markerGaivotaRef.current) {
      const el = markerGaivotaRef.current.getElement();
      el.style.display = showGaivota ? "block" : "none";
      if (!showGaivota) {
        markerGaivotaRef.current.getPopup()?.remove();
      }
    }
  }, [showGaivota, mapLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer("lagoinhas-fill")) {
      map.setLayoutProperty("lagoinhas-fill", "visibility", showLagoinhas ? "visible" : "none");
    }
    if (map.getLayer("lagoinhas-border")) {
      map.setLayoutProperty("lagoinhas-border", "visibility", showLagoinhas ? "visible" : "none");
    }

    if (markerLagoinhasRef.current) {
      const el = markerLagoinhasRef.current.getElement();
      el.style.display = showLagoinhas ? "block" : "none";
      if (!showLagoinhas) {
        markerLagoinhasRef.current.getPopup()?.remove();
      }
    }
  }, [showLagoinhas, mapLoaded]);

  // Add Pulsing Location Pins on Balneário Gaivota & Balneário Lagoinha
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // 1. Balneário Gaivota Center Marker
    const elGaivota = document.createElement("div");
    elGaivota.className = "pulse-marker";
    elGaivota.style.setProperty("--marker-color", "#f59e0b"); // Golden pin
    elGaivota.style.display = showGaivotaRef.current ? "block" : "none";

    const popupGaivotaHTML = `
      <div class="p-1 font-sans">
        <div class="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">Foco Principal</div>
        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Balneário Gaivota</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xs">Município costeiro de Santa Catarina. Destaque por suas dunas de areia fina, lagoas naturais e praias limpas.</p>
      </div>
    `;

    const popupGaivota = new maplibregl.Popup({
      offset: 30,
      closeButton: false,
      closeOnClick: false,
      className: "custom-popup-box"
    }).setHTML(popupGaivotaHTML);

    const markerGaivota = new maplibregl.Marker({ element: elGaivota })
      .setLngLat(GAIVOTA_COORDS)
      .setPopup(popupGaivota)
      .addTo(map);

    markerGaivotaRef.current = markerGaivota;

    // 2. Balneário Lagoinha Marker
    const elLagoinhas = document.createElement("div");
    elLagoinhas.className = "pulse-marker";
    elLagoinhas.style.setProperty("--marker-color", "#06b6d4"); // Cyan pin
    elLagoinhas.style.display = showLagoinhasRef.current ? "block" : "none";

    const popupLagoinhasHTML = `
      <div class="p-1 font-sans">
        <div class="text-[10px] uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400 mb-0.5">Bairro / Loteamento</div>
        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">Balneário Lagoinha</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-xs">Localizado no extremo norte de Balneário Gaivota, na divisa com Arroio do Silva. Conhecido por sua tranquilidade, dunas e lagoas.</p>
      </div>
    `;

    const popupLagoinhas = new maplibregl.Popup({
      offset: 30,
      closeButton: false,
      closeOnClick: false,
      className: "custom-popup-box"
    }).setHTML(popupLagoinhasHTML);

    const markerLagoinhas = new maplibregl.Marker({ element: elLagoinhas })
      .setLngLat(LAGOINHAS_COORDS)
      .setPopup(popupLagoinhas)
      .addTo(map);

    markerLagoinhasRef.current = markerLagoinhas;

    // Open main focus popup after map load
    const popupTimeout = setTimeout(() => {
      if (mapRef.current && showGaivotaRef.current) {
        popupGaivota.addTo(map);
      }
    }, 1200);

    return () => {
      clearTimeout(popupTimeout);
      markerGaivota.remove();
      popupGaivota.remove();
      markerLagoinhas.remove();
      popupLagoinhas.remove();
      markerGaivotaRef.current = null;
      markerLagoinhasRef.current = null;
    };
  }, [mapLoaded]);

  return (
    <div className="relative w-full h-full">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating coordinates indicator (Sleek UI element) */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/40 dark:border-slate-800/40 shadow-lg pointer-events-none">
        {showGaivota && (
          <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            📍 Balneário Gaivota: Lat {GAIVOTA_COORDS[1].toFixed(4)} Lng {GAIVOTA_COORDS[0].toFixed(4)}
          </p>
        )}
        {showGaivota && showLagoinhas && (
          <div className="h-px bg-slate-200/50 dark:bg-slate-800/50 my-0.5" />
        )}
        {showLagoinhas && (
          <p className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
            📍 Balneário Lagoinha: Lat {LAGOINHAS_COORDS[1].toFixed(4)} Lng {LAGOINHAS_COORDS[0].toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
}
