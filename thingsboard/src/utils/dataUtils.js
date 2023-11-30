export const formatAttributes = (rawData) => {
  const rawDataArray = rawData.map((data) => {
    return data.map((piece) => {
      return {
        key: piece.key,
        value: piece.value,
      };
    });
  });
  let combinedArray = [];
  for (const array of rawDataArray) {
    combinedArray = combinedArray.concat(array);
  }
  return combinedArray;
};

export const formatTimeSeries = (rawData) => {
  console.log('time series!', rawData);
  const rawDataArray = rawData.map((data) => {
    const keyArray = Object.keys(data);
    return keyArray.map((key) => {
      return {
        key: key,
        value: data[key][0].value,
      };
    });
  });
  let combinedArray = [];
  for (const array of rawDataArray) {
    combinedArray = combinedArray.concat(array);
  }
  return combinedArray;
};
