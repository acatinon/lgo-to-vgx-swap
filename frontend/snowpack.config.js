module.exports = {
  mount: {
    public: '/',
    src: '/',
  },
  optimize: {
    bundle: true,
  },
  buildOptions: {
    out: "docs",
    metaUrlPath: `dist`,
  },
  plugins: [
    '@snowpack/plugin-svelte',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss'
  ]
}