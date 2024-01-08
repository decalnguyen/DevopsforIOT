const { request, getLocalStorageItems } = require('~/utils');

function TelemetryRequest() {
  const { token, platform } = getLocalStorageItems();
  const getRequestConfig = ({ api, data = {}, params = {} }) => {
    return {
      platform,
      token,
      api,
      data,
      configs: { params },
    };
  };
  const deleteEntityTimeSeries = async ({ entityType, entityId, keys }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/timeseries/delete`;
    const data = getRequestConfig({ api, params: { keys, deleteAllDataForKeys: true } });
    const response = await request.Delete(data);
    return response;
  };

  const postTelemetry = async ({ entityType, entityId, telemetry }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/timeseries/ANY`;
    const data = getRequestConfig({ api, data: telemetry, params: { scope: 'ANY' } });
    const response = await request.post(data);
    return response.data;
  };

  const postAttributes = async ({ entityType, entityId, scope, telemetry }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/${scope}`;
    const data = getRequestConfig({ api, data: telemetry });
    const response = await request.post(data);
    return response;
  };

  const getTimeseriesData = async ({ entityType, entityId }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/values/timeseries`;
    const data = getRequestConfig({ api });
    const response = await request.get(data);
    return response.data;
  };

  // The data is in array format
  const getAttributesData = async ({ entityType, entityId, params }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/values/attributes`;
    const data = getRequestConfig({ api, params });
    const response = await request.get(data);
    return response.data;
  };

  const getAttributesByScope = async ({ entityType, entityId, scope, keys }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/values/attributes/${scope}`;
    const data = getRequestConfig({ api, params: keys });
    const response = await request.get(data);
    return response.data;
  };

  // keys must be a string value representing the comma-separated list of attributes keys
  const deleteEntityAttributes = async ({ entityType, entityId, scope, keys }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/${scope}`;
    const data = getRequestConfig({ api, params: keys });
    const response = await request.Delete(data);
    return response;
  };

  return {
    deleteEntityAttributes,
    deleteEntityTimeSeries,
    postTelemetry,
    postAttributes,
    getTimeseriesData,
    getAttributesData,
    getAttributesByScope,
  };
}

export default TelemetryRequest;
