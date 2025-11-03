import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import MapActionButton from "./MapActionButton";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Create purple circular markers with white numbers
const createCustomIcon = (indicator) => {
  const size = 24;
  const purpleColor = "#981FF5"; // Using the primary color from theme

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${purpleColor};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 13px;
      ">${indicator}</div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Component to handle map bounds adjustment when places are added
function MapBoundsController({ places }) {
  const map = useMap();

  useEffect(() => {
    if (places && places.length > 0) {
      const validPlaces = places.filter((p) => p.lat && p.lng);
      if (validPlaces.length > 0) {
        const bounds = L.latLngBounds(validPlaces.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
        });
      }
    }
  }, [places, map]);

  return null;
}

// Simple geocoding for Austin addresses (mock coordinates)
// In production, you'd use a real geocoding service
const geocodeAddress = (address) => {
  // Mock coordinates for Austin addresses
  // In production, use a service like Nominatim, Google Geocoding API, etc.
  const addressMap = {
    "East 6th Street": [30.2672, -97.7324],
    "Nueces Street": [30.2691, -97.7501],
    "West 6th Street": [30.2685, -97.7519],
  };

  // Try to find a match
  for (const [key, coords] of Object.entries(addressMap)) {
    if (address.includes(key)) {
      // Add slight random offset to simulate different locations on same street
      return [
        coords[0] + (Math.random() - 0.5) * 0.01,
        coords[1] + (Math.random() - 0.5) * 0.01,
      ];
    }
  }

  // Default to central Austin with slight offset
  return [
    30.2672 + (Math.random() - 0.5) * 0.02,
    -97.7431 + (Math.random() - 0.5) * 0.02,
  ];
};

const LeafletMap = ({ places = [] }) => {
  // Default center coordinates (Austin, TX)
  const center = [30.2672, -97.7431];
  const zoom = 13;

  // Process places to add coordinates
  const placesWithCoords = useMemo(() => {
    return places.map((place) => {
      const [lat, lng] = geocodeAddress(place.address);
      return {
        ...place,
        lat,
        lng,
      };
    });
  }, [places]);

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
      >
        <TileLayer
          attribution=''
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          maxZoom={19}
          minZoom={3}
        />

        <MapBoundsController places={placesWithCoords} />

        <MapActionButton />

        {/* Markers for each place */}
        {placesWithCoords.map((place, index) => (
          <Marker
            key={`marker-${place.title}-${index}`}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(place.indicator)}
          >
            <Popup>
              <div className="custom-popup-content">
                <div className="popup-header">
                  <div className="popup-indicator-circle">
                    <span className="popup-indicator-number">{place.indicator}</span>
                  </div>
                  <div className="popup-visits-badge">
                    {place.visits} Visits
                  </div>
                </div>
                <div className="popup-body">
                  <h3 className="popup-title">{place.title}</h3>
                  <p className="popup-address">{place.address}</p>
                  <p className="popup-category">{place.category}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
