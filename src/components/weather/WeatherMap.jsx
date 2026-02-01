import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import GlassCard from '../ui/GlassCard.jsx';

// Иконка маркера: в Vite пути Leaflet ломаются, задаём явно
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const DEFAULT_CENTER = [55.751244, 37.618423];
const DEFAULT_ZOOM = 10;

function MapCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] != null && center[1] != null) {
      map.setView(center, map.getZoom());
    }
  }, [map, center]);
  return null;
}

function WeatherMap({ city }) {
  const center = city ? [city.lat, city.lon] : DEFAULT_CENTER;
  const hasMarker = Boolean(city);

  return (
    <GlassCard className="widget">
      <div className="widget-header">
        <h3 className="widget-title">Карта</h3>
        <span className="muted">{hasMarker ? city.name : 'Центр по умолчанию'}</span>
      </div>
      <div className="map-container">
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenter center={center} />
          {hasMarker && (
            <Marker position={[city.lat, city.lon]}>
              <Popup>Погода в {city.name}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </GlassCard>
  );
}

export default WeatherMap;
