export interface Store {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const createStore = (prefix: string = ""): Store => {
  const getFullKey = (key: string) => (prefix ? `${prefix}:${key}` : key);

  return {
    get: <T>(key: string): T | null => {
      try {
        const item = localStorage.getItem(getFullKey(key));
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.warn(`Error reading from store:`, e);
        return null;
      }
    },
    set: <T>(key: string, value: T): void => {
      try {
        localStorage.setItem(getFullKey(key), JSON.stringify(value));
      } catch (e) {
        console.warn(`Error writing to store:`, e);
      }
    },
    remove: (key: string): void => {
      localStorage.removeItem(getFullKey(key));
    },
    clear: (): void => {
      if (prefix) {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith(prefix)) localStorage.removeItem(k);
        });
      } else {
        localStorage.clear();
      }
    },
  };
};

export const store = createStore();
