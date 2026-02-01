import React, { useState } from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import CurrentWeather from './components/weather/CurrentWeather.jsx';
import CitySearch from './components/weather/CitySearch.jsx';
import WeatherMap from './components/weather/WeatherMap.jsx';
import ForecastChart from './components/weather/ForecastChart.jsx';
import DetailedForecast from './components/weather/DetailedForecast.jsx';
import WeatherBackground from './components/ui/WeatherBackground.jsx';
import AirQuality from './components/ui/AirQuality.jsx';
import SunTimes from './components/ui/SunTimes.jsx';

function App() {
  const [selectedCity, setSelectedCity] = useState({
    name: 'Москва',
    country: 'RU',
    lat: 55.7558,
    lon: 37.6173
  });

  return (
    <div className="app">
      <WeatherBackground weather="clear" />
      <Header />
      <main style={{
        padding: '20px',
        minHeight: 'calc(100vh - 140px)',
        position: 'relative',
        zIndex: 1
      }}>
        <CitySearch 
          selectedCity={selectedCity}
          onCitySelect={setSelectedCity}
        />
        <CurrentWeather 
          city={selectedCity}
        />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div>
            <h2>Карта погоды</h2>
            <WeatherMap 
              city={selectedCity}
              style={{ height: '300px', borderRadius: '8px' }}
            />
          </div>
          <div>
            <h2>Прогноз</h2>
            <ForecastChart 
              city={selectedCity}
            />
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          marginTop: '20px'
        }}>
          <AirQuality city={selectedCity} />
          <SunTimes city={selectedCity} />
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '8px'
          }}>
            <h3>Статус</h3>
            <p>✅ Все компоненты загружены!</p>
            <p>🌤️ Приложение работает</p>
          </div>
        </div>
        
        <DetailedForecast city={selectedCity} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
