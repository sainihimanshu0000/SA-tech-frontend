// AgroMart Theme Configuration
export const theme = {
  colors: {
    primary: {
      50: '#F1F8E9',
      100: '#E3F2FD',
      200: '#C8E6C9',
      300: '#A5D6A7',
      400: '#81C784',
      500: '#66BB6A',
      600: '#4CAF50',
      700: '#2E7D32',
      800: '#1B5E20',
      900: '#0D3818',
    },
    secondary: {
      50: '#FEF3C7',
      100: '#FCD34D',
      200: '#FBD34D',
      300: '#F59E0B',
      400: '#F97316',
      500: '#EA8C55',
      600: '#DC5D00',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    accent: '#F9A825',
    error: '#EF5350',
    success: '#66BB6A',
    warning: '#FFA726',
    info: '#29B6F6',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    background: '#F1F8E9',
    dark: '#1B5E20',
    light: '#F1F8E9',
  },
  typography: {
    fontFamily: {
      primary: "'Poppins', sans-serif",
      secondary: "'Roboto', sans-serif",
      mono: "'Courier New', monospace",
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  shadows: {
    soft: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    hover: '0 10px 15px rgba(0, 0, 0, 0.15)',
    large: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.875rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
};

// Responsive breakpoints
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
  ultrawide: '1920px',
};

// Z-index scale
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 500,
  fixed: 1000,
  modal: 2000,
  popover: 3000,
  notification: 4000,
};

export default theme;
