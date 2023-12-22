import axios from 'axios';
import { useAuth } from '~/contexts/AuthContext';
import { request } from '~/utils';

export const authenticate = async ({ username, password, platform }) => {
  const api = `https://${platform}/api/auth/login`;
  const data = { username, password };
  try {
    const response = await axios.post(api, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const { token, refreshToken } = response.data;
    console.log('refresh token: ' + refreshToken);
    return response.data.token;
  } catch (e) {
    console.log(e);
  }
};

// The data is in array format
export const getDevicesInfo = async ({ token, platform, pageSize = 20, page = 0 }) => {
  const api = `/deviceInfos/all`;
  try {
    const data = {
      platform,
      api,
      token,
      configs: { params: { pageSize, page } },
    };
    const response = await request.get(data);
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

// The data is in array format
export const getTimeseriesData = async ({ entityType, entityId, token, platform }) => {
  const api = `/plugins/telemetry/${entityType}/${entityId}/values/timeseries`;

  try {
    const data = { platform, api, token, option: {} };
    const response = await request.get(data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

// The data is in array format
export const getAttributesData = async ({ entityType, entityId, token, platform, params }) => {
  const api = `/plugins/telemetry/${entityType}/${entityId}/values/attributes`;
  try {
    const data = {
      platform,
      api,
      token,
      option: {
        params,
      },
    };
    const response = await request.get(data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const createNewDevice = async ({ deviceInfo, entityGroupId, platform, token }) => {
  const api = `/device`;
  console.log('device info', deviceInfo);
  console.log('entity group id', entityGroupId);
  const data = {
    platform,
    api,
    token,
    data: deviceInfo,
    configs: {
      params: {
        entityGroupId: entityGroupId,
      },
    },
  };
  try {
    const response = await request.post(data);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const deleteDevice = async ({ platform, token, deviceId }) => {
  const api = `https://${platform}/api/device/${deviceId}`;
  try {
    const data = {
      platform,
      token,
      api,
      configs: {
        params: { deviceId },
      },
    };
    const response = await request.Delete(data);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const getOwnerInfos = async ({ token, platform, pageSize = 10, page = 0 }) => {
  const api = `/ownerInfos`;
  try {
    const data = {
      platform,
      api,
      token,
      data: {},
      configs: {
        params: { pageSize, page },
      },
    };
    const response = request.get(data);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const getDeviceProfiles = async ({ token, platform, pageSize = 10, page = 0 }) => {
  const api = `/deviceProfiles`;
  try {
    const data = {
      platform,
      api,
      token,
      data: {},
      configs: {
        params: { pageSize, page },
      },
    };
    const response = await request.get(data);
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const getEntityGroupsByType = async ({ token, platform, groupType, includeShared = true }) => {
  const api = `/entityGroups/${groupType}`;
  try {
    const data = {
      platform,
      api,
      token,
      configs: {
        params: {
          includeShared,
        },
      },
    };
    const response = await request.get(data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const getAttributesByScope = async ({ token, platform, entityType, entityId, scope, keys }) => {
  const api = `/plugins/telemetry/${entityType}/${entityId}/values/attributes/${scope}`;
  try {
    const data = {
      platform,
      api,
      token,
      configs: {
        params: { keys },
      },
    };
    const response = await request.get(data);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const deleteEntityTimeSeries = async ({ token, platform, entityType, entityId, keys }) => {
  const api = `/plugins/telemetry/${entityType}/${entityId}/timeseries/delete`;
  try {
    const data = {
      platform,
      api,
      token,
      configs: {
        params: { keys },
      },
    };
    const response = await request.Delete(data);
    return response;
  } catch (e) {
    console.log(e);
  }
};
