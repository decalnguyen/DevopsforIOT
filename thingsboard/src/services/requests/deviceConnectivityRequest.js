import { getRequestConfig, request } from '~/utils';

export default function DeviceConnectivityRequest() {
  const getDevicePublishTelemetryCommands = async (deviceId) => {
    const api = `/device-connectivity/${deviceId}`;
    const data = getRequestConfig({
      api,
    });
    const response = await request.get(data);
    return response?.data;
  };

  return { getDevicePublishTelemetryCommands };
}
