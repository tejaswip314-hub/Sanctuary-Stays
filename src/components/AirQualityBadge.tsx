'use client';

import React, { useEffect, useState } from 'react';
import { AirVent } from 'lucide-react';

interface AirQualityIndex {
  code: string;
  displayName: string;
  aqi: number;
  aqiDisplay: string;
  category: string;
  dominantPollutant: string;
  color?: { red: number; green: number; blue: number };
}

interface AirQualityPayload {
  success: boolean;
  available: boolean;
  source?: 'google' | 'open-meteo';
  index?: AirQualityIndex;
  dateTime?: string;
  error?: string;
}

interface AirQualityBadgeProps {
  lat: number;
  lng: number;
  className?: string;
}

function rgbToCss(color?: { red: number; green: number; blue: number }): string {
  if (!color) return '#d4af37';
  return `rgb(${color.red} ${color.green} ${color.blue})`;
}

export const AirQualityBadge: React.FC<AirQualityBadgeProps> = ({
  lat,
  lng,
  className = '',
}) => {
  const [payload, setPayload] = useState<AirQualityPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/air-quality?lat=${lat}&lng=${lng}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: AirQualityPayload) => {
        setPayload(data);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setPayload({ success: false, available: false, error: 'Air quality lookup failed.' });
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [lat, lng]);

  const index = payload?.index;

  return (
    <div
      className={`pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-[11px] text-white backdrop-blur-md ${className}`}
      title={
        index
          ? `${index.displayName}: ${index.category}. Dominant pollutant: ${index.dominantPollutant}. Source: ${
              payload?.source === 'google' ? 'Google Air Quality API' : 'Open-Meteo (CC BY 4.0)'
            }.`
          : payload?.error || 'Live air quality for this stay'
      }
    >
      <AirVent className="w-3.5 h-3.5 text-[#d4af37]" />
      {isLoading ? (
        <span className="text-white/60">Checking air quality…</span>
      ) : index ? (
        <>
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: rgbToCss(index.color) }}
          />
          <span className="font-semibold">AQI {index.aqiDisplay || index.aqi}</span>
          <span className="max-w-[150px] truncate text-white/70">{index.category}</span>
          <span className="text-[9px] uppercase tracking-wider text-white/35">
            {payload?.source === 'google' ? 'Google' : 'Open-Meteo'}
          </span>
        </>
      ) : (
        <span className="text-white/50">Air quality unavailable</span>
      )}
    </div>
  );
};

export default AirQualityBadge;
