import React from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

function App() {
  return (
    <div className="app">
      <Header />
      <main style={{
        padding: '20px',
        minHeight: 'calc(100vh - 140px)'
      }}>
        <h1>AtmosVibe Weather</h1>
        <p>Базовые компоненты загружены!</p>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h2>Тестовый блок</h2>
          <p>Header и Footer работают правильно.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
