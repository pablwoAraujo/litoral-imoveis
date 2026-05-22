"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { SANTA_CATARINA_CENTER } from "../data/cities";
import scBoundary from "../data/sc-boundary.json";

interface MapProps {
  styleId: "dark" | "light" | "satellite";
}

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

export default function Map({ styleId }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES[styleId],
      center: [SANTA_CATARINA_CENTER.lng, SANTA_CATARINA_CENTER.lat],
      zoom: SANTA_CATARINA_CENTER.zoom,
      maxZoom: 18,
      minZoom: 4,
    });

    mapRef.current = map;

    // Add navigation controls (zoom, compass)
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");

    // Re-draw polygon and layers on every style/map load
    map.on("style.load", () => {
      if (!map.getSource("santa-catarina")) {
        map.addSource("santa-catarina", {
          type: "geojson",
          data: scGeoJSON
        });

        // Add soft semi-transparent blue fill
        map.addLayer({
          id: "sc-fill",
          type: "fill",
          source: "santa-catarina",
          paint: {
            "fill-color": "#3b82f6",
            "fill-opacity": 0.05
          }
        });

        // Add glowing boundary line
        map.addLayer({
          id: "sc-border",
          type: "line",
          source: "santa-catarina",
          paint: {
            "line-color": "#3b82f6",
            "line-width": 2,
            "line-opacity": 0.5
          }
        });
      }
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

  return (
    <div className="relative w-full h-full">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating coordinates indicator (Sleek UI element) */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/30 dark:border-slate-800/30 shadow-sm pointer-events-none">
        <p className="text-[10px] font-mono text-slate-600 dark:text-slate-400">
          📍 SC, BR | Lat: {SANTA_CATARINA_CENTER.lat.toFixed(4)} Lng: {SANTA_CATARINA_CENTER.lng.toFixed(4)}
        </p>
      </div>
    </div>
  );
}
