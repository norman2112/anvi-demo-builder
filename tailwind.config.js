/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Primary
        'pv-red': '#B60001',
        'scarlet': '#780009',
        'flash-red': '#E2251B',
        'steel-blue': '#6A94AA',

        // Secondary
        'pv-black': '#000000',
        'charcoal': '#1E1E1E',
        'stone': '#333232',
        'primer': '#474746',
        'concrete': '#686868',
        'ash': '#CCCCCC',

        // CTA
        'cta-steel': '#527A8E',
        'cta-steel-hover': '#4A7082',
        'cta-ice': '#9EBAC7',
        'cta-ice-hover': '#ABC2CF',

        // Charting / Accent
        'pv-gold': '#FFAC47',
        'pv-blue': '#023779',
        'pv-grass': '#09AA61',
        'pv-turquoise': '#12D8E2',
        'pv-violet': '#451F55',

        // Neutrals
        'grey': '#D6D6D6',
        'med-grey': '#DFDEDD',
        'light-grey': '#EBEBEB',
        'not-white': '#F5F5F5',
      }
    }
  },
  plugins: [],
}
