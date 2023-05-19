module.exports = {
  async redirects() {
    return [
      {
        source: '/director',
        destination: '/director/tournaments',
        permanent: true,
      },
    ].filter(Boolean);
  },
  reactStrictMode: true,
};
