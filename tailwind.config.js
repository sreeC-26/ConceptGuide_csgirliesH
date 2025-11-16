/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'magic-indigo': '#6366F1',
        'vibrant-teal': '#14B8A6',
        'success-green': '#10B981',
        'focus-amber': '#F59E0B',
        'error-red': '#EF4444',
        'neutral-white': '#F8FAFC',
        'deep-slate': '#1E293B',
        'muted-slate': '#64748B',
      },
    },
  },
  plugins: [],
}

