module.exports = ({ env }) => ({
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-object-fit-images': {},
    cssnano: env === 'production' ? {} : false,
  },
});
