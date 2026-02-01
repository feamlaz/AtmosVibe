import { useEffect, useRef } from 'react';
import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react';

export default function WeatherBackground({ weather = 'clear' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Устанавливаем размер canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Определяем тип частиц в зависимости от погоды
    const getParticleConfig = () => {
      switch (weather) {
        case 'rain':
          return {
            count: 100,
            speed: { min: 5, max: 10 },
            size: { min: 1, max: 3 },
            opacity: { min: 0.3, max: 0.8 },
            color: 'rgba(174, 194, 224, 0.6)'
          };
        case 'snow':
          return {
            count: 80,
            speed: { min: 1, max: 3 },
            size: { min: 2, max: 6 },
            opacity: { min: 0.4, max: 0.9 },
            color: 'rgba(255, 255, 255, 0.8)'
          };
        case 'cloudy':
          return {
            count: 20,
            speed: { min: 0.2, max: 0.8 },
            size: { min: 30, max: 80 },
            opacity: { min: 0.1, max: 0.3 },
            color: 'rgba(255, 255, 255, 0.4)'
          };
        default: // clear
          return {
            count: 30,
            speed: { min: 0.1, max: 0.5 },
            size: { min: 20, max: 60 },
            opacity: { min: 0.05, max: 0.15 },
            color: 'rgba(255, 255, 255, 0.3)'
          };
      }
    };

    // Класс частицы
    class Particle {
      constructor(config) {
        this.reset(config);
      }

      reset(config) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * (config.size.max - config.size.min) + config.size.min;
        this.speed = Math.random() * (config.speed.max - config.speed.min) + config.speed.min;
        this.opacity = Math.random() * (config.opacity.max - config.opacity.min) + config.opacity.min;
        this.color = config.color;
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.02;
      }

      update(config) {
        if (weather === 'rain') {
          this.y += this.speed;
          this.x += Math.sin(this.angle) * 0.5;
          this.angle += this.angleSpeed;
        } else if (weather === 'snow') {
          this.y += this.speed;
          this.x += Math.sin(this.angle) * 2;
          this.angle += this.angleSpeed;
        } else {
          this.y += this.speed * 0.3;
          this.x += Math.sin(this.angle) * 0.5;
          this.angle += this.angleSpeed * 0.5;
        }

        // Сброс частицы если она вышла за границы
        if (this.y > canvas.height + 50) {
          this.y = -50;
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width + 50) {
          this.x = -50;
        }
        if (this.x < -50) {
          this.x = canvas.width + 50;
        }
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        if (weather === 'rain') {
          // Рисуем каплю дождя
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x, this.y + this.size * 3);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.size;
          ctx.stroke();
        } else if (weather === 'snow') {
          // Рисуем снежинку
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Добавляем лучи снежинки
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1;
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
              this.x + Math.cos(angle) * this.size * 2,
              this.y + Math.sin(angle) * this.size * 2
            );
            ctx.stroke();
          }
        } else {
          // Рисуем облако/облако для ясной погоды
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Инициализация частиц
    const config = getParticleConfig();
    particlesRef.current = Array.from({ length: config.count }, () => new Particle(config));

    // Анимационный цикл
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        particle.update(config);
        particle.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Очистка
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [weather]);

  return (
    <canvas
      ref={canvasRef}
      className="weather-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}
