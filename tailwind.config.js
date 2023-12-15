/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}", // Adjust the path according to your project structure
    "./pages/**/*.{js,jsx,ts,tsx}",      // Include this if you have a pages directory
    "./path/to/your/other/js/or/html/files/**/*.{js,jsx,html}", // Additional paths
    // You can add more paths as needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
