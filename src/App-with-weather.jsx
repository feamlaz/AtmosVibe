import React, { useState } from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import CurrentWeather from './components/weather/CurrentWeather.jsx';
import CitySearch from './components/weather/CitySearch.jsx';

function App() {
  const [selectedCity, setSelectedCity] = useState({
    name: 'Москва',
    country: 'RU',
    lat: 55.7558,
    lon: 37.6173
  });

  return (
    <div className="app">
      <Header />
      <main style={{
        padding: '20px',
        minHeight: 'calc(100vh - 140px)'
      }}>
        <CitySearch 
          selectedCity={selectedCity}
          onCitySelect={setSelectedCity}
        />
        <CurrentWeather 
          city={selectedCity}
        />
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h2>Тестовый блок</h2>
          <p>Погодные компоненты загружены!</p>
          <p>Текущий город: {selectedCity.name}</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
