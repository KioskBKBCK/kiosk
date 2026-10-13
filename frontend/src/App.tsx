import { useState, useEffect, useRef } from "react";

/* =========================================================
   TYPES
========================================================= */

type MapLocation = {
  id: string;
  name: string;
  parentId: string | null;
  type: "campus" | "building" | "floor" | "area";
};

type MapComponentProps = {
  onNavigate: (locationId: string) => void;
};

/* =========================================================
   MAP CONFIGURATION

   These are placeholders for now.
   Later, each location will render its actual 2D map.
========================================================= */

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

  floor1: {
    id: "floor1",
    name: "Floor 1",
    parentId: "mainBuilding",
    type: "floor",
  },

  floor2: {
    id: "floor2",
    name: "Floor 2",
    parentId: "mainBuilding",
    type: "floor",
  },
};

/* =========================================================
   MAIN MAP COMPONENT

   Only this area changes when navigating between maps.
========================================================= */

function MapView({
  locationId,
  onNavigate,
}: {
  locationId: string;
  onNavigate: (locationId: string) => void;
}) {
  const location = locations[locationId];

  if (!location) {
    return (
      <div className="map-placeholder">
        <h2>Map not found</h2>
        <button onClick={() => onNavigate("campus")}>
          Return to Campus
        </button>
      </div>
    );
  }

  /*
    Actual map components will be added here.

    Example for the future:

    if (locationId === "campus") {
      return <CampusMap onNavigate={onNavigate} />;
    }

    if (locationId === "mainBuilding") {
      return <MainBuildingMap onNavigate={onNavigate} />;
    }

    if (locationId === "floor1") {
      return <Floor1Map onNavigate={onNavigate} />;
    }
  */

  return (
    <div className="map-placeholder">
      <div className="map-info">
        <span className="map-label">{location.type.toUpperCase()} MAP</span>

        <h1>{location.name}</h1>

        <p>
          The {location.name.toLowerCase()} map will appear here.
        </p>

        {locationId === "campus" && (
          <button
            className="map-action"
            onClick={() => onNavigate("mainBuilding")}
          >
            Open Main Building →
          </button>
        )}

        {locationId === "mainBuilding" && (
          <div className="floor-actions">
            <button onClick={() => onNavigate("floor1")}>
              Floor 1
            </button>

            <button onClick={() => onNavigate("floor2")}>
              Floor 2
            </button>
          </div>
        )}

        {locationId !== "campus" && (
          <button
            className="map-action secondary"
            onClick={() =>
              onNavigate(location.parentId ?? "campus")
            }
          >
            ← Back to {locations[location.parentId ?? "campus"].name}
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ANNOUNCEMENTS COMPONENT
========================================================= */

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

/* =========================================================
   BREADCRUMB NAVIGATION
========================================================= */

function Breadcrumbs({
  currentLocationId,
  onNavigate,
}: {
  currentLocationId: string;
  onNavigate: (locationId: string) => void;
}) {
  const breadcrumbItems: MapLocation[] = [];

  let current = locations[currentLocationId];

  while (current) {
    breadcrumbItems.unshift(current);

    if (!current.parentId) {
      break;
    }

    current = locations[current.parentId];
  }

  return (
    <div className="breadcrumbs">
      {breadcrumbItems.map((location, index) => (
        <span key={location.id} className="breadcrumb-item">
          {index > 0 && (
            <span className="breadcrumb-separator">/</span>
          )}

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

/* =========================================================
   QR PANEL
========================================================= */

function QRPanel({
  onNavigate,
}: {
  onNavigate: (locationId: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`qr-container ${isOpen ? "qr-expanded" : ""}`}>
      {isOpen && (
        <div className="qr-expanded-content">
          <h3>Find Your Location</h3>

          <p>
            QR scanning will be implemented here.
          </p>

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
        <span className="qr-text">
          {isOpen ? "Close" : "QR"}
        </span>
      </button>
    </div>
  );
}

/* =========================================================
   MAIN APPLICATION
========================================================= */

function App() {
  const [currentLocationId, setCurrentLocationId] =
    useState<string>("campus");

  const [navVisible, setNavVisible] = useState(true);
  const [qrVisible, setQrVisible] = useState(true);

  const interactionTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  /*
    Show the navigation bar when the user interacts.
    Hide it after a short period of inactivity.
  */

  const showInterface = () => {
    setNavVisible(true);
    setQrVisible(true);

    if (interactionTimer.current) {
      clearTimeout(interactionTimer.current);
    }

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
      if (interactionTimer.current) {
        clearTimeout(interactionTimer.current);
      }
    };
  }, []);

  /*
    Change the current map without replacing
    the surrounding application interface.
  */

  const navigateTo = (locationId: string) => {
    if (!locations[locationId]) {
      return;
    }

    setCurrentLocationId(locationId);
    showInterface();
  };

  return (
    <div
      className="app-container"
      onPointerDown={showInterface}
    >
      {/* ================= NAVIGATION BAR ================= */}

      <nav
        className={`top-navigation ${
          navVisible ? "nav-visible" : "nav-hidden"
        }`}
      >
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

      {/* ================= MAIN MAP AREA ================= */}

      <main className="map-container">
        <MapView
          locationId={currentLocationId}
          onNavigate={navigateTo}
        />
      </main>

      {/* ================= QR PANEL ================= */}

      <div
        className={`qr-position ${
          qrVisible ? "qr-visible" : "qr-hidden"
        }`}
      >
        <QRPanel onNavigate={navigateTo} />
      </div>

      {/* ================= GLOBAL STYLES ================= */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
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

        button {
          font: inherit;
          cursor: pointer;
        }

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

        /* NAVIGATION */

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

          transition:
            transform 280ms ease,
            opacity 280ms ease;
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

        .nav-left {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-width: 0;
        }

        .nav-center {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          overflow: hidden;
        }

        .nav-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .nav-button,
        .home-button {
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

        .nav-button:hover,
        .home-button:hover {
          background: #f1f3f4;
        }

        .home-button {
          width: 46px;
          height: 46px;
          font-size: 27px;
        }

        /* BREADCRUMBS */

        .breadcrumbs {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 5px;
          min-width: 0;
          max-width: 100%;
        }

        .breadcrumb-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-width: 0;
        }

        .breadcrumb-link,
        .breadcrumb-current {
          padding: 7px 4px;
          border: none;
          background: transparent;
          white-space: nowrap;
        }

        .breadcrumb-link {
          color: #5f6368;
        }

        .breadcrumb-link:hover {
          color: #1a73e8;
        }

        .breadcrumb-current {
          color: #202124;
          font-weight: 600;
          cursor: default;
        }

        .breadcrumb-separator {
          color: #9aa0a6;
        }

        /* MAIN MAP */

        .map-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          overscroll-behavior: contain;
          background: #f4f5f7;
        }

        .map-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 100%;
          min-height: 100%;

          padding: 30px;
          text-align: center;
        }

        .map-info {
          max-width: 500px;
        }

        .map-label {
          display: inline-block;
          margin-bottom: 12px;
          padding: 6px 10px;

          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;

          color: #4b5563;
          background: #e5e7eb;
          border-radius: 5px;
        }

        .map-info h1 {
          margin: 0 0 12px;
          font-size: clamp(28px, 4vw, 44px);
        }

        .map-info p {
          margin: 0 0 24px;
          color: #6b7280;
          line-height: 1.6;
        }

        .map-action,
        .floor-actions button {
          min-height: 44px;
          padding: 12px 18px;

          color: white;
          background: #202124;
          border: none;
          border-radius: 8px;
        }

        .map-action:hover,
        .floor-actions button:hover {
          background: #3c4043;
        }

        .secondary {
          margin-left: 8px;
          color: #202124;
          background: white;
          border: 1px solid #dadce0;
        }

        .secondary:hover {
          background: #f1f3f4;
        }

        .floor-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        /* ANNOUNCEMENTS PANEL */

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

        .panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-heading h3 {
          margin: 0;
          font-size: 17px;
        }

        .announcement-panel p {
          margin-bottom: 0;
          color: #6b7280;
        }

        .close-button {
          width: 32px;
          height: 32px;
          font-size: 24px;
          background: transparent;
          border: none;
        }

        /* QR PANEL */

        .qr-position {
          position: absolute;
          left: 20px;
          bottom: 20px;
          z-index: 15;

          transition:
            transform 250ms ease,
            opacity 250ms ease;
        }

        .qr-visible {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }

        .qr-hidden {
          transform: translateY(20px);
          opacity: 0;
          pointer-events: none;
        }

        .qr-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

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

        .qr-toggle:hover {
          background: #f8f9fa;
        }

        .qr-icon {
          font-size: 34px;
          line-height: 1;
        }

        .qr-text {
          font-size: 12px;
          font-weight: 600;
        }

        .qr-expanded-content {
          width: min(280px, calc(100vw - 40px));
          padding: 18px;

          background: white;
          border: 1px solid #dadce0;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .qr-expanded-content h3 {
          margin: 0 0 10px;
        }

        .qr-expanded-content p {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        .qr-location-button {
          padding: 10px 12px;
          color: white;
          background: #202124;
          border: none;
          border-radius: 7px;
        }

        /* MOBILE LAYOUT */

        @media (max-width: 600px) {
          .top-navigation {
            grid-template-columns: auto minmax(0, 1fr) auto;
            gap: 10px;
            padding: 0 12px;
            height: 12vh;
            min-height: 72px;
          }

          .nav-button {
            padding: 10px;
            font-size: 12px;
          }

          .breadcrumbs {
            justify-content: flex-start;
            flex-wrap: nowrap;
            overflow-x: auto;
            scrollbar-width: none;
          }

          .breadcrumbs::-webkit-scrollbar {
            display: none;
          }

          .breadcrumb-link,
          .breadcrumb-current {
            font-size: 12px;
          }

          .home-button {
            width: 40px;
            height: 40px;
          }

          .announcement-panel {
            top: calc(12vh + 8px);
            left: 12px;
          }

          .qr-position {
            left: 12px;
            bottom: 12px;
          }

          .qr-toggle {
            width: 64px;
            height: 64px;
          }

          .map-placeholder {
            padding: 20px;
          }

          .secondary {
            margin: 10px 0 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;