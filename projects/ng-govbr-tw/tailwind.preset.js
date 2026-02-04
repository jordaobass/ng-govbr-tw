/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'govbr-primary': '#1351b4',
        'govbr-primary-dark': '#0c326f',
        'govbr-primary-darkest': '#071d41',
        'govbr-primary-light': '#c5d4eb',
        'govbr-primary-lightest': '#dbe8fb',
        'govbr-success': '#168821',
        'govbr-danger': '#e52207',
        'govbr-warning': '#ffcd07',
        'govbr-warning-bg': '#fff5c2',
        'govbr-info': '#155bcb',
        'govbr-info-bg': '#d4e5ff',
        'govbr-focus': '#ffbe2e',
        'govbr-gray': {
          2: '#f8f8f8',
          5: '#ededed',
          10: '#cccccc',
          20: '#a8a8a8',
          40: '#888888',
          60: '#555555',
          80: '#333333',
        },
      },
      fontFamily: {
        rawline: ['Rawline', 'Raleway', 'sans-serif'],
      },
      borderRadius: {
        'govbr-pill': '100em',
      },
      fontSize: {
        'govbr-xs': ['0.75rem', { lineHeight: '1rem' }],
        'govbr-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'govbr-base': ['1rem', { lineHeight: '1.5rem' }],
        'govbr-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'govbr-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'govbr-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'govbr-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      keyframes: {
        'modal-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'modal-in': 'modal-in 0.2s ease-out',
      },
      spacing: {
        'govbr-1': '0.25rem',
        'govbr-2': '0.5rem',
        'govbr-3': '0.75rem',
        'govbr-4': '1rem',
        'govbr-5': '1.25rem',
        'govbr-6': '1.5rem',
        'govbr-8': '2rem',
        'govbr-10': '2.5rem',
      },
    },
  },
};
