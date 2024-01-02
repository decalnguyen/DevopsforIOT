function getRequestConfig({ platform, token, api, data, params }) {
  return {
    platform,
    token,
    api,
    data,
    configs: { params },
  };
}

export default getRequestConfig;
