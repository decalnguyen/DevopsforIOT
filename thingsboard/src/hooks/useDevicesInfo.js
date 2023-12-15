import { useEffect, useState } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { getDevicesInfo } from '~/services/request';

const useDevicesInfo = () => {
  const { token, platform } = useAuth();
  const [devicesInfo, setDevicesInfo] = useState([]);
  useEffect(() => {
    const fetchDevices = async () => {
      const _devicesInfo = await getDevicesInfo({ token, platform });
      setDevicesInfo(_devicesInfo);
    };
    fetchDevices();
  }, [token, platform]);
  return devicesInfo;
};

export default useDevicesInfo;
