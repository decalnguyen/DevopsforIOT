function getRequestConfig({ api, data, params }) {
  const platform = localStorage.getItem('platform');
  const token = localStorage.getItem('accessToken');
  return {
    platform,
    token,
    api,
    data,
    configs: { params },
  };
}

export default getRequestConfig;
