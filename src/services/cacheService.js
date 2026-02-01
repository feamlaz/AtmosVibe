const PREFIX = 'atmosvibe-cache:';

export function cacheGet(key) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function cacheSet(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function cacheClear() {
  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        window.localStorage.removeItem(key);
      }
    });
  } catch {
    // ignore
  }
}

export function cacheClearExpired() {
  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        const raw = window.localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.ts && Date.now() - parsed.ts > 30 * 60 * 1000) { // 30 минут
            window.localStorage.removeItem(key);
          }
        }
      }
    });
  } catch {
    // ignore
  }
}
