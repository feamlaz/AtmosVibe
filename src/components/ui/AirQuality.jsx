import { useState, useEffect } from 'react';
import GlassCard from './GlassCard.jsx';
import { Wind, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AirQuality({ city }) {
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных о качестве воздуха
    const loadAirQuality = async () => {
      setLoading(true);
      
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Демо данные - в реальном приложении здесь будет API запрос
      const mockData = {
        aqi: Math.floor(Math.random() * 150) + 20,
        pm25: Math.random() * 50 + 10,
        pm10: Math.random() * 80 + 20,
        o3: Math.random() * 100 + 40,
        no2: Math.random() * 60 + 10,
        so2: Math.random() * 20 + 5,
        co: Math.random() * 2 + 0.5
      };
      
      setAirQuality(mockData);
      setLoading(false);
    };

    if (city) {
      loadAirQuality();
    }
  }, [city]);

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: 'Хорошее', color: '#10b981', icon: CheckCircle };
    if (aqi <= 100) return { level: 'Умеренное', color: '#f59e0b', icon: Wind };
    if (aqi <= 150) return { level: 'Вредное для чувствительных групп', color: '#f97316', icon: AlertTriangle };
    if (aqi <= 200) return { level: 'Нездоровое', color: '#ef4444', icon: AlertTriangle };
    if (aqi <= 300) return { level: 'Очень нездоровое', color: '#7c3aed', icon: AlertTriangle };
    return { level: 'Опасное', color: '#991b1b', icon: AlertTriangle };
  };

  if (loading) {
    return (
      <GlassCard className="air-quality-widget">
        <div className="widget-header">
          <Wind size={20} />
          <h3>Качество воздуха</h3>
        </div>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </GlassCard>
    );
  }

  if (!airQuality) {
    return (
      <GlassCard className="air-quality-widget">
        <div className="widget-header">
          <Wind size={20} />
          <h3>Качество воздуха</h3>
        </div>
        <div className="error-content">
          <AlertTriangle size={24} />
          <p>Нет данных</p>
        </div>
      </GlassCard>
    );
  }

  const aqiLevel = getAQILevel(airQuality.aqi);
  const Icon = aqiLevel.icon;

  return (
    <GlassCard className="air-quality-widget">
      <div className="widget-header">
        <Wind size={20} />
        <h3>Качество воздуха</h3>
      </div>
      
      <div className="air-quality-content">
        <div className="aqi-main">
          <div className="aqi-value" style={{ color: aqiLevel.color }}>
            {airQuality.aqi}
          </div>
          <div className="aqi-level">
            <Icon size={16} style={{ color: aqiLevel.color }} />
            <span style={{ color: aqiLevel.color }}>{aqiLevel.level}</span>
          </div>
        </div>

        <div className="pollutants-grid">
          <div className="pollutant-item">
            <div className="pollutant-name">PM2.5</div>
            <div className="pollutant-value">{airQuality.pm25.toFixed(1)}</div>
          </div>
          <div className="pollutant-item">
            <div className="pollutant-name">PM10</div>
            <div className="pollutant-value">{airQuality.pm10.toFixed(1)}</div>
          </div>
          <div className="pollutant-item">
            <div className="pollutant-name">O₃</div>
            <div className="pollutant-value">{airQuality.o3.toFixed(1)}</div>
          </div>
          <div className="pollutant-item">
            <div className="pollutant-name">NO₂</div>
            <div className="pollutant-value">{airQuality.no2.toFixed(1)}</div>
          </div>
        </div>

        <div className="air-quality-tips">
          <h4>Рекомендации:</h4>
          {airQuality.aqi <= 50 && (
            <p>Отличные условия для прогулок и занятий спортом на свежем воздухе.</p>
          )}
          {airQuality.aqi > 50 && airQuality.aqi <= 100 && (
            <p>Приемлемое качество воздуха. Чувствительным людям следует ограничить длительные прогулки.</p>
          )}
          {airQuality.aqi > 100 && airQuality.aqi <= 150 && (
            <p>Людям с респираторными заболеваниями следует избегать физических нагрузок на открытом воздухе.</p>
          )}
          {airQuality.aqi > 150 && (
            <p>Рекомендуется оставаться в помещении. При выходе на улицу используйте защитную маску.</p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
