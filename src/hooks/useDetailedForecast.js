import { useCallback, useEffect, useState } from 'react';
import { getDetailedForecast } from '../services/weatherAPI.js';
import { useGeolocation } from './useGeolocation.js';

export function useDetailedForecast(city) {
  const { coords } = useGeolocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDetailedForecast(null, { 
        force, 
        city: city || null 
      });
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    run(false);
  }, [run]);

  const refetch = useCallback(() => run(true), [run]);

  return { data, loading, error, refetch };
}
