const { useAuth } = require('~/contexts/AuthContext');
const { request } = require('~/utils');

function useDeviceRequest() {
  const { token, platform } = useAuth();

  const getRequestConfig = ({ api, data = {}, params = {} }) => {
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

  const deleteEntityTimeSeries = async ({ entityType, entityId, keys }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/timeseries/delete`;
    const data = getRequestConfig({ api, params: { keys, deleteAllDataForKeys: true } });
    try {
      const response = await request.Delete(data);
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  return {
    deleteEntityTimeSeries,
    getDeviceCredentialsByDeviceId,
  };
}

export default useDeviceRequest;
