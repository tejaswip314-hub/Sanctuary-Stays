# Data & API Specification

> **Currency:** Indian Rupee (`INR` / `₹`) with `en-IN` number formatting — used uniformly across the **global** portfolio (international nightly rates are stored as INR equivalents).  
> **Schema Location:** `src/types/sanctuary.ts`  
> **Data Repository:** `src/data/sanctuaries.ts` (India catalog) + `src/data/sanctuaries-global.ts` (new Indian-city & international stays), combined into the exported `SANCTUARIES` array.  
> **Last Updated:** 2026-10-19

---

## 1. Core Data Models (`src/types/sanctuary.ts`)

### `SanctuaryStay`
Represents an individual curated property worldwide (India and international):
```typescript
export interface SanctuaryStay {
  id: string;                                // e.g. "sanctuary-in-01"
  slug: string;                              // URL slug
  title: string;                             // Property title
  subtitle: string;                          // Architecture summary subtitle
  location: {
    city: string;
    state: string;                           // State / region (e.g. Rajasthan, Tuscany, Kansai)
    country: string;                         // e.g. "India", "Japan", "Italy"
    coordinates: { lat: number; lng: number };
  };
  architect?: {
    name: string;
    yearBuilt: number;
    description: string;
  };
  architecturalStyle: ArchitecturalStyle;
  collection: 'Palace & Heritage Havens' | 'Himalayan Sanctuaries' | 'Coastal & River Pavilions' | 'Forest & Plantation Retreats' | 'Metropolitan Residences' | 'World Sanctuaries';
  nightlyPrice: number;                      // In INR (e.g. 125000)
  currency: 'INR';
  cleaningFee: 0;                            // Guaranteed 0 (turnkey)
  guestCapacity: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rating: number;                            // 4.90 - 5.00
  reviewCount: number;
  coverImage: string;                        // High-res Unsplash image URL
  galleryImages: string[];
  tagline: string;
  description: string;
  curatorQuote: string;
  curatorName: string;
  neighborhoodVibe: NeighborhoodVibeRating;
  vettingAudit: VettingStandardAudit;
  availableConciergeServices: ConciergeAddon[];
  amenities: string[];                       // stay-specific + collective + collection standards (merged)
  reviews: VerifiedGuestReview[];
  rules: {
    minimumNights: number;
    eventsAllowed: boolean;
    petsAllowed: boolean;
  };
}
```

### `VettingStandardAudit` & `AcousticFrequencyBreakdown`
Tracks acoustic test decibels and frequency-specific isolation:
```typescript
export interface AcousticFrequencyBreakdown {
  lowFreqIsolationDb: number;     // 125–250 Hz Traffic & Bass rumble
  midFreqIsolationDb: number;     // 500–1000 Hz Speech & Ambient noise
  highFreqIsolationDb: number;    // 2k–4k Hz Wind & Weather turbulence
  glassGlazingType: string;       // e.g. "Triple-glazed argon-insulated alpine low-E glass"
  ambientNoiseDescription: string;
}

export interface VettingStandardAudit {
  overallScore: number;           // e.g. 99.7 / 100
  acousticLevelDb: number;        // e.g. 21 dB whisper quiet
  acousticFrequencies: AcousticFrequencyBreakdown;
  beddingBrand: string;
  beddingScore: number;           // 0 - 100
  culinaryScore: number;          // 0 - 100
  wifiSpeedMbps: number;          // Symmetrical tested speed
  curationJuryNote: string;
  choreFreeCheckout: boolean;     // always true
  artisanCoffee: string;
  wellnessHighlights: string[];
}
```

