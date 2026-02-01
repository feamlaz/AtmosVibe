import axios from 'axios';
import { cacheGet, cacheSet } from './cacheService.js';

const API_BASE = '//api.openweathermap.org/data/2.5';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 минут для уменьшения запросов

export async function getCurrentWeather(coords, options = {}) {
  const { force = false, city } = options;
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    return {
      locationName: city?.name || 'Демо режим',
      tempC: 15,
      feelsLikeC: 13,
      humidity: 65,
      pressureHpa: 1015,
      windMs: 4.2,
      condition: 'ясно'
    };
  }

  // Используем название города или координаты
  const cityName = city?.name || 'Moscow';
  const cacheKey = `current:${cityName}`;
  
  console.log('Weather API request:', { cityName, hasApiKey: !!apiKey });

  if (!force) {
    const cached = cacheGet(cacheKey);
    if (cached?.data != null && cached?.ts && Date.now() - cached.ts < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // Проверяем наличие устаревших кэшированных данных на случай 429 ошибки
  const fallbackCached = cacheGet(cacheKey);

  const { data } = await axios.get(`${API_BASE}/weather`, {
    params: {
      q: cityName,
      APPID: apiKey,
      units: 'metric'
    },
    timeout: 10000 // 10 second timeout
  }).catch((error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout: Weather API request took too long');
    }
    if (error.response?.status === 401) {
      throw new Error('Invalid API key');
    }
    if (error.response?.status === 404) {
      throw new Error('City not found');
    }
    if (error.response?.status === 429) {
      // Если есть кэшированные данные, возвращаем их с пометкой
      if (fallbackCached?.data) {
        console.warn('API rate limit exceeded, using cached data');
        return { ...fallbackCached.data, isRateLimited: true };
      }
      throw new Error('Too many requests. Please wait before refreshing.');
    }
    throw new Error(`Weather API error: ${error.message}`);
  });

  // Weather API 2.5 возвращает данные в стандартном формате
  const result = {
    locationName: data?.name ?? cityName,
    tempC: typeof data?.main?.temp === 'number' ? data.main.temp : 0,
    feelsLikeC: typeof data?.main?.feels_like === 'number' ? data.main.feels_like : 0,
    humidity: typeof data?.main?.humidity === 'number' ? data.main.humidity : 0,
    pressureHpa: typeof data?.main?.pressure === 'number' ? data.main.pressure : 0,
    windMs: typeof data?.wind?.speed === 'number' ? data.wind.speed : 0,
    condition: data?.weather?.[0]?.description ?? '—'
  };
  
  console.log('Weather API result:', result);
  cacheSet(cacheKey, { data: result, ts: Date.now() });
  return result;
}

/** Прогноз на 5 дней (интервалы 3 ч). Возвращает массив { t, v } для графика (первые 16 точек). */
export async function getForecast(coords, options = {}) {
  const { force = false, city } = options;
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    return [
      { t: '00:00', v: 12 },
      { t: '03:00', v: 11 },
      { t: '06:00', v: 13 },
      { t: '09:00', v: 16 },
      { t: '12:00', v: 20 },
      { t: '15:00', v: 18 },
      { t: '18:00', v: 15 },
      { t: '21:00', v: 13 }
    ];
  }

  // Используем название города
  const cityName = city?.name || 'Moscow';
  const cacheKey = `forecast:${cityName}`;

  if (!force) {
    const cached = cacheGet(cacheKey);
    if (cached?.data != null && cached?.ts && Date.now() - cached.ts < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // Проверяем наличие устаревших кэшированных данных на случай 429 ошибки
  const fallbackCached = cacheGet(cacheKey);

  const { data } = await axios.get(`${API_BASE}/forecast`, {
    params: {
      q: cityName,
      APPID: apiKey,
      units: 'metric'
    },
    timeout: 10000 // 10 second timeout
  }).catch((error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout: Forecast API request took too long');
    }
    if (error.response?.status === 401) {
      throw new Error('Invalid API key');
    }
    if (error.response?.status === 404) {
      throw new Error('City not found');
    }
    if (error.response?.status === 429) {
      // Если есть кэшированные данные, возвращаем их с пометкой
      if (fallbackCached?.data) {
        console.warn('Forecast API rate limit exceeded, using cached data');
        return fallbackCached.data.map(item => ({ ...item, isRateLimited: true }));
      }
      throw new Error('Too many requests. Please wait before refreshing.');
    }
    throw new Error(`Forecast API error: ${error.message}`);
  });

  // Weather API 2.5 возвращает прогноз в list массиве
  const list = data?.list ?? [];
  const result = list.slice(0, 16).map((item) => {
    const date = new Date(item.dt * 1000);
    const hours = date.getHours();
    const mins = date.getMinutes();
    const t = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    const v = typeof item.main?.temp === 'number' ? Math.round(item.main.temp) : 0;
    return { t, v };
  });
  
  cacheSet(cacheKey, { data: result, ts: Date.now() });
  return result;
}

/** Подробный прогноз на 24 часа. Возвращает массив с почасовыми данными */
export async function getDetailedForecast(coords, options = {}) {
  const { force = false, city } = options;
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    // Демо данные на 24 часа
    return Array.from({ length: 24 }, (_, i) => ({
      dt: Date.now() / 1000 + i * 3600,
      temp: 15 + Math.sin(i / 4) * 8,
      condition: i % 3 === 0 ? 'ясно' : i % 3 === 1 ? 'облачно' : 'пасмурно',
      humidity: 60 + Math.random() * 20,
      windMs: 2 + Math.random() * 6,
      pressure: 1010 + Math.random() * 10
    }));
  }

  // Используем название города
  const cityName = city?.name || 'Moscow';
  const cacheKey = `detailed:${cityName}`;

  if (!force) {
    const cached = cacheGet(cacheKey);
    if (cached?.data != null && cached?.ts && Date.now() - cached.ts < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // Проверяем наличие устаревших кэшированных данных на случай 429 ошибки
  const fallbackCached = cacheGet(cacheKey);

  const { data } = await axios.get(`${API_BASE}/forecast`, {
    params: {
      q: cityName,
      APPID: apiKey,
      units: 'metric'
    },
    timeout: 10000 // 10 second timeout
  }).catch((error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout: Detailed forecast API request took too long');
    }
    if (error.response?.status === 401) {
      throw new Error('Invalid API key');
    }
    if (error.response?.status === 404) {
      throw new Error('City not found');
    }
    if (error.response?.status === 429) {
      // Если есть кэшированные данные, возвращаем их с пометкой
      if (fallbackCached?.data) {
        console.warn('Detailed forecast API rate limit exceeded, using cached data');
        return fallbackCached.data.map(item => ({ ...item, isRateLimited: true }));
      }
      throw new Error('Too many requests. Please wait before refreshing.');
    }
    throw new Error(`Detailed forecast API error: ${error.message}`);
  });

  // Берем первые 24 часа (8 записей по 3 часа каждая)
  const list = data?.list ?? [];
  const result = list.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: typeof item.main?.temp === 'number' ? Math.round(item.main.temp) : 0,
    condition: item?.weather?.[0]?.description ?? '—',
    humidity: typeof item.main?.humidity === 'number' ? item.main.humidity : 0,
    windMs: typeof item.wind?.speed === 'number' ? item.wind.speed : 0,
    pressure: typeof item.main?.pressure === 'number' ? item.main.pressure : 0
  }));
  
  cacheSet(cacheKey, { data: result, ts: Date.now() });
  return result;
}
