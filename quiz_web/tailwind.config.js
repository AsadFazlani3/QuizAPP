/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        secondary: {
          DEFAULT: '#64748b',
          dark: '#475569',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
        },
        danger: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
        },
        background: {
          DEFAULT: '#ffffff',
          muted: '#f8fafc',
        },
        muted: {
          DEFAULT: '#64748b',
          light: '#cbd5e1',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#cbd5e1',
        },
      },
    },
  },
  plugins: [],
}

