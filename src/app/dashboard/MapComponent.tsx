'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// תיקון לאייקונים
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ location }: { location: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 15);
    }
  }, [location, map]);
  return null;
}

export default function MapComponent({ location }: { location: { lat: number; lng: number } | null }) {
  const [renderMap, setRenderMap] = useState(false);

  useEffect(() => {
    // השהייה קלה כדי לוודא שה-DOM נקי לגמרי
    setRenderMap(true);
    return () => setRenderMap(false);
  }, []);

  if (!renderMap) {
    return <div className="h-full w-full bg-slate-900 animate-pulse rounded-3xl" />;
  }

  const defaultPos: [number, number] = [32.0853, 34.7818];

  return (
    <div className="h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      <MapContainer 
        center={location ? [location.lat, location.lng] : defaultPos} 
        zoom={13} 
        scrollWheelZoom={false}
        // המפתח (key) מכריח את React להרוס ולבנות את המפה מחדש אם המיקום משתנה משמעותית
        key={location ? `map-${location.lat}` : 'map-default'}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        {location && (
          <Marker position={[location.lat, location.lng]} icon={icon}>
            <Popup>המיקום הנוכחי שלך</Popup>
          </Marker>
        )}
        <RecenterMap location={location} />
      </MapContainer>
    </div>
  );
}