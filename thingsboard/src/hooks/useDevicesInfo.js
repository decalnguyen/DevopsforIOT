import { useEffect, useState } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { devicesInfoRequest } from '~/services/requests';

const useDevicesInfo = () => {
  const { getDevicesInfo } = devicesInfoRequest();
  const [devicesInfo, setDevicesInfo] = useState([]);
  useEffect(() => {
    const fetchDevices = async () => {
      const _devicesInfo = await getDevicesInfo({});
      console.log(_devicesInfo);
      setDevicesInfo(_devicesInfo);
    };
    fetchDevices();
  }, []);
  return { devicesInfo, setDevicesInfo };
};

export default useDevicesInfo;
