module.exports = {
  purge: [
    './public/*.html',
    './src/**/*.svelte',
  ],
  variants: {
    extend: {
      backgroundColor: ['disabled'],
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