import React from 'react';

function App() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
    }}>
      <h1>AtmosVibe Weather</h1>
      <p>Приложение работает!</p>
      <p>React компонент загружен успешно.</p>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Тестовый блок</h2>
        <p>Если вы видите это, значит React работает правильно.</p>
      </div>
    </div>
  );
}

export default App;
