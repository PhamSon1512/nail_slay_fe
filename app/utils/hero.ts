import { heroui } from '@heroui/react';

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          50: '#fff7f9',
          100: '#fff0f3',
          200: '#ffdce5',
          300: '#f9c0cf',
          400: '#f6b5c3',
          500: '#f2a7b7',
          600: '#df8a9d',
          700: '#c46d82',
          800: '#9f5269',
          900: '#7b3a4d',
          DEFAULT: '#f2a7b7',
          foreground: '#1d1d1d',
        },
        secondary: {
          DEFAULT: '#1d1d1d',
          foreground: '#fff3f5',
        },
        default: {
          50: '#fff7f9',
          100: '#fff0f3',
          200: '#f5e8ec',
          DEFAULT: '#f5e8ec',
          foreground: '#1d1d1d',
        },
        content1: {
          DEFAULT: '#ffffff',
          foreground: '#1d1d1d',
        },
        content2: {
          DEFAULT: '#fffafb',
          foreground: '#1d1d1d',
        },
        focus: '#f2a7b7',
      },
    },
    dark: {
      colors: {
        primary: {
          DEFAULT: '#f2a7b7',
          foreground: '#1d1d1d',
        },
        secondary: {
          DEFAULT: '#ffdde5',
          foreground: '#1d1d1d',
        },
        default: {
          DEFAULT: '#3a3034',
          foreground: '#fff3f5',
        },
        content1: {
          DEFAULT: '#2a2226',
          foreground: '#fff3f5',
        },
        focus: '#f2a7b7',
      },
    },
  },
});
