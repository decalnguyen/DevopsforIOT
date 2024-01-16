export const getLocalStorageItems = () => {
  return {
    token: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    platform: localStorage.getItem('platform'),
    geoJSON: localStorage.getItem('geoJSON'),
  };
};
