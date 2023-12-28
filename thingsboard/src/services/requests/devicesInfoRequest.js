import { useAuth } from '~/contexts/AuthContext';

const { request } = require('~/utils');
function DevicesInfoRequest() {
  const { token, platform } = useAuth();
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
    try {
      const response = await request.get(data);
      return response.data.data;
    } catch (e) {
      console.log(e);
    }
  };
  return { getDevicesInfo };
}

export default DevicesInfoRequest;
