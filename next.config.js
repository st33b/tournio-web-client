module.exports = {
  async redirects() {
    return [
      process.env.MAINTENANCE_MODE === '1'
        ? { source: "/((?!maint).*)", destination: "/maint.html", permanent: false }
        : null,
    ].filter(Boolean);
  },
  reactStrictMode: true,
};
