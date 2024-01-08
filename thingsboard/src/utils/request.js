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

const makeRequest = async (requestFuntion, ...params) => {
  try {
    const response = await requestFuntion(...params);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const get = async ({ platform, api, token, configs }) => {
  const request = createRequest(platform, token);
  return makeRequest(request.get, api, configs);
};

export const post = async ({ platform, api, token, data, configs }) => {
  const request = createRequest(platform, token);
  return makeRequest(request.post, api, data, configs);
};

export const Delete = async ({ platform, token, api, configs }) => {
  const request = createRequest(platform, token);
  return makeRequest(request.delete, api, configs);
};
