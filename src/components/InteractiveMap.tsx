'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  ColorScheme,
  Map as GoogleMap,
  useMap,
} from '@vis.gl/react-google-maps';
import { SanctuaryStay } from '../types/sanctuary';
import {
  VolumeX,
  Moon,
  Shield,
  Sparkles,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  ExternalLink,
  KeyRound,
} from 'lucide-react';

interface InteractiveMapProps {
  sanctuaries: SanctuaryStay[];
  selectedSanctuary: SanctuaryStay | null;
  hoveredSanctuaryId: string | null;
  onHoverSanctuary: (id: string | null) => void;
  onSelectSanctuary: (stay: SanctuaryStay) => void;
  isDarkTheme: boolean;
}

/**
 * Google Maps JavaScript API key (client-side, restricted by HTTP referrer).
 * Inlined at build time — set it in `.env.local` as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
 */
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
/**
 * Optional Google Cloud "Map ID" for vector styling + Advanced Markers.
 * Falls back to Google's shared DEMO_MAP_ID for local testing.
 */
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID';

const WORLD_CENTER = { lat: 20, lng: 20 };
const WORLD_ZOOM = 2;
const MAP_PADDING = 48;

interface BoundsLiteral {
  north: number;
  south: number;
  east: number;
  west: number;
}

function computeBounds(sanctuaries: SanctuaryStay[]): BoundsLiteral | null {
  if (sanctuaries.length === 0) return null;
  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;
  sanctuaries.forEach((s) => {
    const { lat, lng } = s.location.coordinates;
    north = Math.max(north, lat);
    south = Math.min(south, lat);
    east = Math.max(east, lng);
    west = Math.min(west, lng);
  });
  return { north, south, east, west };
}

interface MapSurfaceProps extends InteractiveMapProps {
  loadError: boolean;
}