### Amenity Catalog (`src/data/amenityCatalog.ts`)
- **`COLLECTIVE_AMENITIES`** — 16 amenities provided by **every** Sanctuary (fibre Wi-Fi, 24/7 concierge, zero-chore housekeeping, silk/organic linens, EV charger, welcome hamper, security, etc.).
- **`COLLECTION_AMENITIES`** — a `Record<Collection, string[]>` of 4 signature amenities per collection (e.g. *Metropolitan Residences* → private gym, chauffeur, business lounge, in-residence spa; *World Sanctuaries* → multilingual host, private chef & sommelier, curated local experiences, in-residence therapist).
- **`withAmenities(stays)`** — merges each stay's own amenities with the collective + its collection set, de-duplicating. Applied to the combined `SANCTUARIES` export so every stay presents a rich, varied amenity list (~22–26 items).
- **`groupAmenities(amenities)`** — partitions a flat amenity list into themed groups (Wellness & Spa, Culinary & Refreshments, Technology & Comfort, Outdoors & Experiences, Services & Safety) for the detail modal.

### `NeighborhoodVibeRating`
```typescript
export interface NeighborhoodVibeRating {
  noiseLevel: string;             // e.g. "Hilltop sanctuary silence (21 dB)"
  darkSkyClass: string;           // e.g. "Bortle Class 1 (Milky Way core cast shadows)"
  privacyScore: number;           // e.g. 99 / 100
  nearestAirportMins: number;     // e.g. 35 mins
  culinaryProximity: string;
}
```

---

## 2. Active Curated Properties Catalog (`src/data/sanctuaries.ts`)

| ID | Sanctuary Title | Location | Style | Nightly Rate | Vetting Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sanctuary-in-01` | **The Aravalli Sandstone Bastion** | Udaipur, Rajasthan | Rajputana Heritage Monolith | ₹1,25,000 | 99.7 |
| `sanctuary-in-02` | **The Chapora River Glass Pavilion** | Aldona, Goa | Indo-Portuguese Modernism | ₹68,000 | 99.5 |
| `sanctuary-in-03` | **The Nubra Earth Sanctum** | Diskit, Ladakh | Himalayan Rammed Earth | ₹85,000 | 99.8 |
| `sanctuary-in-04` | **The Vembanad Lake Teak Sanctum** | Kumarakom, Kerala | Kerala Vernacular | ₹54,000 | 99.4 |
| `sanctuary-in-05` | **The Kasar Devi Slate Cantilever** | Almora, Uttarakhand | Kumaon Slate Brutalism | ₹72,000 | 99.6 |
| `sanctuary-in-06` | **The Nilgiri Cloud Forest Estate** | Coonoor, Tamil Nadu | Tropical Planters Estate | ₹62,000 | 99.3 |
| `sanctuary-in-07` | **The Mandawa Fresco Haveli** | Mandawa, Rajasthan | Shekhawati Fresco Haveli | ₹12,500 | 96.4 |
| `sanctuary-in-08` | **The Karaikudi Chettinad Courtyard House** | Karaikudi, Tamil Nadu | Chettinad Colonial | ₹9,800 | 96.8 |
| `sanctuary-in-09` | **The Hampi Boulder Stone Retreat** | Hampi, Karnataka | Deccan Rock Vernacular | ₹10,900 | 96.2 |
| `sanctuary-in-10` | **The Sakleshpur Areca & Bamboo Canopy House** | Sakleshpur, Karnataka | Areca & Bamboo Organic | ₹8,500 | 95.6 |
| `sanctuary-in-11` | **The Puducherry Indo-Saracenic Villa** | Puducherry | Colonial Indo-Saracenic | ₹15,500 | 97.0 |
| `sanctuary-in-12` | **The Badami Sandstone Cave House** | Badami, Karnataka | Vijayanagara Stone Vernacular | ₹11,200 | 96.0 |
| `sanctuary-in-13` | **The Malabar Hill Sea-Facing Residence** | Mumbai, Maharashtra | Art Deco Coastal Modernism | ₹95,000 | 99.2 |
| `sanctuary-in-14` | **The Lutyens Bungalow Estate** | New Delhi, Delhi | Lutyens Colonial Revival | ₹88,000 | 99.3 |
| `sanctuary-in-15` | **The Mylapore Tamil Courtyard Villa** | Chennai, Tamil Nadu | Madras Terrace Colonial | ₹58,000 | 99.0 |
| `sanctuary-in-16` | **The Ballygunge Colonial Mansion** | Kolkata, West Bengal | Bengal Colonial Revival | ₹46,000 | 98.9 |
| `sanctuary-in-17` | **The Doon Valley Foothill Estate** | Dehradun, Uttarakhand | Doon Valley Estate | ₹42,000 | 99.4 |
| `sanctuary-in-18` | **The Ganga Riverside Ashram Villa** | Rishikesh, Uttarakhand | Ganga Riverside Himalayan | ₹38,000 | 99.5 |

### International Curated Properties (`src/data/sanctuaries-global.ts`)

| ID | Sanctuary Title | Location | Style | Nightly Rate | Vetting Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sanctuary-gl-01` | **The Higashiyama Machiya Temple House** | Kyoto, Japan | Japanese Machiya Modernism | ₹1,05,000 | 99.8 |
| `sanctuary-gl-02` | **The Ubud Rice-Terrace Bamboo Pavilion** | Ubud, Indonesia | Balinese Bamboo Organic | ₹72,000 | 99.5 |
| `sanctuary-gl-03` | **The Val d’Orcia Stone Podere** | Pienza, Italy | Tuscan Pietra Vernacular | ₹1,25,000 | 99.6 |
| `sanctuary-gl-04` | **The Marrakech Atlas Riad** | Marrakech, Morocco | Moroccan Riad Courtyard | ₹68,000 | 99.3 |
| `sanctuary-gl-05` | **The Malibu Cliff Glass House** | Malibu, United States | California Cliff Modernism | ₹1,45,000 | 99.6 |
| `sanctuary-gl-06` | **The Oia Caldera Cave Villa** | Oia, Greece | Cycladic Cave Vernacular | ₹98,000 | 99.7 |
| `sanctuary-gl-07` | **The Cape Winelands Veld Estate** | Stellenbosch, South Africa | Cape Dutch Colonial | ₹78,000 | 99.4 |
| `sanctuary-gl-08` | **The Zermatt Alpine Timber Chalet** | Zermatt, Switzerland | Swiss Alpine Chalet | ₹1,35,000 | 99.8 |
| `sanctuary-gl-09` | **The Wakatipu Lake Alpine Lodge** | Queenstown, New Zealand | Southern Alps Timber Modernism | ₹1,15,000 | 99.6 |

