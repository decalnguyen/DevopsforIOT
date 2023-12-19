import { useEffect } from 'react';

const useInsideAlerter = (ref, onHide) => {
  useEffect(() => {
    const handleClickInside = (e) => {
      if (ref.current && ref.current.contains(e.target)) onHide();
    };
    document.addEventListener('mousedown', handleClickInside);

    return () => document.removeEventListener('mousedown', handleClickInside);
  }, [ref]);
};

export default useInsideAlerter;
