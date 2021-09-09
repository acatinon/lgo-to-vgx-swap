module.exports = {
  purge: [
    './public/*.html',
    './src/**/*.svelte',
  ],
  variants: {
    extend: {
      display: ['disabled'],
    }
  },
  theme: {
    container: {
      center: true,
      padding: '10rem',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
}