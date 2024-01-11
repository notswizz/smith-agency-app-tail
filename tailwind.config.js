/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}", // Adjust the path according to your project structure
    "./pages/**/*.{js,jsx,ts,tsx}",      // Include this if you have a pages directory
  ],
  theme: {
    extend: {
      animation: {
        'scroll-left': 'scroll-left 10s linear infinite',
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
