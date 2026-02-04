/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./projects/ng-govbr-tw/tailwind.preset')],
  content: [
    "./projects/demo/src/**/*.{html,ts}",
    "./projects/ng-govbr-tw/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
