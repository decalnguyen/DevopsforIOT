import { useState, useEffect } from 'react';
import { useAuth } from '~/contexts/AuthContext';
import { getAttributesByScope } from '~/services/request';

const useAttributes = ({ entityType, entityId, scope = 'SERVER_SCOPE', keys }) => {
  const [attributes, setAttributes] = useState({});
  const { token, platform } = useAuth();
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await getAttributesByScope({ token, platform, entityType, entityId, scope, keys });
        setAttributes(response.data);
        console.log(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAttributes();
  }, [entityType, entityId, scope, keys, token, platform]);
  return [attributes, setAttributes];
};

export default useAttributes;
