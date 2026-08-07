import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1f2937',
          light: '#4b5563',
          accent: '#2563eb'
        }
      }
    }
  },
  plugins: [forms]
};
