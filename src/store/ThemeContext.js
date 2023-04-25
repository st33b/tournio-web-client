import {createContext, useContext, useEffect, useState} from "react";

const ThemeContext = createContext({
  theme: {
    active: 'light',
    preferred: 'auto',
  },
  setTheme: null,
});

export const ThemeContextProvider = ({children}) => {
  const [theme, setTheme] = useState(null);

  const updatePreferredTheme = (toTheme) => {
    let activeTheme = toTheme;
    if (toTheme === 'auto') {
      activeTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark').matches ? 'dark' : 'light';
    }
    setTheme({
      preferred: toTheme,
      active: activeTheme,
    });
    document.documentElement.setAttribute('data-bs-theme', activeTheme);
  }

  useEffect(() => {
    if (!window || !document) {
      return;
    }
    // Here is where we can get it from storage, to preserve it across sessions/requests
    updatePreferredTheme('auto');
  }, []);

  return (
    <ThemeContext.Provider value={{theme, updatePreferredTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => useContext(ThemeContext);
