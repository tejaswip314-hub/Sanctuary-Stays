'use client';

import React from 'react';
import { Compass, Mountain, Trees, Landmark, Waves, Building2, Globe } from 'lucide-react';

interface CategoryPillsProps {
  selectedCollection: string;
  onSelectCollection: (col: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCollection,
  onSelectCollection,
}) => {
  const categories = [
    { id: 'All', label: 'All Curations', icon: Compass },
    { id: 'Palace & Heritage Havens', label: 'Palace & Heritage Havens', icon: Landmark },
    { id: 'Himalayan Sanctuaries', label: 'Himalayan Sanctuaries', icon: Mountain },
    { id: 'Coastal & River Pavilions', label: 'Coastal & River Pavilions', icon: Waves },
    { id: 'Forest & Plantation Retreats', label: 'Forest & Plantation Retreats', icon: Trees },
    { id: 'Metropolitan Residences', label: 'Metropolitan Residences', icon: Building2 },
    { id: 'World Sanctuaries', label: 'World Sanctuaries', icon: Globe },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-start md:justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-3 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCollection === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCollection(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#d4af37] text-black font-semibold shadow-md shadow-[#d4af37]/20 scale-105'
                  : 'glass-pill text-[#b3ac9f] hover:text-white hover:border-[#d4af37]/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-[#d4af37]'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
