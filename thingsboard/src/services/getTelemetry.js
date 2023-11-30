import { authenticate } from './request';
import axios from 'axios';

const getTelemetry = async (userInfo) => {
  if (userInfo === null) return null;
  const { username, password, platform, entityType, entityId } = userInfo;
  const token = await authenticate({ username, password, platform });
  const response = await axios(
    `https://${platform}/api/plugins/telemetry/${entityType}/${entityId}/values/timeseries`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
    },
  );

  return response.data;
};

export default getTelemetry;
