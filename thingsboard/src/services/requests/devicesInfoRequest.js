const { request, getRequestConfig } = require('~/utils');
function DevicesInfoRequest() {
  const getDevicesInfo = async ({ pageSize = 20, page = 0 }) => {
    const api = `/deviceInfos/all`;
    const data = getRequestConfig({
      api,
      params: { pageSize, page },
    });
    const response = await request.get(data);
    return response?.data?.data;
  };
  return { getDevicesInfo };
}

export default DevicesInfoRequest;
