/* Tailwind CDN configuration — mirrors the PHP app's inline config. */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: { 900: '#0B1F3A', 800: '#0F2B4C', 700: '#1A3A60', 600: '#1E4A78', 500: '#2563A8' },
        brand: { DEFAULT: '#1D4ED8', light: '#EFF6FF', hover: '#1E40AF' },
        accent: { DEFAULT: '#F7941E', light: '#FFF4E6', hover: '#E07E12' },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.04), 0 6px 16px -10px rgba(15,43,76,.14)',
        lift: '0 14px 34px -14px rgba(15,43,76,.26)',
      },
    },
  },
};
