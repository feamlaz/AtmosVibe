import { useState, useEffect } from 'react';
import GlassCard from '../ui/GlassCard.jsx';
import { Sun, Moon, Clock, TrendingUp, TrendingDown, Sunrise, Sunset } from 'lucide-react';

export default function SunTimes({ city }) {
  const [sunData, setSunData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadSunData = async () => {
      setLoading(true);
      
      // Имитация загрузки данных
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Расчет времени восхода и заката для города
      const now = new Date();
      const lat = city?.lat || 55.7558;
      const lng = city?.lon || 37.6173;
      
      // Упрощенный расчет (в реальном приложении здесь будет API)
      const sunrise = calculateSunTime(lat, lng, now, true);
      const sunset = calculateSunTime(lat, lng, now, false);
      const moonPhase = getMoonPhase(now);
      
      setSunData({
        sunrise,
        sunset,
        moonPhase,
        daylightHours: calculateDaylightHours(sunrise, sunset),
        currentTime: now,
        nextSunrise: getNextSunrise(sunrise, now),
        nextSunset: getNextSunset(sunset, now)
      });
      
      setLoading(false);
    };

    if (city) {
      loadSunData();
    }
  }, [city]);

  // Обновляем текущее время каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateSunTime = (lat, lng, date, isSunrise) => {
    // Упрощенный расчет времени восхода/заката
    const baseHour = isSunrise ? 6 : 18;
    const variation = (lat / 90) * 2; // Широта влияет на время
    const seasonal = Math.sin((date.getMonth() + 1) * Math.PI / 6) * 1.5; // Сезонные изменения
    
    const hour = baseHour + variation + seasonal + (Math.random() - 0.5) * 0.5;
    const minute = Math.floor((hour % 1) * 60);
    
    const result = new Date(date);
    result.setHours(Math.floor(hour), minute, 0, 0);
    return result;
  };

  const calculateDaylightHours = (sunrise, sunset) => {
    return (sunset - sunrise) / (1000 * 60 * 60); // в часах
  };

  const getNextSunrise = (sunrise, now) => {
    const next = new Date(sunrise);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  };

  const getNextSunset = (sunset, now) => {
    const next = new Date(sunset);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  };

  const getMoonPhase = (date) => {
    const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    const day = date.getDate();
    return phases[day % 8];
  };

  const getTimeUntil = (targetTime) => {
    const diff = targetTime - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes}м`;
  };

  const getSunIcon = (isSunrise) => {
    return isSunrise ? Sunrise : Sunset;
  };

  const isDaytime = () => {
    if (!sunData) return true;
    return currentTime >= sunData.sunrise && currentTime <= sunData.sunset;
  };

  if (loading) {
    return (
      <GlassCard className="sun-times-widget">
        <div className="widget-header">
          <Clock size={20} />
          <h3>Солнце и луна</h3>
        </div>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </GlassCard>
    );
  }

  if (!sunData) {
    return (
      <GlassCard className="sun-times-widget">
        <div className="widget-header">
          <Clock size={20} />
          <h3>Солнце и луна</h3>
        </div>
        <div className="error-content">
          <Clock size={24} />
          <p>Нет данных</p>
        </div>
      </GlassCard>
    );
  }

  const SunIcon = getSunIcon(true);
  const MoonIcon = getSunIcon(false);

  return (
    <GlassCard className="sun-times-widget">
      <div className="widget-header">
        <Clock size={20} />
        <h3>Солнце и луна</h3>
      </div>
      
      <div className="sun-times-content">
        {/* Текущее состояние */}
        <div className="current-state">
          <div className="state-icon">
            {isDaytime() ? (
              <div className="sun-icon-animated">
                <Sun size={32} />
                <div className="sun-rays"></div>
              </div>
            ) : (
              <div className="moon-icon-animated">
                <Moon size={32} />
                <div className="moon-glow"></div>
              </div>
            )}
          </div>
          <div className="state-info">
            <div className="state-label">
              {isDaytime() ? 'День' : 'Ночь'}
            </div>
            <div className="state-time">
              {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Восход и закат */}
        <div className="sun-events">
          <div className="sun-event">
            <div className="event-icon">
              <SunIcon size={20} />
            </div>
            <div className="event-info">
              <div className="event-label">Восход</div>
              <div className="event-time">
                {sunData.sunrise.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="event-countdown">
                {currentTime < sunData.sunrise 
                  ? `через ${getTimeUntil(sunData.nextSunrise)}`
                  : `был ${getTimeUntil(currentTime - sunData.sunrise)} назад`
                }
              </div>
            </div>
          </div>

          <div className="sun-event">
            <div className="event-icon">
              <SunIcon size={20} />
            </div>
            <div className="event-info">
              <div className="event-label">Закат</div>
              <div className="event-time">
                {sunData.sunset.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="event-countdown">
                {currentTime < sunData.sunset 
                  ? `через ${getTimeUntil(sunData.nextSunset)}`
                  : `был ${getTimeUntil(currentTime - sunData.sunset)} назад`
                }
              </div>
            </div>
          </div>
        </div>

        {/* Информация о дне */}
        <div className="day-info">
          <div className="day-stat">
            <div className="stat-label">Световой день</div>
            <div className="stat-value">
              {Math.floor(sunData.daylightHours)}ч {Math.floor((sunData.daylightHours % 1) * 60)}м
            </div>
          </div>
          <div className="day-stat">
            <div className="stat-label">Фаза луны</div>
            <div className="stat-value">
              <span className="moon-emoji">{sunData.moonPhase}</span>
            </div>
          </div>
        </div>

        {/* Прогресс бар дня */}
        <div className="day-progress">
          <div className="progress-label">
            Прогресс дня
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${((currentTime - sunData.sunrise) / (sunData.sunset - sunData.sunrise)) * 100}%`,
                background: isDaytime() 
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)' 
                  : 'linear-gradient(90deg, #6366f1, #8b5cf6)'
              }}
            ></div>
          </div>
          <div className="progress-percentage">
            {Math.floor(((currentTime - sunData.sunrise) / (sunData.sunset - sunData.sunrise)) * 100)}%
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
