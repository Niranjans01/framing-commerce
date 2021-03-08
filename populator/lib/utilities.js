const axios = require('axios').default;

module.exports = {
  createInstance: (host, auth) => {
    const instance = axios.create({
      baseURL: host,
      timeout: 60000,
    });

    if (auth) {
      instance.interceptors.request.use(config => {
        config.headers.common["Masterframing-X-Auth-Token"] = auth;
        return config;
      });

      instance.interceptors.response.use(async function (response) {
        // sleep for 200ms
        await new Promise(resolve => setTimeout(resolve, 200));
        return response;
      }, function (error) {
        return Promise.reject(error);
      });
    }

    return instance;
  }
};
