// frontend/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#004E89',
      },
    },
  },
  plugins: [],
}