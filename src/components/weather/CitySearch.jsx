import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard.jsx';
import { Search, X, MapPin, Star } from 'lucide-react';
import '../../styles/city-search.css';

const POPULAR_CITIES = [
  { name: 'Москва', country: 'RU', lat: 55.7558, lon: 37.6173 },
  { name: 'Санкт-Петербург', country: 'RU', lat: 59.9343, lon: 30.3351 },
  { name: 'Новосибирск', country: 'RU', lat: 55.0084, lon: 82.9357 },
  { name: 'Екатеринбург', country: 'RU', lat: 56.8389, lon: 60.6057 },
  { name: 'Казань', country: 'RU', lat: 55.8304, lon: 49.0661 },
  { name: 'London', country: 'GB', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', country: 'FR', lat: 48.8566, lon: 2.3522 },
  { name: 'New York', country: 'US', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', country: 'JP', lat: 35.6762, lon: 139.6503 },
  { name: 'Berlin', country: 'DE', lat: 52.5200, lon: 13.4050 }
];

export default function CitySearch({ onCitySelect, currentCity }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Загружаем избранное из localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorite-cities');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  // Обновляем позицию dropdown при открытии
  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current && isOpen) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition);
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // Добавим ключ для принудительного перерендера анимаций
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    if (isOpen) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isOpen]);

  // Логика для автоматического открытия/закрытия при наведении
  useEffect(() => {
    // Открываем при наведении на поиск, если нет текста
    if (isHovering && !query) {
      setIsOpen(true);
    }
    // Закрываем при уходе курсора, если нет текста и фокуса
    else if (!isHovering && !query && document.activeElement !== inputRef.current) {
      setIsOpen(false);
    }
  }, [isHovering, query]);

  // Обработчики наведения
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Сохраняем избранное в localStorage
  const saveFavorites = (cities) => {
    try {
      localStorage.setItem('favorite-cities', JSON.stringify(cities));
      setFavorites(cities);
    } catch {
      // ignore
    }
  };

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Поиск городов
  const searchCities = async (searchQuery) => {
    console.log('CitySearch: searchCities called with:', searchQuery);
    if (!searchQuery.trim()) {
      console.log('CitySearch: empty query, showing popular cities');
      setSuggestions(POPULAR_CITIES.slice(0, 5));
      return;
    }

    setIsLoading(true);
    try {
      // Используем OpenWeatherMap Geocoding API
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      console.log('CitySearch: API key exists:', !!apiKey);
      
      if (!apiKey) {
        // Демо режим - фильтруем популярные города
        console.log('CitySearch: demo mode, filtering popular cities');
        const filtered = POPULAR_CITIES.filter(city =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        console.log('CitySearch: filtered cities:', filtered);
        setSuggestions(filtered.slice(0, 5));
        return;
      }

      const response = await fetch(
        `//api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchQuery)}&limit=5&appid=${apiKey}`
      );
      const data = await response.json();
      console.log('CitySearch: API response:', data);
      
      const cities = data.map(item => ({
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon,
        state: item.state
      }));
      
      console.log('CitySearch: processed cities:', cities);
      setSuggestions(cities);
    } catch (error) {
      console.error('CitySearch: Error searching cities:', error);
      // Fallback на популярные города
      const filtered = POPULAR_CITIES.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchCities(query);
      } else {
        setSuggestions(POPULAR_CITIES.slice(0, 5));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log('CitySearch: input changed to:', value);
    setQuery(value);
    setIsOpen(true);
    console.log('CitySearch: setIsOpen called with true');
  };

  const handleCitySelect = (city) => {
    console.log('CitySearch: handleCitySelect called with:', city);
    console.log('CitySearch: onCitySelect exists:', !!onCitySelect);
    setQuery(city.name);
    setIsOpen(false);
    if (onCitySelect) {
      console.log('CitySearch: calling onCitySelect');
      onCitySelect(city);
    } else {
      console.log('CitySearch: onCitySelect is undefined');
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Обработчики фокуса с учетом наведения
  const handleInputFocus = () => {
    console.log('CitySearch: input focused');
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Закрываем только если курсор не на поиске и не на dropdown
    setTimeout(() => {
      if (!isHovering && !dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 100);
  };

  const toggleFavorite = (city, e) => {
    e.stopPropagation();
    const cityKey = `${city.name},${city.country}`;
    const newFavorites = favorites.some(fav => `${fav.name},${fav.country}` === cityKey)
      ? favorites.filter(fav => `${fav.name},${fav.country}` !== cityKey)
      : [...favorites, city];
    
    saveFavorites(newFavorites);
  };

  const isFavorite = (city) => {
    const cityKey = `${city.name},${city.country}`;
    return favorites.some(fav => `${fav.name},${fav.country}` === cityKey);
  };

  return (
    <>
      <GlassCard className="city-search">
        <div 
          ref={searchContainerRef}
          className="search-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div 
            className="search-input-wrapper"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="search-icon"
              animate={{ rotate: isOpen ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Search size={18} />
            </motion.div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Поиск города..."
              className="search-input"
            />
            <AnimatePresence>
              {query && (
                <motion.button 
                  onClick={clearSearch} 
                  className="clear-button"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </GlassCard>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key={`dropdown-${animationKey}`}
            ref={dropdownRef} 
            className="search-dropdown"
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              zIndex: 99999
            }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ 
              duration: 0.2, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isLoading ? (
              <motion.div 
                className="search-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Загрузка...
              </motion.div>
            ) : (
              <>
                {favorites.length > 0 && (
                  <motion.div 
                    className="search-section"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="search-section-title">Избранное</div>
                    {favorites.map((city, index) => (
                      <motion.div
                        key={`fav-${index}-${animationKey}`}
                        className="search-item favorite"
                        onClick={() => handleCitySelect(city)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MapPin size={16} />
                        <div className="search-item-info">
                          <div className="search-item-name">{city.name}</div>
                          <div className="search-item-country">{city.country}</div>
                        </div>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(city, e);
                          }}
                          className="favorite-button active"
                          whileHover={{ scale: 1.2, rotate: 72 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Star size={16} fill="currentColor" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <motion.div 
                  className="search-section"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="search-section-title">
                    {query ? 'Результаты поиска' : 'Популярные города'}
                  </div>
                  {suggestions.map((city, index) => (
                    <motion.div
                      key={`sug-${index}-${animationKey}`}
                      className="search-item"
                      onClick={() => {
                        console.log('CitySearch: clicked on city:', city);
                        handleCitySelect(city);
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <MapPin size={16} />
                      <div className="search-item-info">
                        <div className="search-item-name">{city.name}</div>
                        <div className="search-item-country">
                          {city.state ? `${city.state}, ` : ''}{city.country}
                        </div>
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(city, e);
                        }}
                        className={`favorite-button ${isFavorite(city) ? 'active' : ''}`}
                        whileHover={{ scale: 1.2, rotate: isFavorite(city) ? 72 : 0 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star size={16} fill={isFavorite(city) ? 'currentColor' : 'none'} />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
