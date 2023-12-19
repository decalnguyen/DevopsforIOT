import { useEffect } from 'react';

const useOutsideAlerter = (ref, onHide) => {
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onHide();
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);
};

export default useOutsideAlerter;
