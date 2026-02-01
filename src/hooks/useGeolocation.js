import { useEffect, useState } from 'react';

export function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError(new Error('Geolocation unsupported'));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        console.log('Geolocation coords:', coords);
        setCoords(coords);
        setError(null);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setError(err);
      },
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 10_000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { coords, error };
}
