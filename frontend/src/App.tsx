import { useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";

// Map components from your existing Maps folder.
import { Campus } from "./Maps/campus/Campus";
import { Main_Floor_0 } from "./Maps/mainbuilding/Mainground";
import { Main_Floor_1 } from "./Maps/mainbuilding/MainFirst";
import { IT_Floor_0 } from "./Maps/ITbuilding/ITGround";
import { Nr_Floor_0 } from "./Maps/NrBuilding/Nrground";

type MapComponentProps = {
  onNavigate: (locationId: string) => void;
};

type MapLocation = {
  id: string;
  name: string;
  parentId: string | null;
  type: "campus" | "building" | "floor";
};

const locations: Record<string, MapLocation> = {
  campus: {
    id: "campus",
    name: "Campus",
    parentId: null,
    type: "campus",
  },
  mainBuilding: {
    id: "mainBuilding",
    name: "Main Building",
    parentId: "campus",
    type: "building",
  },
  itBuilding: {
    id: "itBuilding",
    name: "IT Building",
    parentId: "campus",
    type: "building",
  },
  nrBuilding: {
    id: "nrBuilding",
    name: "NR Building",
    parentId: "campus",
    type: "building",
  },
  mainGround: {
    id: "mainGround",
    name: "Ground Floor",
    parentId: "mainBuilding",
    type: "floor",
  },
  mainFirst: {
    id: "mainFirst",
    name: "First Floor",
    parentId: "mainBuilding",
    type: "floor",
  },
};

// Cast to a common map-component interface so all maps receive onNavigate.
// Each map that needs interactive navigation should use this prop.
const CampusMapView = Campus as ComponentType<MapComponentProps>;
const MainGroundMapView = Main_Floor_0 as ComponentType<MapComponentProps>;
const MainFirstMapView = Main_Floor_1 as ComponentType<MapComponentProps>;
const ITGroundMapView = IT_Floor_0 as ComponentType<MapComponentProps>;
const NrGroundMapView = Nr_Floor_0 as ComponentType<MapComponentProps>;

function MapView({
  locationId,
  onNavigate,
}: {
  locationId: string;
  onNavigate: (locationId: string) => void;
}) {
  switch (locationId) {
    case "campus":
      // Campus map itself is intentionally empty for now.
      // Temporary clickable building markers until the campus map is drawn.
      return (
        <div className="campus-map-shell">
          <CampusMapView onNavigate={onNavigate} />
          <svg className="campus-connection" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 170 300 C 280 180, 360 180, 470 300 S 690 420, 830 300" />
          </svg>
          <button
            className="campus-building-button campus-it-button"
            onClick={() => onNavigate("itBuilding")}
          >
            IT Building
          </button>
          <button
            className="campus-building-button campus-nr-button"
            onClick={() => onNavigate("nrBuilding")}
          >
            NR Building
          </button>
          <button
            className="campus-building-button campus-main-button"
            onClick={() => onNavigate("mainBuilding")}
          >
            Main Building
          </button>
        </div>
      );

    case "itBuilding":
      return <ITGroundMapView onNavigate={onNavigate} />;

    case "nrBuilding":
      return <NrGroundMapView onNavigate={onNavigate} />;

    case "mainBuilding":
    case "mainGround":
      return (
        <div className="loaded-map">
          <MainGroundMapView onNavigate={onNavigate} />
          {/* Temporary navigation target until the ground-floor map is drawn. */}
          <button
            className="map-navigation-hotspot"
            onClick={() => onNavigate("mainFirst")}
            aria-label="Go upstairs to the first floor"
            title="Stairs — First Floor"
          >
            Stairs ↑
          </button>
        </div>
      );

    case "mainFirst":
      return (
        <div className="loaded-map">
          <MainFirstMapView onNavigate={onNavigate} />
          {/* Temporary navigation target until the first-floor map is drawn. */}
          <button
            className="map-navigation-hotspot"
            onClick={() => onNavigate("mainGround")}
            aria-label="Go downstairs to the ground floor"
            title="Stairs — Ground Floor"
          >
            Stairs ↓
          </button>
        </div>
      );

    default:
      return (
        <div className="map-placeholder">
          <h2>Map not found</h2>
          <button className="map-action" onClick={() => onNavigate("campus")}>
            Return to Campus
          </button>
        </div>
      );
  }
}

function Announcements() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="nav-button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
      >
        Announcements
      </button>

      {isOpen && (
        <div className="announcement-panel">
          <div className="panel-heading">
            <h3>Announcements</h3>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close announcements"
            >
              ×
            </button>
          </div>
          <p>No announcements available.</p>
        </div>
      )}
    </>
  );
}

