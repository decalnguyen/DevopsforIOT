import { useEffect, useState } from 'react';
import { getDeviceProfiles, getEntityGroupsByType, getOwnerInfos } from '~/services/request';
import { getLocalStorageItems } from '~/utils';

export const useAddDeviceModal = (initialSuggestions = []) => {
  const { token, platform } = getLocalStorageItems();
  const [suggestions, setSuggestions] = useState([initialSuggestions]);

  useEffect(() => {
    const fetchOwnersInfo = async () => {
      const response = await getOwnerInfos({ token, platform });
      return response?.data?.data;
    };
    const getDevicesProfileInfo = async () => {
      const response = await getDeviceProfiles({ token, platform });
      return response;
    };

    const getGroups = async () => {
      const groupType = 'DEVICE';
      const response = await getEntityGroupsByType({ token, platform, groupType });
      return response;
    };

    const fetchSuggestions = async () => {
      const [ownersInfo, devicesProfileInfo, groupsInfo] = await Promise.all([
        fetchOwnersInfo(),
        getDevicesProfileInfo(),
        getGroups(),
      ]);
      const combinedData = { ownersInfo, devicesProfileInfo, groupsInfo };
      console.log(combinedData);
      setSuggestions(combinedData);
    };

    fetchSuggestions();
  }, [token, platform]);
  return [suggestions, setSuggestions];
};
