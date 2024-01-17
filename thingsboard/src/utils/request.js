import axios from 'axios';
import { toast } from 'react-toastify';
import { customHistory } from '~/CustomBrowserRouter';
const CreateRequest = () => {
  const platform = 'thingsboard.cloud';
  const token = localStorage.getItem('accessToken');
  const request = axios.create({
    baseURL: `https://${platform}/api/`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  request.interceptors.request.use(
    (config) => {
      // You can modify the request config here (e.g., add headers, modify data)
      return config;
    },
    (error) => {
      // Handle request error
      return Promise.reject(error);
    },
  );

  request.interceptors.response.use(
    (response) => {
      // You can modify the response data here
      return response;
    },
    async (error) => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.log('No refresh token found');
          customHistory.push('/auth');
          return Promise.reject(error);
        }
        const response = await request.post('auth/token', { refreshToken });
        if (response && response?.status === 200) {
          localStorage.setItem('accessToken', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          const retryConfig = error?.config;
          retryConfig.headers.Authorization = `Bearer ${response.data.token}`;
          const retryResponse = await axios(retryConfig);
          return retryResponse;
        } else {
          console.log('Refresh token failed');
          customHistory.push('/auth');
        }
        return Promise.reject(error);
      } catch (err) {
        customHistory.push('/auth');
        console.error('Error refreshing token ', err);
        return Promise.reject(error);
      }
    },
  );
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
  const request = CreateRequest(platform, token);
  return makeRequest(request.get, api, configs, msg);
};

export const post = async ({ platform, api, token, data, configs, msg = null }) => {
  const request = CreateRequest(platform, token);
  return makeRequest(request.post, api, data, configs, msg);
};

export const Delete = async ({ platform, token, api, configs, msg = null }) => {
  const request = CreateRequest(platform, token);
  return makeRequest(request.delete, api, configs, msg);
};