function Breadcrumbs({
  currentLocationId,
  onNavigate,
}: {
  currentLocationId: string;
  onNavigate: (locationId: string) => void;
}) {
  const breadcrumbItems: MapLocation[] = [];
  let current: MapLocation | undefined = locations[currentLocationId];

  while (current) {
    breadcrumbItems.unshift(current);
    if (!current.parentId) break;
    current = locations[current.parentId];
  }

  return (
    <div className="breadcrumbs">
      {breadcrumbItems.map((location, index) => (
        <span key={location.id} className="breadcrumb-item">
          {index > 0 && <span className="breadcrumb-separator">/</span>}
          <button
            className={
              index === breadcrumbItems.length - 1
                ? "breadcrumb-current"
                : "breadcrumb-link"
            }
            onClick={() => onNavigate(location.id)}
            disabled={index === breadcrumbItems.length - 1}
          >
            {location.name}
          </button>
        </span>
      ))}
    </div>
  );
}

function QRPanel({ onNavigate }: { onNavigate: (locationId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`qr-container ${isOpen ? "qr-expanded" : ""}`}>
      {isOpen && (
        <div className="qr-expanded-content">
          <h3>Find Your Location</h3>
          <p>QR scanning will be implemented here.</p>
          <button
            className="qr-location-button"
            onClick={() => {
              onNavigate("mainBuilding");
              setIsOpen(false);
            }}
          >
            Open Main Building
          </button>
        </div>
      )}

      <button
        className="qr-toggle"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close QR panel" : "Open QR panel"}
      >
        <span className="qr-icon">▦</span>
        <span className="qr-text">{isOpen ? "Close" : "QR"}</span>
      </button>
    </div>
  );
}

