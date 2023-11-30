import axios from 'axios';
import { request } from '~/utils';

const authenticate = async ({ username, password, platform }) => {
  const api = `https://${platform}/api/auth/login`;
  const data = { username, password };
  try {
    const response = await axios.post(api, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data.token;
  } catch (e) {
    console.log(e);
  }
};

// The data is in array format
const getDevicesInfo = async ({ token, platform, pageSize = 5, page = 0 }) => {
  const api = `api/deviceInfos/all`;
  try {
    const response = await request.get(platform, api, token, {
      params: {
        pageSize,
        page,
      },
    });
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

// The data is in array format
const getTimeseriesData = async ({ entityType, entityId, token, platform }) => {
  const api = `https://${platform}/api/plugins/telemetry/${entityType}/${entityId}/values/timeseries`;

  try {
    const response = await axios.get(api, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

// The data is in array format
const getAttributesData = async ({ entityType, entityId, token, platform, params }) => {
  const api = `https://${platform}/api/plugins/telemetry/${entityType}/${entityId}/values/attributes`;
  try {
    const response = await axios.get(api, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      params: params,
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export { authenticate, getDevicesInfo, getTimeseriesData, getAttributesData };
