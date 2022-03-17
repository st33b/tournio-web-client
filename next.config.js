module.exports = {
  async redirects() {
    return [
      {
        source: '/director',
        destination: '/director/tournaments',
        permanent: true,
      }
    ]
  },
  reactStrictMode: true,
}