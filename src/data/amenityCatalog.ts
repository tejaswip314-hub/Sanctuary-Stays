import { SanctuaryStay } from '../types/sanctuary';

type Collection = SanctuaryStay['collection'];
type AmenityGroup = { label: string; items: string[] };

/**
 * Amenities every Sanctuary in the collective provides to guests,
 * regardless of collection or location.
 */
export const COLLECTIVE_AMENITIES: string[] = [
  'High-Speed Fibre Wi-Fi (500+ Mbps)',
  '24/7 Dedicated Concierge & House Manager',
  'Zero-Chore Turnkey Departure Housekeeping',
  'Organic Cotton & Mulberry Silk Bed Linens',
  'Blackout Drapes & Curated Pillow Menu',
  'Espresso Bar & Single-Origin Coffee',
  'Artisan Tea & Welcome Refreshments',
  'Bang & Olufsen Bluetooth Sound System',
  'Smart Climate Control & Air Purification',
  'EV Charger On-Site',
  'Daily Housekeeping & Linen Refresh',
  'Bespoke Welcome Hamper & Local Guide',
  'In-Villa Safe & 24/7 Security',
  'First-Aid Kit & Fire Safety Stations',
  'Board Games, Library & Vinyl Collection',
  'Complimentary Airport Welcome Transfer',
];

/**
 * Signature amenities layered on top of the collective standard,
 * tailored to each curation collection.
 */
export const COLLECTION_AMENITIES: Record<Collection, string[]> = {
  'Palace & Heritage Havens': [
    'Royal Butler & Khansama Service',
    'Heritage Artefact Guided Walk',
    'Private Courtyard Folk Music Evening',
    'Regal Silver-Service Dining',
  ],
  'Himalayan Sanctuaries': [
    'Guided Mountain & Forest Treks',
    'Bonfire & Stargazing Deck',
    'Radiant Heating & Hot Water Bottles',
    'Altitude Wellness & Oxygen Kit',
  ],
  'Coastal & River Pavilions': [
    'Private Jetty & Boat Access',
    'Kayaks & Paddleboards',
    'Al Fresco Waterfront Dining',
    'Beach & River Towel Service',
  ],
  'Forest & Plantation Retreats': [
    'Estate Nature & Plantation Walks',
    'Organic Estate Produce Basket',
    'Birdwatching & Wildlife Guides',
    'Outdoor Fire Pit & Barbecue',
  ],
  'Metropolitan Residences': [
    'Private Gym & Wellness Studio',
    'Chauffeur & Luxury Car Hire',
    'Business Lounge & Dedicated Workspace',
    'In-Residence Spa & Massage',
  ],
  'World Sanctuaries': [
    'Multilingual Guest Host',
    'Private Chef & Sommelier',
    'Curated Local Cultural Experiences',
    'In-Residence Spa Therapist',
  ],
};

/**
 * Merges the stay-specific amenities with the collective + collection standards,
 * de-duplicating while preserving order (stay-specific first).
 */
export function withAmenities(stays: SanctuaryStay[]): SanctuaryStay[] {
  return stays.map((stay) => {
    const merged = Array.from(
      new Set([
        ...stay.amenities,
        ...COLLECTIVE_AMENITIES,
        ...COLLECTION_AMENITIES[stay.collection],
      ])
    );
    return { ...stay, amenities: merged };
  });
}

/**
 * Optional grouped view used by the detail modal: partitions a flat amenity
 * list into themed sections so guests can scan offerings quickly.
 */
export function groupAmenities(amenities: string[]): AmenityGroup[] {
  const groups: AmenityGroup[] = [
    { label: 'Wellness & Spa', items: [] },
    { label: 'Culinary & Refreshments', items: [] },
    { label: 'Technology & Comfort', items: [] },
    { label: 'Outdoors & Experiences', items: [] },
    { label: 'Services & Safety', items: [] },
  ];

  const push = (label: string, item: string) => {
    const g = groups.find((x) => x.label === label);
    if (g) g.items.push(item);
  };

  for (const item of amenities) {
    const l = item.toLowerCase();
    if (/(spa|massage|sauna|hammam|steam|wellness|yoga|gym|fitness|plunge|pool|thermal|oxygen|thérapist|therapist|bath)/.test(l)) {
      push('Wellness & Spa', item);
    } else if (/(chef|dining|kitchen|cook|feast|culinary|coffee|espresso|tea|refreshment|hamper|breakfast|barbecue|bbq|sommelier|butler|silver-service|produce|pillow|linen|linens|bed)/.test(l)) {
      push('Culinary & Refreshments', item);
    } else if (/(wi-fi|wifi|internet|fibre|fiber|broadband|sound|bluetooth|smart|climate|air purification|ev charger|charger|safe|games|library|vinyl|projector|screen)/.test(l)) {
      push('Technology & Comfort', item);
    } else if (/(jetty|boat|kayak|paddle|beach|river|waterfront|lake|sea|ocean|trek|trail|mountain|forest|estate|nature|plantation|walk|garden|orchard|stargaz|bonfire|fire pit|cruise|excursion|tour|cultural)/.test(l)) {
      push('Outdoors & Experiences', item);
    } else {
      push('Services & Safety', item);
    }
  }

  return groups.filter((g) => g.items.length > 0);
}
