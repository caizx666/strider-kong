// 注册API网关
const debug = require("debug")("strider-kong:kong-registerapi");
const axios = require("axios").create({
  baseURL: process.env.KONG_URL,
});

exports.registerapi = async function registerapi({ service, route }) {
  let resSrv;
  try {
    resSrv = await axios.get(`/services/${service.name}`);
  } catch (err) {
    if (!err.response || err.response.status !== 404) {
      throw err;
    }
  }
  if (!resSrv) {
    debug("create service", service);
    resSrv = await axios.post("/services", service);
  } else {
    debug("exists service", resSrv.data.id);
  }
  let resRoutes = await axios.get(`/services/${service.name}/routes`);
  if (resRoutes.data.data.length === 0) {
    debug("create route", resSrv.data.id, route);
    resRoutes = await axios.post(`/routes`, {
      ...route,
      service: {
        id: resSrv.data.id,
      },
    });
  } else {
    debug("exists route", ...resRoutes.data.data);
  }
};
