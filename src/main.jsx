import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App-full.jsx';

import 'leaflet/dist/leaflet.css';
import './styles/variables.css';
import './styles/main.css';
import './styles/city-search.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
