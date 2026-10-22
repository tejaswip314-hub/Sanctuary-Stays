'use client';

import React from 'react';
import { Map, Satellite, Mountain } from 'lucide-react';

export type MapType = 'roadmap' | 'satellite' | 'terrain';

const MAP_TYPES = [
  { id: 'roadmap', label: 'Default', Icon: Map },
  { id: 'satellite', label: 'Satellite', Icon: Satellite },
  { id: 'terrain', label: 'Terrain', Icon: Mountain },
] as const;

interface MapTypeSwitcherProps {
  value: MapType;
  onChange: (value: MapType) => void;
  className?: string;
}

export const MapTypeSwitcher: React.FC<MapTypeSwitcherProps> = ({
  value,
  onChange,
  className = '',
}) => (
  <div
    role="group"
    aria-label="Map type"
    className={`pointer-events-auto flex items-center gap-1 rounded-xl border border-white/10 bg-black/60 p-1 text-white backdrop-blur-md ${className}`}
  >
    {MAP_TYPES.map(({ id, label, Icon }) => {
      const isActive = id === value;
      return (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          title={`${label} map`}
          aria-label={`${label} map`}
          aria-pressed={isActive}
          suppressHydrationWarning
          className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            isActive
              ? 'bg-[#d4af37] text-black shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      );
    })}
  </div>
);

export default MapTypeSwitcher;
