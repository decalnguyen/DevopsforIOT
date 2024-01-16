import axios from 'axios';
import { getRequestConfig } from '~/hooks';
const { request } = require('~/utils');

function AuthRequest() {
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
      const { token, refreshToken } = response?.data;
      console.log('refresh token: ' + refreshToken);
      // return response.data.token;
      return { token, refreshToken };
    } catch (e) {
      console.log(e);
    }
  };
  return { authenticate };
}

export default AuthRequest;
