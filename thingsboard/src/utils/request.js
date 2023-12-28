import axios from 'axios';

const createRequest = (platform, token) => {
  const request = axios.create({
    baseURL: `https://${platform}/api/`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return request;
};

export const get = async ({ platform, api, token, configs }) => {
  const request = createRequest(platform, token);
  const response = await request.get(api, configs);
  return response;
};

export const post = async ({ platform, api, token, data, configs }) => {
  const request = createRequest(platform, token);
  const response = await request.post(api, data, configs);
  return response;
};

export const Delete = async ({ platform, token, api, configs }) => {
  const request = createRequest(platform, token);
  const response = await request.delete(api, configs);
  return response;
};
