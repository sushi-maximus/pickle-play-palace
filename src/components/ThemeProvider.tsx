
import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "pickle-ninja-theme",
  ...props
}: ThemeProviderProps) {
  // Force light theme - ignore localStorage and always use light
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    const root = window.document.documentElement;
    const body = document.body;
    
    // Remove all theme classes from both root and body
    root.classList.remove("light", "dark");
    body.classList.remove("light", "dark");
    
    // Force light theme and override any system preferences
    root.classList.add("light");
    body.classList.add("light");
    
    // Also set the color-scheme CSS property to override system preferences
    root.style.colorScheme = "light";
    body.style.colorScheme = "light";
    
    // Force specific CSS variables for light theme
    root.style.setProperty('--background', 'white');
    root.style.setProperty('--foreground', 'black');
    
    // Force the theme meta tag for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', '#ffffff');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#ffffff';
      document.head.appendChild(meta);
    }
    
    // Add viewport meta tag if it doesn't exist to ensure proper mobile rendering
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(meta);
    }
    
    // Override any media query preferences with mobile-specific CSS
    const style = document.createElement('style');
    style.textContent = `
      /* Mobile Safari and iOS specific overrides */
      @supports (-webkit-touch-callout: none) {
        html, body, * {
          color-scheme: light !important;
          background-color: white !important;
          color: black !important;
        }
      }
      
      /* General mobile device targeting */
      @media screen and (max-width: 768px) {
        html, body, * {
          color-scheme: light !important;
          background-color: white !important;
          color: black !important;
        }
        
        :root {
          color-scheme: light !important;
          --background: white !important;
          --foreground: black !important;
        }
      }
      
      @media (prefers-color-scheme: dark) {
        html, body {
          color-scheme: light !important;
          background-color: white !important;
          color: black !important;
        }
        * {
          color-scheme: light !important;
        }
      }
      
      /* Force all elements to use light theme */
      html, body, * {
        color-scheme: light !important;
      }
      
      /* Override any dark mode backgrounds */
      html {
        background-color: white !important;
        color: black !important;
      }
      
      body {
        background-color: white !important;
        color: black !important;
      }
      
      /* Force light theme for all CSS custom properties */
      :root {
        color-scheme: light !important;
        --background: white !important;
        --foreground: black !important;
      }
      
      /* Override webkit dark mode detection */
      @media (prefers-color-scheme: dark) {
        :root {
          color-scheme: light !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Force the document to always report light color scheme
    Object.defineProperty(window.matchMedia('(prefers-color-scheme: dark)'), 'matches', {
      value: false,
      writable: false
    });
  }, [theme]);

  const value = {
    theme: "light" as Theme,
    setTheme: (newTheme: Theme) => {
      // Force light mode - ignore any theme changes
      localStorage.setItem(storageKey, "light");
      setTheme("light");
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
