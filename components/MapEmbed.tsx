"use client";

import * as React from "react";

interface MapEmbedProps {
  /** Latitude da localização (ex.: -21.637652323862493) */
  lat: number;
  /** Longitude da localização (ex.: -41.732340334072234) */
  lng: number;
  /** Zoom inicial do mapa (padrão 15) */
  zoom?: number;
}

/**
 * Exibe um mapa do Google Maps usando um <iframe>.
 * Não requer chave de API – é apenas o embed público.
 */
export function MapEmbed({ lat, lng, zoom = 15 }: MapEmbedProps) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg h-96 bg-gray-100 flex items-center justify-center text-gray-500">
      {/* O iframe preenche todo o contêiner */}
      <iframe
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
      />
      {/* Texto de fallback para depuração, caso o iframe não carregue */}
      <p className="z-10">Carregando mapa...</p>
    </div>
  );
}