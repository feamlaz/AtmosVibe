import { useState, useCallback } from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import CurrentWeather from './components/weather/CurrentWeather.jsx';
import ForecastChart from './components/weather/ForecastChart.jsx';
import WeatherMap from './components/weather/WeatherMap.jsx';
import DetailedForecast from './components/weather/DetailedForecast.jsx';
import CitySearch from './components/weather/CitySearch.jsx';
import WeatherBackground from './components/ui/WeatherBackground.jsx';
import AirQuality from './components/ui/AirQuality.jsx';
import PrecipitationRadar from './components/ui/PrecipitationRadar.jsx';
import SunTimes from './components/ui/SunTimes.jsx';
import ToggleSwitch from './components/ui/ToggleSwitch.jsx';
import { useTheme } from './hooks/useTheme.js';
import './styles/widgets.css';

function AppContent() {
  const [selectedCity, setSelectedCity] = useState({
    name: 'Москва',
    country: 'RU',
    lat: 55.7558,
    lon: 37.6173
  });
  const { theme: appTheme, toggleTheme: toggleAppTheme } = useTheme();

  const handleCitySelect = useCallback((city) => {
    console.log('App: handleCitySelect called with:', city);
    setSelectedCity({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    });
    console.log('App: setSelectedCity called, new city:', city.name);
  }, []);

  return (
    <div className="app" data-theme={appTheme}>
      <WeatherBackground weather="clear" />
      <div className="background" />

      <Header onToggleTheme={toggleAppTheme} theme={appTheme} />

      <main className="container safe-area-top safe-area-left safe-area-right">
        <div className="toolbar">
          <CitySearch onCitySelect={handleCitySelect} currentCity={selectedCity} />
          <ToggleSwitch checked={appTheme === 'light'} onChange={toggleAppTheme} label="Light" />
        </div>

        <section className="grid-responsive">
          <CurrentWeather city={selectedCity} />
          <ForecastChart city={selectedCity} />
          <WeatherMap city={selectedCity} />
          <DetailedForecast city={selectedCity} />
          <AirQuality city={selectedCity} />
          <PrecipitationRadar city={selectedCity} />
          <SunTimes city={selectedCity} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
