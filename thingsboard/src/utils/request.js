import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [msg] = params;
  if (msg !== null) {
    console.log('toast');
    const { success, error, loading } = msg;
    try {
      const loadingId = toast.loading(loading, { autoClose: false });
      const response = await requestFuntion(...params);
      toast.dismiss(loadingId);
      toast.success(success, { autoClose: 1000 });
      return response;
    } catch (e) {
      console.log(e);
      toast.dismiss();
      toast.error(error, { autoClose: 2000 });
      return;
    }
  }

  try {
    const response = await requestFuntion(...params);
    return response;
  } catch (e) {
    console.log(e);
  }
};

export const get = async ({ platform, api, token, configs, msg = null }) => {
  const request = createRequest(platform, token);
  return makeRequest(request.get, api, configs, msg);
};

export const post = async ({ platform, api, token, data, configs, msg = null }) => {
  const request = createRequest(platform, token);
  return makeRequest(request.post, api, data, configs, msg);
};

export const Delete = async ({ platform, token, api, configs, msg = null }) => {
  const request = createRequest(platform, token);
  return makeRequest(request.delete, api, configs, msg);
};
