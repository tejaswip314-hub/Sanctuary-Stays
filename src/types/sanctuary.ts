export type ArchitecturalStyle =
  | 'Indo-Portuguese Modernism'
  | 'Himalayan Rammed Earth'
  | 'Rajputana Heritage Monolith'
  | 'Kerala Vernacular'
  | 'Tropical Planters Estate'
  | 'Kumaon Slate Brutalism'
  | 'Chettinad Colonial'
  | 'Deccan Rock Vernacular'
  | 'Colonial Indo-Saracenic'
  | 'Areca & Bamboo Organic'
  | 'Shekhawati Fresco Haveli'
  | 'Vijayanagara Stone Vernacular'
  | 'Art Deco Coastal Modernism'
  | 'Lutyens Colonial Revival'
  | 'Madras Terrace Colonial'
  | 'Bengal Colonial Revival'
  | 'Doon Valley Estate'
  | 'Ganga Riverside Himalayan'
  | 'Japanese Machiya Modernism'
  | 'Balinese Bamboo Organic'
  | 'Tuscan Pietra Vernacular'
  | 'Moroccan Riad Courtyard'
  | 'California Cliff Modernism'
  | 'Cycladic Cave Vernacular'
  | 'Cape Dutch Colonial'
  | 'Swiss Alpine Chalet'
  | 'Southern Alps Timber Modernism';

export interface AcousticFrequencyBreakdown {
  lowFreqIsolationDb: number;
  midFreqIsolationDb: number;
  highFreqIsolationDb: number;
  glassGlazingType: string;
  ambientNoiseDescription: string;
}

export interface NeighborhoodVibeRating {
  noiseLevel: string;
  darkSkyClass: string;
  privacyScore: number;
  nearestAirportMins: number;
  culinaryProximity: string;
}

export interface VerifiedGuestReview {
  id: string;
  guestName: string;
  guestRole: string;
  stayDate: string;
  rating: number;
  comment: string;
  vettedHighlight: string;
}

export interface VettingStandardAudit {
  overallScore: number;
  acousticLevelDb: number;
  acousticFrequencies: AcousticFrequencyBreakdown;
  beddingBrand: string;
  beddingScore: number;
  culinaryScore: number;
  wifiSpeedMbps: number;
  curationJuryNote: string;
  choreFreeCheckout: boolean;
  artisanCoffee: string;
  wellnessHighlights: string[];
}

export interface ConciergeAddon {
  id: string;
  title: string;
  description: string;
  pricePerDayOrService: number; // in INR
  unit: 'per day' | 'per stay' | 'per person';
  badge?: string;
}

export interface SanctuaryStay {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  architect?: {
    name: string;
    yearBuilt: number;
    description: string;
  };
  architecturalStyle: ArchitecturalStyle;
  collection:
    | 'Palace & Heritage Havens'
    | 'Himalayan Sanctuaries'
    | 'Coastal & River Pavilions'
    | 'Forest & Plantation Retreats'
    | 'Metropolitan Residences'
    | 'World Sanctuaries';
  nightlyPrice: number; // in INR
  currency: 'INR';
  cleaningFee: number;
  guestCapacity: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rating: number;
  reviewCount: number;
  coverImage: string;
  galleryImages: string[];
  tagline: string;
  description: string;
  curatorQuote: string;
  curatorName: string;
  neighborhoodVibe: NeighborhoodVibeRating;
  vettingAudit: VettingStandardAudit;
  availableConciergeServices: ConciergeAddon[];
  amenities: string[];
  reviews: VerifiedGuestReview[];
  rules: {
    minimumNights: number;
    eventsAllowed: boolean;
    petsAllowed: boolean;
  };
}

export interface ReservationRequest {
  id?: string;
  sanctuaryId: string;
  sanctuaryTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  selectedAddonIds: string[];
  totalNights: number;
  subtotal: number;
  conciergeTotal: number;
  taxesAndService: number;
  totalPrice: number;
  specialRequests?: string;
  createdAt: string;
}
