import React from 'react';

export default function TestComponent() {
  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      background: 'red',
      zIndex: 999999999,
      color: 'white',
      fontSize: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      TEST COMPONENT VISIBLE!
    </div>
  );
}
