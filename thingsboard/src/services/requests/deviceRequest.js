import { useAuth } from '~/contexts/AuthContext';
const { request, getLocalStorageItems } = require('~/utils');

function DeviceRequest() {
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
  const getDeviceCredentialsByDeviceId = async ({ deviceId }) => {
    const api = `/device/${deviceId}/credentials`;
    const data = getRequestConfig({ api });
    const response = await request.get(data);
    return response.data;
  };

  const createNewDevice = async ({ deviceInfo, entityGroupId }) => {
    const api = `/device`;

    const data = getRequestConfig({ api, params: { entityGroupId }, data: deviceInfo });
    const response = await request.post(data);
    return response;
  };

  const deleteDevice = async ({ deviceId }) => {
    const api = `/device/${deviceId}`;
    const data = getRequestConfig({ api, params: { deviceId } });
    const response = await request.Delete(data);
    return response;
  };

  return {
    getDeviceCredentialsByDeviceId,
    createNewDevice,
    deleteDevice,
  };
}

export default DeviceRequest;
