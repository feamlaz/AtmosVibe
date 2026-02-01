import GlassCard from '../ui/GlassCard.jsx';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import { useWeatherData } from '../../hooks/useWeatherData.js';
import { formatTempC } from '../../utils/formatters.js';

export default function CurrentWeather({ city }) {
  const { data, loading, error, refetch } = useWeatherData(city);

  return (
    <GlassCard className="widget">
      <div className="widget-header">
        <h3 className="widget-title">Сейчас</h3>
        <div className="widget-header-actions">
          <span className="muted">Локация: {data?.locationName || '—'}</span>
          <AnimatedButton type="button" onClick={refetch} disabled={loading} title="Обновить">
            {error ? 'Повторить' : 'Обновить'}
          </AnimatedButton>
        </div>
      </div>

      {loading && <div className="skeleton widget-skeleton" />}

      {!loading && error && (
        <p className="muted">Не удалось загрузить погоду. Проверь API ключ.</p>
      )}

      {!loading && !error && data && (
        <div className="current">
          <div className="current-temp">{formatTempC(data.tempC)}</div>
          <div className="muted">{data.condition}</div>
          {data.feelsLikeC != null && (
            <div className="muted">Ощущается: {formatTempC(data.feelsLikeC)}</div>
          )}
          <div className="current-meta">
            <div>
              <span className="muted">Влажность</span>
              <div>{data.humidity}%</div>
            </div>
            <div>
              <span className="muted">Ветер</span>
              <div>{data.windMs} м/с</div>
            </div>
            {data.pressureHpa != null && data.pressureHpa > 0 && (
              <div>
                <span className="muted">Давление</span>
                <div>{data.pressureHpa} hPa</div>
              </div>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
