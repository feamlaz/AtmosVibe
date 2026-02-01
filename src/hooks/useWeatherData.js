import { useCallback, useEffect, useState } from 'react';
import { getCurrentWeather } from '../services/weatherAPI.js';
import { useGeolocation } from './useGeolocation.js';

export function useWeatherData(city) {
  const { coords } = useGeolocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('useWeatherData: city prop:', city);

  const run = useCallback(async (force = false) => {
    console.log('useWeatherData: run called with city:', city, 'force:', force);
    setLoading(true);
    setError(null);
    try {
      // Используем переданный город или геолокацию
      const result = await getCurrentWeather(null, { 
        force, 
        city: city || null 
      });
      console.log('useWeatherData: got result:', result);
      setData(result);
    } catch (e) {
      console.log('useWeatherData: error:', e);
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
