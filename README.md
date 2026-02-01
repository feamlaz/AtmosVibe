# AtmosVibe Weather

## Запуск

**Важно:** не открывайте `index.html` двойным щелчком — приложение должно работать через сервер (или после сборки — из папки `dist`).

1) Установи зависимости:

```bash
npm install
```

2) Создай `.env` на основе `.env.example` и добавь ключ:

`VITE_OPENWEATHER_API_KEY=...`

3) Запусти dev:

```bash
npm run dev
```

Открой в браузере адрес, который покажет Vite (обычно http://localhost:3000).

Либо собери проект и открой собранную версию: `npm run build`, затем открой файл `dist/index.html` в браузере.

## PWA

- `public/manifest.json`
- `public/service-worker.js`
- offline fallback: `public/offline.html`
