import { useEffect, useState } from 'react';

const useCheckboxItems = (numElements) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const handleCheckboxChange = (index) => {
    if (checkedItems.includes(index)) {
      setCheckedItems((prev) => prev.filter((checkItem) => checkItem !== index));
    } else setCheckedItems((prev) => [...prev, index]);
  };

  const handleCheckAll = () => {
    setCheckAll((prev) => (prev === true ? false : true));
  };

  useEffect(() => {
    if (checkAll) {
      setCheckedItems(Array.from({ length: numElements }, (_, index) => index));
    } else {
      setCheckedItems([]);
    }
  }, [checkAll, numElements]);

  return { checkedItems, setCheckedItems, checkAll, setCheckAll, handleCheckboxChange, handleCheckAll };
};

export default useCheckboxItems;
