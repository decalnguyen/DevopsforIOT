import { useAuth } from '~/contexts/AuthContext';

const { request, getLocalStorageItems } = require('~/utils');
function DevicesInfoRequest() {
  const { token, platform } = getLocalStorageItems();
  const getRequestConfig = ({ api, data, params }) => {
    return {
      platform,
      token,
      api,
      data,
      configs: { params },
    };
  };
  const getDevicesInfo = async ({ pageSize = 20, page = 0 }) => {
    const api = `/deviceInfos/all`;
    const data = getRequestConfig({ api, params: { pageSize, page } });
    const response = await request.get(data);
    return response.data.data;
  };
  return { getDevicesInfo };
}

export default DevicesInfoRequest;
