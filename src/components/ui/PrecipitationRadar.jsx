import { useEffect, useRef, useState } from 'react';
import GlassCard from './GlassCard.jsx';
import { CloudRain, MapPin, Activity } from 'lucide-react';

export default function PrecipitationRadar({ city }) {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [radarData, setRadarData] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const loadRadarData = async () => {
      setLoading(true);
      
      // Имитация загрузки данных радара
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Генерируем демо данные для радара
      const mockRadarData = {
        center: { lat: city?.lat || 55.7558, lon: city?.lon || 37.6173 },
        precipitation: generatePrecipitationData(),
        timestamp: new Date().toISOString()
      };
      
      setRadarData(mockRadarData);
      setLoading(false);
    };

    if (city) {
      loadRadarData();
    }
  }, [city]);

  const generatePrecipitationData = () => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        intensity: Math.random(),
        type: Math.random() > 0.7 ? 'rain' : Math.random() > 0.9 ? 'storm' : 'cloud',
        size: Math.random() * 30 + 10,
        speed: Math.random() * 2 + 0.5,
        direction: Math.random() * Math.PI * 2
      });
    }
    return data;
  };

  useEffect(() => {
    if (!radarData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рисуем сетку радара
      drawRadarGrid(ctx, canvas.width, canvas.height);

      // Рисуем осадки
      radarData.precipitation.forEach((precip, index) => {
        const x = canvas.width / 2 + precip.x + Math.cos(precip.direction) * time * precip.speed;
        const y = canvas.height / 2 + precip.y + Math.sin(precip.direction) * time * precip.speed;

        // Определяем цвет в зависимости от интенсивности
        let color;
        if (precip.type === 'storm') {
          color = `rgba(147, 51, 234, ${precip.intensity * 0.8})`;
        } else if (precip.type === 'rain') {
          color = `rgba(59, 130, 246, ${precip.intensity * 0.6})`;
        } else {
          color = `rgba(156, 163, 175, ${precip.intensity * 0.3})`;
        }

        // Рисуем область осадков
        ctx.save();
        ctx.globalAlpha = precip.intensity * 0.7;
        ctx.fillStyle = color;
        
        // Создаем градиент для более реалистичного вида
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, precip.size);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.arc(x, y, precip.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Рисуем центр города
      drawCityCenter(ctx, canvas.width / 2, canvas.height / 2);

      time += 0.1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [radarData]);

  const drawRadarGrid = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Концентрические круги
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, (width / 2) * (i / 4), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Линии от центра
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(
        width / 2 + Math.cos(angle) * width / 2,
        height / 2 + Math.sin(angle) * height / 2
      );
      ctx.stroke();
    }

    // Шкала расстояния
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '10px sans-serif';
    ctx.fillText('25 км', width / 2 + 5, height / 2 - width / 4);
    ctx.fillText('50 км', width / 2 + 5, height / 2 - width / 2);
    ctx.fillText('75 км', width / 2 + 5, height / 2 - width * 3 / 4);
  };

  const drawCityCenter = (ctx, x, y) => {
    // Рисуем маркер города
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Пульсирующий эффект
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };

  if (loading) {
    return (
      <GlassCard className="radar-widget">
        <div className="widget-header">
          <CloudRain size={20} />
          <h3>Радар осадков</h3>
        </div>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Загрузка радара...</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="radar-widget">
      <div className="widget-header">
        <CloudRain size={20} />
        <h3>Радар осадков</h3>
      </div>
      
      <div className="radar-content">
        <div className="radar-container">
          <canvas
            ref={canvasRef}
            className="radar-canvas"
            style={{
              width: '100%',
              height: '300px',
              borderRadius: '8px'
            }}
          />
        </div>

        <div className="radar-legend">
          <div className="legend-title">Интенсивность осадков</div>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'rgba(156, 163, 175, 0.5)' }}></div>
              <span>Облачно</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'rgba(59, 130, 246, 0.6)' }}></div>
              <span>Дождь</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ background: 'rgba(147, 51, 234, 0.8)' }}></div>
              <span>Гроза</span>
            </div>
          </div>
        </div>

        <div className="radar-info">
          <div className="info-item">
            <MapPin size={14} />
            <span>{city?.name || 'Москва'}</span>
          </div>
          <div className="info-item">
            <Activity size={14} />
            <span>Обновлен: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
