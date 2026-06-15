import React, { createContext, useContext, useState, useEffect } from 'react';

export type AccentColor = 'teal' | 'pink' | 'purple' | 'emerald' | 'cyan';
export type AnimationIntensity = 'none' | 'normal' | 'high';

interface ThemeContextType {
  accentColor: AccentColor;
  animationIntensity: AnimationIntensity;
  compactMode: boolean;
  setAccentColor: (color: AccentColor) => void;
  setAnimationIntensity: (intensity: AnimationIntensity) => void;
  setCompactMode: (compact: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    return (localStorage.getItem('theme-accent') as AccentColor) || 'teal';
  });
  
  const [animationIntensity, setAnimationIntensity] = useState<AnimationIntensity>(() => {
    return (localStorage.getItem('theme-animation') as AnimationIntensity) || 'normal';
  });

  const [compactMode, setCompactMode] = useState<boolean>(() => {
    return localStorage.getItem('theme-compact') === 'true';
  });

  // Apply theme classes to body
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.forEach(className => {
      if (className.startsWith('theme-') || className.startsWith('anim-')) {
        root.classList.remove(className);
      }
    });

    // Add new ones
    root.classList.add(`theme-${accentColor}`);
    root.classList.add(`anim-${animationIntensity}`);

    localStorage.setItem('theme-accent', accentColor);
    localStorage.setItem('theme-animation', animationIntensity);
  }, [accentColor, animationIntensity]);

  useEffect(() => {
    localStorage.setItem('theme-compact', String(compactMode));
  }, [compactMode]);

  return (
    <ThemeContext.Provider value={{
      accentColor,
      animationIntensity,
      compactMode,
      setAccentColor,
      setAnimationIntensity,
      setCompactMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
