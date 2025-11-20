module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-noto-sans-jp)', 'sans-serif'],
        code: ['var(--font-fira-code)', 'monospace'],
        icons: ['var(--font-material-icons)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