> **Portfolio note:** `sanctuary-in-07` through `sanctuary-in-12` form the **accessible heritage tier** (₹8,500–₹15,500 / night), broadening the collective beyond ultra-luxury rates while retaining the same 100-point vetting rubric.
>
> **Global expansion note:** `sanctuary-in-13` through `sanctuary-in-18` add the **Metropolitan Residences** collection (Mumbai, Delhi, Chennai, Kolkata) alongside two new Himalayan foothill sanctuaries (Dehradun, Rishikesh). `sanctuary-gl-01` through `sanctuary-gl-09` introduce the **World Sanctuaries** collection across nine countries. All international rates are stored as INR equivalents to preserve uniform `en-IN` pricing.

---

## 3. Backend API Endpoints

### 1. `POST /api/bookings`
- **Request Body**:
  ```json
  {
    "sanctuaryId": "sanctuary-in-01",
### 1. `POST /api/bookings`
- **Purpose**: Concurrency-protected, idempotent reservation creation and hold placement.
- **Request Body**:
  ```json
  {
    "idempotencyKey": "snc_1792160000_abc12",
    "sanctuaryId": "sanctuary-in-01",
    "guestId": "usr_guest_01",
    "guestName": "Aarav Sharma",
    "guestEmail": "aarav@sanctuaryguest.in",
    "checkIn": "2026-11-20",
    "checkOut": "2026-11-23",
    "guests": 2,
    "action": "CONFIRM"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "reservation": {
      "id": "res_98124a",
      "referenceCode": "SNC-397174",
      "sanctuaryId": "sanctuary-in-01",
      "sanctuaryTitle": "The Aravalli Sandstone Bastion",
      "status": "CONFIRMED",
      "paymentStatus": "SUCCEEDED",
      "checkIn": "2026-11-20",
      "checkOut": "2026-11-23",
      "nights": 3,
      "guests": 2,
      "quote": {
        "nightlyRate": 125000,
        "baseStayAmount": 375000,
        "cleaningFee": 4500,
        "preservationFee": 18750,
        "taxesGst": 71685,
        "grandTotal": 469935,
        "currency": "INR"
      },
      "assignedLiaison": {
        "name": "Raghavendra Singh",
        "title": "Lead Global Heritage Stay Liaison"
      },
      "choreGuarantee": "Zero-Chore Turnkey Departure Guaranteed"
    }
  }
  ```
- **Error Response (`409 Conflict`)**: Returned when overlapping dates are confirmed or held by another guest:
  ```json
  {
    "success": false,
    "error": "These dates are already confirmed until 2026-11-23. Please select alternative dates."
  }
  ```

---

### 2. `POST /api/pricing/quote`
- **Purpose**: Authoritative, deterministic server-side price calculation (FR-PRICE-001 through FR-PRICE-008).
- **Request Body**:
  ```json
  {
    "sanctuaryId": "sanctuary-in-01",
    "checkIn": "2026-11-20",
    "checkOut": "2026-11-23",
    "guests": 2
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "quote": {
      "quoteId": "quo_memn7ro_1792159925671",
      "nights": 3,
      "nightlyRate": 125000,
      "baseStayAmount": 375000,
      "cleaningFee": 4500,
      "preservationFee": 18750,
      "taxesGst": 71685,
      "grandTotal": 469935,
      "currency": "INR",
      "expiresAt": "2026-10-16T14:27:05.671Z"
    }
  }
  ```

---

### 3. `POST /api/bookings/[id]/cancel`
- **Purpose**: Reservation cancellation with policy-governed automated refund calculation.
- **Request Body**:
  ```json
  {
    "cancelledBy": "GUEST",
    "reason": "Flight rescheduled"
  }
  ```
- **Refund Rules**:
  - Cancelled by Host or >7 days before check-in: 100% refund.
  - Cancelled by Guest 48h–7d before check-in: 50% refund.
  - Cancelled <48h before check-in: Cleaning fee refunded.

---

### 4. `POST /api/auth/login` & `POST /api/auth/register`
- **Purpose**: Session creation and user registration with role specification (`GUEST`, `HOST`, `PROPERTY_MANAGER`, `ADMIN`).
- **Endpoint**: `GET /api/auth/personas` returns instant test personas.

---

### 5. `POST /api/concierge`
- **Request Body**:
  ```json
  {
    "name": "Ananya Singhania",
    "email": "ananya@studio.in",
    "phone": "+91 98200 12345",
    "serviceType": "Private Royal Maharaj Chef",
    "message": "Custom Mewari dinner for 6 guests on terrace"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "requestId": "CNCG-4829",
    "clientName": "Ananya Singhania",
    "serviceRequested": "Private Royal Maharaj Chef",
    "status": "DISPATCHED_TO_LIAISON",
    "guaranteedResponseWindowMinutes": 90,
    "timestamp": "2026-10-16T13:20:00.000Z"
  }
}
```

---

## 4. Environment Variables

Client-exposed variables must be prefixed with `NEXT_PUBLIC_` (inlined into the browser bundle at build time). A template lives in `.env.example` (opted-in to git); real values belong in `.env.local` (git-ignored).

| Variable | Required | Scope | Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes (for the interactive map) | Client | Google Maps JavaScript API key. Restrict it by **HTTP referrer** (`http://localhost:3000/*` + production domain) and to the **Maps JavaScript API**. When unset, `InteractiveMap.tsx` renders a branded *Connect Google Maps* placeholder instead of failing. |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | No | Client | Google Cloud **Map ID** enabling vector styling + Advanced Markers. Falls back to Google's shared `DEMO_MAP_ID` when unset. |

> Changing these values requires restarting the dev server, as `NEXT_PUBLIC_*` values are frozen at build time.
