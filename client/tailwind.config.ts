import type { Config } from 'tailwindcss';
import theme from './styles/theme';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        hoverColor: theme.colors.hoverColor,
      },
      screens: {
        xs: '400px',
        sm: '640px', // Small screens
        md: '769px', // Medium screens
        lg: '1025px', // Large screens
        xl: '1280px', // Extra large screens
      },
    },
  },
  plugins: [],
};
export default config;