function App() {
  const [currentLocationId, setCurrentLocationId] = useState("campus");
  const [navVisible, setNavVisible] = useState(true);
  const [qrVisible, setQrVisible] = useState(true);

  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showInterface = () => {
    setNavVisible(true);
    setQrVisible(true);

    if (interactionTimer.current) clearTimeout(interactionTimer.current);

    interactionTimer.current = setTimeout(() => {
      setNavVisible(false);
      setQrVisible(false);
    }, 3000);
  };

  useEffect(() => {
    interactionTimer.current = setTimeout(() => {
      setNavVisible(false);
      setQrVisible(false);
    }, 3000);

    return () => {
      if (interactionTimer.current) clearTimeout(interactionTimer.current);
    };
  }, []);

  const navigateTo = (locationId: string) => {
    if (!locations[locationId]) return;
    setCurrentLocationId(locationId);
    showInterface();
  };

  return (
    <div className="app-container" onPointerDown={showInterface}>
      <nav className={`top-navigation ${navVisible ? "nav-visible" : "nav-hidden"}`}>
        <div className="nav-left">
          <Announcements />
        </div>

        <div className="nav-center">
          <Breadcrumbs
            currentLocationId={currentLocationId}
            onNavigate={navigateTo}
          />
        </div>

        <div className="nav-right">
          <button
            className="home-button"
            onClick={() => navigateTo("campus")}
            aria-label="Return to campus map"
            title="Home"
          >
            ⌂
          </button>
        </div>
      </nav>

      {/* Only this content area swaps between imported map components. */}
      <main className="map-container">
        <MapView locationId={currentLocationId} onNavigate={navigateTo} />
      </main>

      <div className={`qr-position ${qrVisible ? "qr-visible" : "qr-hidden"}`}>
        <QRPanel onNavigate={navigateTo} />
      </div>

      <style>{`
        * { box-sizing: border-box; }

        html, body, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          overflow: hidden;
        }

        body {
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f5f7;
          color: #202124;
        }

        button { font: inherit; cursor: pointer; }

        button:focus-visible {
          outline: 2px solid #2563eb;
          outline-offset: 3px;
        }

        .app-container {
          position: relative;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          isolation: isolate;
          background: #f4f5f7;
        }

        .top-navigation {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 20;
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          align-items: center;
          width: 100%;
          height: 15vh;
          min-height: 76px;
          max-height: 120px;
          padding: 0 24px;
          background: rgba(255, 255, 255, 0.96);
          border-bottom: 1px solid #e2e5e9;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          transition: transform 280ms ease, opacity 280ms ease;
        }

        .nav-visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .nav-hidden {
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
        }

        .nav-left, .nav-center, .nav-right {
          display: flex;
          align-items: center;
          min-width: 0;
        }

        .nav-left { justify-content: flex-start; }
        .nav-center { justify-content: center; overflow: hidden; }
        .nav-right { justify-content: flex-end; }

        .nav-button, .home-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 10px 16px;
          color: #202124;
          background: white;
          border: 1px solid #dadce0;
          border-radius: 10px;
          transition: background 160ms ease;
        }

        .nav-button:hover, .home-button:hover { background: #f1f3f4; }

        .home-button { width: 46px; height: 46px; font-size: 27px; }

        .breadcrumbs {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 5px;
          min-width: 0;
          max-width: 100%;
        }

        .breadcrumb-item { display: inline-flex; align-items: center; gap: 5px; min-width: 0; }

        .breadcrumb-link, .breadcrumb-current {
          padding: 7px 4px;
          border: none;
          background: transparent;
          white-space: nowrap;
        }

        .breadcrumb-link { color: #5f6368; }
        .breadcrumb-link:hover { color: #1a73e8; }
        .breadcrumb-current { color: #202124; font-weight: 600; cursor: default; }
        .breadcrumb-separator { color: #9aa0a6; }

        .map-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          overscroll-behavior: contain;
          background: #f4f5f7;
        }

        .loaded-map {
          position: relative;
          width: 100%;
          min-height: 100%;
        }

        .campus-map-shell {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 100dvh;
        }

        .campus-connection {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .campus-connection path {
          fill: none;
          stroke: #64748b;
          stroke-width: 7;
          stroke-linecap: round;
          stroke-dasharray: 12 12;
        }

        .campus-building-button {
          position: absolute;
          z-index: 5;
          min-width: 145px;
          padding: 15px 20px;
          color: #202124;
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          box-shadow: 0 5px 18px rgba(0,0,0,0.12);
          font-weight: 600;
        }

        .campus-building-button:hover {
          background: #f1f5f9;
          border-color: #64748b;
        }

        .campus-it-button {
          left: 13%;
          top: 43%;
        }

        .campus-nr-button {
          left: 50%;
          top: 24%;
          transform: translateX(-50%);
        }

        .campus-nr-button {
          left: 50%;
          top: 24%;
          transform: translateX(-50%);
        }

        .campus-main-button {
          right: 13%;
          top: 43%;
        }

        /* Temporary stair links, to be replaced by clickable stairs in the map. */
        .map-navigation-hotspot {
          position: absolute;
          right: 24px;
          bottom: 24px;
          z-index: 10;
          padding: 12px 16px;
          color: white;
          background: #202124;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 9px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }

        .map-navigation-hotspot:hover { background: #3c4043; }

        .map-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 100%;
          padding: 30px;
          text-align: center;
        }

        .map-action {
          min-height: 44px;
          padding: 12px 18px;
          color: white;
          background: #202124;
          border: none;
          border-radius: 8px;
        }

        .map-action:hover { background: #3c4043; }

        .announcement-panel {
          position: absolute;
          top: calc(15vh - 10px);
          left: 24px;
          z-index: 40;
          width: min(340px, calc(100vw - 32px));
          padding: 18px;
          background: white;
          border: 1px solid #e2e5e9;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .panel-heading { display: flex; justify-content: space-between; align-items: center; }
        .panel-heading h3 { margin: 0; font-size: 17px; }
        .announcement-panel p { margin-bottom: 0; color: #6b7280; }

        .close-button {
          width: 32px;
          height: 32px;
          font-size: 24px;
          background: transparent;
          border: none;
        }

        .qr-position {
          position: absolute;
          left: 20px;
          bottom: 20px;
          z-index: 15;
          transition: transform 250ms ease, opacity 250ms ease;
        }

        .qr-visible { transform: translateY(0); opacity: 1; pointer-events: auto; }
        .qr-hidden { transform: translateY(20px); opacity: 0; pointer-events: none; }
        .qr-container { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }

        .qr-toggle {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 76px;
          height: 76px;
          background: white;
          border: 1px solid #dadce0;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .qr-toggle:hover { background: #f8f9fa; }
        .qr-icon { font-size: 34px; line-height: 1; }
        .qr-text { font-size: 12px; font-weight: 600; }

        .qr-expanded-content {
          width: min(280px, calc(100vw - 40px));
          padding: 18px;
          background: white;
          border: 1px solid #dadce0;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .qr-expanded-content h3 { margin: 0 0 10px; }
        .qr-expanded-content p { color: #6b7280; font-size: 14px; line-height: 1.5; }

        .qr-location-button {
          padding: 10px 12px;
          color: white;
          background: #202124;
          border: none;
          border-radius: 7px;
        }

        @media (max-width: 600px) {
          .top-navigation {
            grid-template-columns: auto minmax(0, 1fr) auto;
            gap: 10px;
            padding: 0 12px;
            height: 12vh;
            min-height: 72px;
          }

          .nav-button { padding: 10px; font-size: 12px; }
          .breadcrumbs { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
          .breadcrumbs::-webkit-scrollbar { display: none; }
          .breadcrumb-link, .breadcrumb-current { font-size: 12px; }
          .home-button { width: 40px; height: 40px; }
          .announcement-panel { top: calc(12vh + 8px); left: 12px; }
          .qr-position { left: 12px; bottom: 12px; }
          .qr-toggle { width: 64px; height: 64px; }
          .map-navigation-hotspot { right: 12px; bottom: 12px; }
          .campus-building-button { min-width: 110px; padding: 12px 10px; font-size: 12px; }
          .campus-it-button { left: 4%; }
          .campus-main-button { right: 4%; }
          .campus-nr-button { top: 28%; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  );
}

export default App;
