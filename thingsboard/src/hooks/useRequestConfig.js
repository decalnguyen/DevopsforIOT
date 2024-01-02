const { useAuth } = require('~/contexts/AuthContext');

const GetRequestConfig = ({ api, data = {}, params = {} }) => {
  const { token, platform } = getLocalStorageItems();
  return {
    platform,
    token,
    api,
    data,
    configs: { params },
  };
};

export default GetRequestConfig;
