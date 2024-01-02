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
    try {
      const response = await request.get(data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const createNewDevice = async ({ deviceInfo, entityGroupId }) => {
    const api = `/device`;

    const data = getRequestConfig({ api, params: { entityGroupId }, data: deviceInfo });
    try {
      const response = await request.post(data);
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const deleteDevice = async ({ deviceId }) => {
    const api = `/device/${deviceId}`;
    const data = getRequestConfig({ api, params: { deviceId } });
    try {
      const response = await request.Delete(data);
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  return {
    getDeviceCredentialsByDeviceId,
    createNewDevice,
    deleteDevice,
  };
}

export default DeviceRequest;
