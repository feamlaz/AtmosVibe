import GlassCard from '../ui/GlassCard.jsx';
import { useDetailedForecast } from '../../hooks/useDetailedForecast.js';
import { formatTempC, formatTimeHHMM } from '../../utils/formatters.js';

export default function DetailedForecast({ city }) {
  const { data, loading, error } = useDetailedForecast(city);

  return (
    <GlassCard className="widget">
      <div className="widget-header">
        <h3 className="widget-title">Подробный прогноз</h3>
        <span className="muted">На ближайшие 24 часа</span>
      </div>

      {loading && <div className="skeleton widget-skeleton" />}

      {!loading && error && (
        <p className="muted">Не удалось загрузить подробный прогноз.</p>
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="detailed-forecast">
          <div className="forecast-list">
            {data.map((item, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-time">
                  {formatTimeHHMM(new Date(item.dt * 1000))}
                </div>
                <div className="forecast-temp">
                  {formatTempC(item.temp)}
                </div>
                <div className="forecast-condition">
                  {item.condition}
                </div>
                <div className="forecast-details">
                  <span className="forecast-humidity">💧 {item.humidity}%</span>
                  <span className="forecast-wind">💨 {item.windMs} м/с</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
