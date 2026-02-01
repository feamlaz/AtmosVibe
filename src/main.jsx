import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import 'leaflet/dist/leaflet.css';
import './styles/variables.css';
import './styles/main.css';
import './styles/glass-effects.css';
import './styles/weather-animations.css';
import './styles/responsive.css';
import './styles/detailed-forecast.css';
import './styles/city-search.css';

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./service-worker.js')
      .catch(() => undefined);
  });
}

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
