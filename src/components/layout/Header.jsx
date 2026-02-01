import { CloudSun } from 'lucide-react';

export default function Header({ onToggleTheme, theme }) {
  return (
    <header className="header safe-area-top">
      <div className="container header-inner">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">
            <CloudSun size={22} />
          </span>
          <span className="brand-title">AtmosVibe</span>
        </div>

        <button type="button" className="glass-button" onClick={onToggleTheme}>
          {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        </button>
      </div>
    </header>
  );
}
