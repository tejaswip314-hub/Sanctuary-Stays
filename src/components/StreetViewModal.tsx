'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Compass, ExternalLink, Loader2, MapPin, X } from 'lucide-react';

interface StreetViewModalProps {
  lat: number;
  lng: number;
  title: string;
  onClose: () => void;
}

type StreetViewStatus = 'loading' | 'ready' | 'unavailable' | 'error';

export const StreetViewModal: React.FC<StreetViewModalProps> = ({
  lat,
  lng,
  title,
  onClose,
}) => {
  const streetViewLibrary = useMapsLibrary('streetView');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const [status, setStatus] = useState<StreetViewStatus>('loading');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const container = containerRef.current;
    if (!streetViewLibrary || !container) return;

    let cancelled = false;
    const service = new streetViewLibrary.StreetViewService();

    service
      .getPanorama({
        location: { lat, lng },
        radius: 1000,
        preference: streetViewLibrary.StreetViewPreference.NEAREST,
        sources: [streetViewLibrary.StreetViewSource.OUTDOOR],
      })
      .then((response) => {
        if (cancelled) return;
        const location = response.data?.location;
        if (!location?.pano) {
          setStatus('unavailable');
          return;
        }

        container.innerHTML = '';
        panoramaRef.current = new streetViewLibrary.StreetViewPanorama(container, {
          pano: location.pano,
          position: location.latLng ?? { lat, lng },
          pov: { heading: 0, pitch: 0 },
          zoom: 1,
          addressControl: true,
          clickToGo: true,
          enableCloseButton: false,
          fullscreenControl: false,
          motionTracking: false,
          showRoadLabels: true,
          visible: true,
        });
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
      panoramaRef.current?.setVisible(false);
      panoramaRef.current = null;
      if (container) container.innerHTML = '';
    };
  }, [streetViewLibrary, lat, lng]);

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Street View for ${title}`}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-3 backdrop-blur-xl sm:p-6"
    >
      <div className="relative flex h-[82vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#d4af37]/30 bg-[#0d1015] shadow-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-xs text-white backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="max-w-[52vw] truncate font-editorial tracking-wide">
              {title}
            </span>
            <span className="hidden items-center gap-1 text-white/50 sm:flex">
              <MapPin className="w-3 h-3" />
              Street View
            </span>
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <a
              href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-white/15 bg-black/70 px-3 py-2 text-[11px] font-medium text-white backdrop-blur-md transition-colors hover:border-[#d4af37]/60 sm:inline-flex"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
              Open in Maps
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Street View"
              className="rounded-full border border-white/15 bg-black/70 p-2 text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={containerRef} className="absolute inset-0" />

        {status !== 'ready' && (
          <div className="absolute inset-0 z-[5] flex flex-col items-center justify-center gap-3 px-8 text-center">
            {status === 'loading' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
                <p className="text-sm text-white/80">Locating the nearest Street View panorama…</p>
              </>
            ) : (
              <>
                <MapPin className="w-6 h-6 text-[#d4af37]" />
                <p className="text-sm font-medium text-white">
                  {status === 'unavailable'
                    ? 'No Street View imagery covers this location yet.'
                    : 'Street View could not be loaded.'}
                </p>
                <p className="max-w-sm text-xs text-white/55">
                  Use the satellite or terrain map layers for an aerial view of the estate, or open
                  the location directly in Google Maps.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default StreetViewModal;
