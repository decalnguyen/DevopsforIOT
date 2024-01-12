import { toast } from 'react-toastify';

const { request, getLocalStorageItems, getRequestConfig } = require('~/utils');

function DeviceRequest() {
  const getDeviceCredentialsByDeviceId = async ({ deviceId }) => {
    const api = `/device/${deviceId}/credentials`;
    const data = getRequestConfig({ api });
    const response = await request.get(data);
    return response.data;
  };

  const createNewDevice = async ({ deviceInfo, entityGroupId }) => {
    const api = `/device`;

    const data = getRequestConfig({
      api,
      params: { entityGroupId },
      data: deviceInfo,
      msg: {
        loading: 'Creating new device...',
        error: 'Failed to create new device',
        success: 'Create device succesfully!',
      },
    });
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
