import { createTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Custom color palette following Material Design 3
const lightPalette = {
  primary: {
    main: '#1976D2',
    light: '#42A5F5',
    dark: '#1565C0',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#388E3C',
    light: '#66BB6A',
    dark: '#2E7D32',
    contrastText: '#FFFFFF',
  },
  accent: {
    main: '#7B1FA2',
    light: '#AB47BC',
    dark: '#6A1B9A',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF',
  },
  surface: {
    variant: '#F5F5F5',
    elevated: '#FFFFFF',
  },
};

const darkPalette = {
  primary: {
    main: '#90CAF9',
    light: '#BBDEFB',
    dark: '#64B5F6',
    contrastText: '#000000',
  },
  secondary: {
    main: '#A5D6A7',
    light: '#C8E6C9',
    dark: '#81C784',
    contrastText: '#000000',
  },
  accent: {
    main: '#CE93D8',
    light: '#E1BEE7',
    dark: '#BA68C8',
    contrastText: '#000000',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  surface: {
    variant: '#2D2D2D',
    elevated: '#1E1E1E',
  },
};

// Typography configuration with Inter font
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    letterSpacing: '-0.25px',
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    letterSpacing: '0px',
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '0.25px',
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    letterSpacing: '0px',
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: '0.15px',
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: '0.5px',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '0.25px',
    lineHeight: 1.6,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '1.25px',
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    letterSpacing: '0.4px',
    lineHeight: 1.4,
  },
};

// Shape configuration
const shape = {
  borderRadius: 8,
};

// Component overrides for Material Design 3 styling
const getComponentOverrides = (mode: PaletteMode) => ({
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: mode === 'light' 
          ? '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)'
          : '0px 1px 3px rgba(255, 255, 255, 0.12), 0px 1px 2px rgba(255, 255, 255, 0.24)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: mode === 'light'
            ? '0px 4px 8px rgba(0, 0, 0, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.12)'
            : '0px 4px 8px rgba(255, 255, 255, 0.16), 0px 2px 4px rgba(255, 255, 255, 0.12)',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        padding: '8px 24px',
        fontWeight: 500,
        textTransform: 'none' as const,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.16)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.16)',
        },
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.20), 0px 6px 10px rgba(0, 0, 0, 0.14)',
        '&:hover': {
          boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.24), 0px 8px 14px rgba(0, 0, 0, 0.18)',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderBottom: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
      },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        borderTop: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
      },
    },
  },
});

// Create theme function
export const createAppTheme = (mode: PaletteMode) => {
  const palette = mode === 'light' ? lightPalette : darkPalette;
  
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      ...palette,
    },
    typography,
    shape,
    spacing: 8,
    components: getComponentOverrides(mode),
  };

  return createTheme(themeOptions);
};

// Default themes
export const lightTheme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');

// Export types for TypeScript
declare module '@mui/material/styles' {
  interface Palette {
    accent: Palette['primary'];
    surface: {
      variant: string;
      elevated: string;
    };
  }

  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
    surface?: {
      variant?: string;
      elevated?: string;
    };
  }
}