'use client';

import React from 'react';
import {
  APIProvider,
  AdvancedMarker,
  ColorScheme,
  Map as GoogleMap,
} from '@vis.gl/react-google-maps';
import { SanctuaryStay } from '../types/sanctuary';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

interface StayLocationMapProps {
  stay: SanctuaryStay;
  isDarkTheme: boolean;
  height?: number;
}

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

class MapErrorBoundary extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Stay location map error caught by boundary:', error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const openInMaps = (stay: SanctuaryStay) =>
  `https://www.google.com/maps/search/?api=1&query=${stay.location.coordinates.lat},${stay.location.coordinates.lng}`;

const directionsToStay = (stay: SanctuaryStay) =>
  `https://www.google.com/maps/dir/?api=1&destination=${stay.location.coordinates.lat},${stay.location.coordinates.lng}`;

const LocationFallback: React.FC<{ stay: SanctuaryStay; height: number; isDarkTheme: boolean }> = ({
  stay,
  height,
  isDarkTheme,
}) => (
  <div
    className={`relative w-full rounded-2xl overflow-hidden border flex flex-col items-center justify-center gap-3 px-6 text-center ${
      isDarkTheme ? 'bg-[#0d1015] border-white/10' : 'bg-stone-100 border-stone-200'
    }`}
    style={{ height }}
  >
    <div
      className="absolute inset-0 opacity-[0.14]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(212,175,55,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.6) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />
    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40">
      <MapPin className="w-5 h-5 text-[#d4af37]" />
    </div>
    <div className="relative">
      <div className="font-editorial text-sm text-[#d4af37]">
        {stay.location.city}, {stay.location.country}
      </div>
      <div className={`text-[11px] mt-0.5 ${isDarkTheme ? 'text-white/55' : 'text-stone-500'}`}>
        {stay.location.coordinates.lat.toFixed(4)}°, {stay.location.coordinates.lng.toFixed(4)}°
      </div>
    </div>
    <p className={`relative text-[11px] max-w-xs ${isDarkTheme ? 'text-white/50' : 'text-stone-500'}`}>
      Interactive map preview appears when a Google Maps key is configured.
    </p>
  </div>
);

export const StayLocationMap: React.FC<StayLocationMapProps> = ({ stay, isDarkTheme, height = 260 }) => {
  const { lat, lng } = stay.location.coordinates;

  const overlay = (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-3">
      <div className="flex justify-start">
        <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] text-white">
          <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="font-editorial tracking-wide">
            {stay.location.city}, {stay.location.state}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={directionsToStay(stay)}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d4af37] text-black text-[11px] font-semibold uppercase tracking-wider hover:bg-[#e4c256] transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          Get Directions
        </a>
        <a
          href={openInMaps(stay)}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 text-white text-[11px] font-medium hover:border-[#d4af37]/60 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
          Open in Maps
        </a>
      </div>
    </div>
  );

  if (!API_KEY) {
    return <LocationFallback stay={stay} height={height} isDarkTheme={isDarkTheme} />;
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border ${
        isDarkTheme ? 'border-white/10' : 'border-stone-200'
      }`}
      style={{ height }}
    >
      <MapErrorBoundary fallback={<LocationFallback stay={stay} height={height} isDarkTheme={isDarkTheme} />}>
        <APIProvider apiKey={API_KEY} language="en">
          <GoogleMap
            mapId={MAP_ID}
            colorScheme={isDarkTheme ? ColorScheme.DARK : ColorScheme.LIGHT}
            defaultCenter={{ lat, lng }}
            defaultZoom={13}
            minZoom={3}
            maxZoom={18}
            gestureHandling="cooperative"
            disableDefaultUI
            clickableIcons={false}
            style={{ width: '100%', height: '100%' }}
            className="absolute inset-0 z-0"
          >
            <AdvancedMarker
              position={{ lat, lng }}
              title={stay.title}
              anchorLeft="-50%"
              anchorTop="-100%"
            >
              <div className={`snc-marker-pill ${isDarkTheme ? 'is-dark' : 'is-light'} is-active`}>
                <MapPin className="w-3.5 h-3.5" />
                {stay.location.city}
              </div>
            </AdvancedMarker>
          </GoogleMap>
          {overlay}
        </APIProvider>
      </MapErrorBoundary>
    </div>
  );
};

export default StayLocationMap;
