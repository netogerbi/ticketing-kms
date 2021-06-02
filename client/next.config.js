module.exports = {
  webpackDevMiddleware: (config) => {
    config.whatchOptions.poll = 300;
    return config;
  },
};
