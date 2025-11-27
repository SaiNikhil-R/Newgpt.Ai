/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#00A9FF',
        'brand-secondary': '#A0E9FF',
        'dark-bg': '#0F172A',
        'dark-card': '#1E293B',
        'dark-input': '#334155',
        'dark-text': '#E2E8F0',
        'dark-text-secondary': '#94A3B8',
      }
    }
  },
  plugins: [],
}
