# System Architecture Specification

> **Live System Status:**  
> - **App URL:** `http://localhost:3000`  
> - **Workspace Path:** `C:\Users\rajiv\.gemini\antigravity\scratch\sanctuary-stays`  
> - **Last Updated:** 2026-10-16

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    User["User / Client Browser"] --> Layout["RootLayout (src/app/layout.tsx)"]
    Layout --> Page["HomePage (src/app/page.tsx - Client Orchestrator)"]
    
    subgraph UI_Components ["UI Components (src/components/)"]
        Navbar["Navbar.tsx (Theme Toggle, Wishlist, Concierge, Proprietor Portal)"]
        Hero["Hero.tsx (Indian Architectural Heritage Branding)"]
        SearchFilter["SearchFilterBar.tsx (Region/Country, Style, Guests, Vetting Score)"]
        Pills["CategoryPills.tsx (Palaces, Himalayan, Coastal, Forest, Metropolitan, World)"]
        ViewSwitcher["Layout Switcher: Split Map | Grid | Full Map"]
        Cards["SanctuaryCard.tsx (Listing Cards with Map Hover Sync)"]
        MapComp["InteractiveMap.tsx (Vector World Cartography & Pin Sync)"]
        StayMap["StayLocationMap.tsx (Per-Stay Location Map & Directions)"]
        VettingComp["VettingStandardSection.tsx (100-Point Rubric vs Mass Rentals)"]
        Footer["Footer.tsx (Design Press & Charter)"]
    end

    subgraph Modals ["Interactive Modals & Drawers"]
        DetailModal["SanctuaryDetailModal.tsx (Acoustic Spectrum, Provenance, Reservation Engine)"]
        BookingConfirm["BookingConfirmationModal.tsx (Verified Code, Assigned Concierge)"]
        ConciergeModal["ConciergeModal.tsx (Royal Maharaj, Shikara, Helicopter)"]
        HostSubmit["HostSubmissionModal.tsx (Jury Audit Application)"]
        HostDashboard["HostDashboardModal.tsx (Owner YTD Earnings, Audit Status, Turnover Guild)"]
        SavedDrawer["SavedStaysModal.tsx (Curated Wishlist Drawer)"]
    end

    subgraph Data_Layer ["Data & State Layer"]
        DB["src/data/sanctuaries.ts + sanctuaries-global.ts (27 Curated Sanctuaries, India & Worldwide)"]
        Amen["src/data/amenityCatalog.ts (Collective & Collection Amenity Standards)"]
        Types["src/types/sanctuary.ts (TypeScript Interfaces)"]
        LocalStorage["Client LocalStorage (Wishlists & Theme Preference)"]
    end

    subgraph API_Routes ["API Endpoints (src/app/api/)"]
        BookingsAPI["/api/bookings (POST - Reservation Processing)"]
        ConciergeAPI["/api/concierge (POST - Bespoke Liaison Dispatch)"]
    end

    Page --> UI_Components
    Page --> Modals
    Page --> Data_Layer
    DetailModal --> BookingsAPI
    ConciergeModal --> ConciergeAPI
```

---

## 2. Technology Stack & Runtime

| Layer | Technology | Version | Purpose / Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Turbopack) | `16.4.0` | React server/client rendering and API routes |
| **UI Library** | React / React DOM | `19.3.0` | Component lifecycle and concurrent rendering |
| **Language** | TypeScript | `5.x` | Strict typing across components, models, and APIs |
| **Styling** | Tailwind CSS v4 + Custom CSS | `@import "tailwindcss";` | Theme variables, luxury styling, responsive design |
| **Fonts** | Google Fonts | Web Font API | `Cinzel`, `Playfair Display`, `Plus Jakarta Sans` |
| **Icons** | Lucide React | `^1.x` | Minimalist editorial iconography |
| **State Storage**| Client `localStorage` | Browser Native | Saved curations (`sanctuary_saved_stays`) & Theme (`sanctuary_theme`) |

---

## 3. Directory & File Organization

```
sanctuary-stays/
├── Project Docs/                      # Multi-agent live tracking specs
│   ├── TASK_TRACKER.md               # Task status & agent coordination rules
│   ├── ARCHITECTURE_SPEC.md          # System architecture & component tree
│   ├── PRODUCT_SPEC.md               # Product vision & 100-point rubric
│   ├── DATA_AND_API_SPEC.md          # TypeScript models, data schema, APIs
│   ├── UI_UX_SPEC.md                 # Design system, themes, and interactions
│   └── AGENT_COORDINATION_GUIDE.md   # Guidelines for peer agents
├── public/                           # Static assets & icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── bookings/route.ts     # Reservation API endpoint (INR currency)
│   │   │   └── concierge/route.ts    # Concierge dispatch API endpoint
│   │   ├── favicon.ico
│   │   ├── globals.css               # Dual themes (Obsidian Dark & Linen Light)
│   │   ├── layout.tsx                # Metadata & HTML root
│   │   └── page.tsx                  # Main client-side orchestrator
│   ├── components/
│   │   ├── BookingConfirmationModal.tsx
│   │   ├── CategoryPills.tsx
│   │   ├── ConciergeModal.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HostDashboardModal.tsx
│   │   ├── HostSubmissionModal.tsx
│   │   ├── InteractiveMap.tsx
│   │   ├── Navbar.tsx
│   │   ├── SanctuaryCard.tsx
│   │   ├── SanctuaryDetailModal.tsx
│   │   ├── SavedStaysModal.tsx
│   │   ├── StayLocationMap.tsx       # Reusable per-stay Google map + directions
│   │   └── VettingStandardSection.tsx
│   ├── data/
│   │   ├── amenityCatalog.ts         # Collective + collection amenities & grouping
│   │   ├── sanctuaries.ts            # Curated India architectural catalog (12 stays)
│   │   └── sanctuaries-global.ts     # New Indian-city + international stays (15); combined into SANCTUARIES
│   └── types/
│       └── sanctuary.ts              # TypeScript interface definitions
├── package.json
└── tsconfig.json
```

---

## 4. Build, Development, and Server Commands

- **Build Application**:
  ```powershell
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); npm.cmd run build
  ```
- **Run Production Server (Daemon Mode)**:
  ```powershell
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); npm.cmd run start
  ```
- **Run Development Server**:
  ```powershell
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); npm.cmd run dev
  ```
