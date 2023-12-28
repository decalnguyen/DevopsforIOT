import { useAuth } from '~/contexts/AuthContext';
const { request } = require('~/utils');

function TelemetryRequest() {
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

  const postTelemetry = async ({ entityType, entityId, telemetry }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/timeseries/ANY`;
    const data = getRequestConfig({ api, data: telemetry, params: { scope: 'ANY' } });
    try {
      const response = await request.post(data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const postAttributes = async ({ entityType, entityId, scope, telemetry }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/${scope}`;
    const data = getRequestConfig({ api, data: telemetry });
    try {
      const response = await request.post(data);
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const getTimeseriesData = async ({ entityType, entityId }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/values/timeseries`;
    const data = getRequestConfig({ api });
    try {
      const response = await request.get(data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  // The data is in array format
  const getAttributesData = async ({ entityType, entityId, params }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/values/attributes`;
    const data = getRequestConfig({ api, params });
    try {
      const response = await request.get(data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const getAttributesByScope = async ({ entityType, entityId, scope, keys }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/values/attributes/${scope}`;
    const data = getRequestConfig({ api, params: keys });
    try {
      const response = await request.get(data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  };

  // keys must be a string value representing the comma-separated list of attributes keys
  const deleteEntityAttributes = async ({ entityType, entityId, scope, keys }) => {
    const api = `/plugins/telemetry/${entityType}/${entityId}/${scope}`;
    const data = getRequestConfig({ api, params: keys });
    try {
      const response = await request.Delete(data);
      console.log('response:', response);
      return response;
    } catch (e) {
      console.log(e);
    }
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
