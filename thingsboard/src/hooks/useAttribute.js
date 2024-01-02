import { useState, useEffect } from 'react';
import { telemetryRequest } from '~/services/requests';

const useAttributes = ({ entityType, entityId, scope = 'CLIENT_SCOPE', keys }) => {
  const [attributes, setAttributes] = useState([]);
  const { postAttributes, getAttributesByScope, deleteEntityAttributes } = telemetryRequest();

  const handleAddAttribute = async (newAttribute) => {
    const response = await postAttributes(newAttribute);
    if (response.status === 200) {
      const updatedAttributes = await getAttributesByScope({ entityType, entityId, scope, keys });
      setAttributes(updatedAttributes);
    }
  };

  const handleDeleteAttributes = async (_keys) => {
    const response = await deleteEntityAttributes({ entityType, entityId, scope, keys: _keys });
    console.log(response);
    if (response.status === 200) {
      const updatedAttributes = await getAttributesByScope({ entityType, entityId, scope, keys });
      console.log('update:', updatedAttributes);
      setAttributes(updatedAttributes);
    }
  };
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await getAttributesByScope({ entityType, entityId, scope, keys });
        setAttributes(response);
        console.log(response);
      } catch (e) {
        console.error(e);
      }
    };
    fetchAttributes();
  }, [entityType, entityId, scope, keys]);
  return { attributes, setAttributes, handleAddAttribute, handleDeleteAttributes };
};

export default useAttributes;
