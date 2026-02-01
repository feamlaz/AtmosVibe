import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../ui/GlassCard.jsx';
import { useForecastData } from '../../hooks/useForecastData.js';

const fallbackData = [
  { t: '00:00', v: 5 },
  { t: '06:00', v: 6 },
  { t: '12:00', v: 10 },
  { t: '18:00', v: 7 }
];

export default function ForecastChart({ city }) {
  const { data: forecast, loading, error } = useForecastData(city);
  const chartData = forecast?.length ? forecast : fallbackData;

  return (
    <GlassCard className="widget">
      <div className="widget-header">
        <h3 className="widget-title">Прогноз</h3>
        <span className="muted">Температура, 3 ч</span>
      </div>

      {loading && <div className="skeleton widget-skeleton" />}

      {!loading && error && (
        <p className="muted">Не удалось загрузить прогноз.</p>
      )}

      {!loading && !error && chartData.length > 0 && (
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="t" stroke="rgba(255,255,255,0.6)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12
                }}
                labelStyle={{ color: '#f8fafc' }}
                formatter={(value) => [`${value} °C`, 'Температура']}
              />
              <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
