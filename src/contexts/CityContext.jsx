import { createContext, useContext, useState, useEffect } from 'react';

const CityContext = createContext();

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState(() => {
    // Загружаем сохраненный город из localStorage
    try {
      const saved = localStorage.getItem('selected-city');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    
    // Город по умолчанию
    return {
      name: 'Москва',
      country: 'RU',
      lat: 55.7558,
      lon: 37.6173
    };
  });

  // Сохраняем выбранный город в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('selected-city', JSON.stringify(selectedCity));
    } catch {
      // ignore
    }
  }, [selectedCity]);

  const selectCity = (city) => {
    setSelectedCity({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
      state: city.state
    });
  };

  const value = {
    selectedCity,
    selectCity,
    setSelectedCity
  };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
}
