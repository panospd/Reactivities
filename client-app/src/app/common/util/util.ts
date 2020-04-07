export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = extractTime(time);
  const dateString = extractDate(date);

  return new Date(dateString + ' ' + timeString);
};

const extractTime = (time: Date) => {
  return time.getHours() + ':' + time.getMinutes() + ':00';
};

const extractDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};
