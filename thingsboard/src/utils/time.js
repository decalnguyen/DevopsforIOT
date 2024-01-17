export const formatTimestamp = (timestamp) => {
  if (typeof timestamp === 'string') timestamp = parseInt(timestamp);
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return formattedDate;
};

export const isWithinTimeWindow = (timestamp, windowInSeconds = 5) => {
  if (typeof timestamp === 'string') timestamp = parseInt(timestamp);
  const currentTime = new Date().getTime();
  const msgTime = new Date(timestamp).getTime();
  const timeDifferenceInSeconds = (currentTime - msgTime) / 1000;

  return timeDifferenceInSeconds <= windowInSeconds;
};
