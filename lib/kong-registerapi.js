// 注册API网关

exports.registerapi = async function registerapi(
  { url, service, route },
  context
) {
  const axios = require("axios").create({
    baseURL: url || process.env.KONG_URL,
  });
  let resSrv;
  try {
    resSrv = await axios.get(`/services/${service.name}`);
  } catch (err) {
    if (!err.response || err.response.status !== 404) {
      throw err;
    }
  }
  if (!resSrv) {
    context.comment("create service " + service);
    resSrv = await axios.post("/services", service);
  } else {
    context.comment("exists service " + resSrv.data.id);
  }
  let resRoutes = await axios.get(`/services/${service.name}/routes`);
  if (resRoutes.data.data.length === 0) {
    // context.comment("create route "+ resSrv.data.id);
    resRoutes = await axios.post(`/routes`, {
      ...route,
      service: {
        id: resSrv.data.id,
      },
    });
    context.comment(
      "create route " + JSON.stringify(resRoutes.data.data)
    );
  } else {
    context.comment(
      "exists route " + JSON.stringify(resRoutes.data.data)
    );
  }
};
