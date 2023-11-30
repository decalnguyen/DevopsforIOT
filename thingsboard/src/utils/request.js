import axios from 'axios';

const createRequest = (platform, token) => {
  const request = axios.create({
    baseURL: `https://${platform}/`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return request;
};

export const get = async (platform, path, token, options) => {
  const request = createRequest(platform, token);
  console.log('token:', token);
  const response = await request.get(path, options);
  return response;
};

export const post = async (platform, path, token, options) => {
  const request = createRequest(platform, token);
  const response = await request.post(path, options);
  return response;
};