const MapSurface: React.FC<MapSurfaceProps> = ({
  sanctuaries,
  selectedSanctuary,
  hoveredSanctuaryId,
  onHoverSanctuary,
  onSelectSanctuary,
  isDarkTheme,
  loadError,
}) => {
  const map = useMap();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePinStay, setActivePinStay] = useState<SanctuaryStay | null>(
    sanctuaries.length > 0 ? sanctuaries[0] : null
  );

  // Keep latest callbacks accessible without re-binding marker handlers.
  const hoverRef = useRef(onHoverSanctuary);
  const selectRef = useRef(onSelectSanctuary);
  useEffect(() => {
    hoverRef.current = onHoverSanctuary;
  }, [onHoverSanctuary]);
  useEffect(() => {
    selectRef.current = onSelectSanctuary;
  }, [onSelectSanctuary]);

  // Fit the camera to the visible stays whenever the data set changes.
  useEffect(() => {
    if (!map) return;
    try {
      const bounds = computeBounds(sanctuaries);
      if (!bounds) return;
      const isSingle = bounds.north === bounds.south && bounds.east === bounds.west;
      if (isSingle) {
        map.panTo({ lat: bounds.north, lng: bounds.east });
        map.setZoom(9);
      } else {
        map.fitBounds(bounds, MAP_PADDING);
      }
    } catch (err) {
      console.error('Error fitting map bounds:', err);
    }
  }, [map, sanctuaries]);

  // Pan/zoom to a selected stay.
  useEffect(() => {
    if (!map || !selectedSanctuary) return;
    map.panTo({
      lat: selectedSanctuary.location.coordinates.lat,
      lng: selectedSanctuary.location.coordinates.lng,
    });
    const current = map.getZoom() ?? WORLD_ZOOM;
    map.setZoom(Math.max(current, 8));
  }, [map, selectedSanctuary]);

  // Track fullscreen state.
  useEffect(() => {
    const handler = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const zoomIn = useCallback(() => {
    const z = map?.getZoom();
    if (map && typeof z === 'number') map.setZoom(z + 1);
  }, [map]);

  const zoomOut = useCallback(() => {
    const z = map?.getZoom();
    if (map && typeof z === 'number') map.setZoom(z - 1);
  }, [map]);

  const recenter = useCallback(() => {
    if (!map) return;
    map.panTo(WORLD_CENTER);
    map.setZoom(WORLD_ZOOM);
  }, [map]);

  const toggleFullscreen = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (document.fullscreenElement === wrapper) {
      document.exitFullscreen?.();
    } else {
      wrapper.requestFullscreen?.();
    }
  }, []);

  const currentHighlight =
    sanctuaries.find((s) => s.id === hoveredSanctuaryId) ||
    selectedSanctuary ||
    activePinStay ||
    sanctuaries[0];

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full min-h-[540px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all"
      style={{ backgroundColor: isDarkTheme ? '#0d1015' : '#eee8de' }}
    >
      {/* Google Maps canvas */}
      <GoogleMap
        mapId={MAP_ID}
        colorScheme={isDarkTheme ? ColorScheme.DARK : ColorScheme.LIGHT}
        defaultCenter={WORLD_CENTER}
        defaultZoom={WORLD_ZOOM}
        minZoom={2}
        maxZoom={17}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}
        onTilesLoaded={() => setMapReady(true)}
        style={{ width: '100%', height: '100%' }}
        className="absolute inset-0 z-0"
      >
        {sanctuaries.map((stay) => {
          const isActive =
            stay.id === hoveredSanctuaryId || stay.id === selectedSanctuary?.id;
          const pillClass = `snc-marker-pill ${isDarkTheme ? 'is-dark' : 'is-light'} ${
            isActive ? 'is-active' : ''
          }`;
          return (
            <AdvancedMarker
              key={stay.id}
              position={{
                lat: stay.location.coordinates.lat,
                lng: stay.location.coordinates.lng,
              }}
              title={stay.title}
              clickable
              anchorLeft="-50%"
              anchorTop="-50%"
              className="snc-marker"
              onMouseEnter={() => {
                hoverRef.current(stay.id);
                setActivePinStay(stay);
              }}
              onMouseLeave={() => hoverRef.current(null)}
              onClick={() => selectRef.current(stay)}
            >
              <div className={pillClass}>₹{stay.nightlyPrice.toLocaleString('en-IN')}</div>
            </AdvancedMarker>
          );
        })}
      </GoogleMap>

      {/* Theme-adaptive vignette so overlays stay legible */}
      <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_120px_rgba(0,0,0,0.28)]" />

      {/* Interactive Map Header Controls */}
      <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="font-editorial text-white tracking-wider">Global Curated Coordinates</span>
          <span className="text-white/40">• {sanctuaries.length} Stays</span>
        </div>

        {/* Map Controls */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 text-white">
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
            suppressHydrationWarning
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
            suppressHydrationWarning
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={recenter}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Recenter World"
            aria-label="Recenter map"
            suppressHydrationWarning
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label="Toggle fullscreen"
            suppressHydrationWarning
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Loading shimmer while tiles initialise */}
      {!mapReady && !loadError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="animate-pulse-soft flex items-center space-x-2 text-xs uppercase tracking-widest text-[#d4af37]">
            <Sparkles className="w-4 h-4" />
            <span>Plotting sanctuaries…</span>
          </div>
        </div>
      )}

      {/* Load failure (e.g. invalid key / billing disabled) */}
      {loadError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <KeyRound className="w-5 h-5 text-[#d4af37]" />
          <p className="text-sm text-white/85 font-medium">Google Maps failed to load</p>
          <p className="text-xs text-white/55 max-w-sm">
            Check that the Maps JavaScript API is enabled and the key in{' '}
            <code className="px-1 rounded bg-white/10">.env.local</code> is valid for this origin.
          </p>
        </div>
      )}

      {/* Floating Neighborhood Vibe & Noise Card */}
      {currentHighlight && (
        <div className="absolute bottom-0 left-0 right-0 z-20 mx-3 sm:mx-4 mb-8 sm:mb-9 p-4 sm:p-5 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 text-white shadow-2xl transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onSelectSanctuary(currentHighlight)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentHighlight.coverImage}
                alt={currentHighlight.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-white/15"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                    {currentHighlight.location.city}, {currentHighlight.location.state}
                  </span>
                  <span className="text-white/40">•</span>
                  <span className="text-[10px] text-white/70">
                    {currentHighlight.architecturalStyle}
                  </span>
                </div>
                <h4 className="font-editorial text-sm sm:text-base text-white font-medium group-hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span>{currentHighlight.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-xs border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-4">
              <div className="space-y-0.5" title="Acoustic Ambient Decibels">
                <div className="flex items-center space-x-1 text-[#d4af37] text-[10px] uppercase font-semibold">
                  <VolumeX className="w-3 h-3" />
                  <span>Acoustics</span>
                </div>
                <div className="text-[11px] font-medium text-white truncate">
                  {currentHighlight.neighborhoodVibe.noiseLevel}
                </div>
              </div>

              <div className="space-y-0.5" title="Bortle Dark Sky Class">
                <div className="flex items-center space-x-1 text-[#d4af37] text-[10px] uppercase font-semibold">
                  <Moon className="w-3 h-3" />
                  <span>Dark Sky</span>
                </div>
                <div className="text-[11px] font-medium text-white truncate">
                  {currentHighlight.neighborhoodVibe.darkSkyClass}
                </div>
              </div>

              <div className="space-y-0.5" title="Secluded Private Perimeter">
                <div className="flex items-center space-x-1 text-[#d4af37] text-[10px] uppercase font-semibold">
                  <Shield className="w-3 h-3" />
                  <span>Privacy</span>
                </div>
                <div className="text-[11px] font-medium text-white">
                  {currentHighlight.neighborhoodVibe.privacyScore} / 100 Score
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MissingKeyPlaceholder: React.FC = () => (
  <div
    className="relative w-full h-full min-h-[540px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-3 px-8 text-center"
    style={{ backgroundColor: '#0d1015' }}
  >
    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30">
      <KeyRound className="w-5 h-5 text-[#d4af37]" />
    </div>
    <h3 className="font-editorial text-lg text-white">Connect Google Maps</h3>
    <p className="text-xs text-white/60 max-w-md leading-relaxed">
      Add your Google Maps JavaScript API key to{' '}
      <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#d4af37]">.env.local</code> as{' '}
      <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#d4af37]">
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </code>{' '}
      (optionally <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#d4af37]">
        NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
      </code>
      ), then restart the dev server.
    </p>
  </div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Map component error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="relative w-full h-full min-h-[540px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-3 px-8 text-center"
          style={{ backgroundColor: '#0d1015' }}
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30">
            <KeyRound className="w-5 h-5 text-[#d4af37]" />
          </div>
          <h3 className="font-editorial text-lg text-white">Interactive Map Unavailable</h3>
          <p className="text-xs text-white/60 max-w-md leading-relaxed">
            There was an issue initializing the map view. You can continue browsing sanctuaries in the grid view.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export const InteractiveMap: React.FC<InteractiveMapProps> = (props) => {
  const [loadError, setLoadError] = useState(false);

  if (!API_KEY) {
    return <MissingKeyPlaceholder />;
  }

  return (
    <MapErrorBoundary>
      <APIProvider
        apiKey={API_KEY}
        language="en"
        onError={() => setLoadError(true)}
      >
        <MapSurface {...props} loadError={loadError} />
      </APIProvider>
    </MapErrorBoundary>
  );
};

export default InteractiveMap;
