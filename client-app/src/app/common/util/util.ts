import { IActivity, IAttendee } from '../../Models/activity';
import { IUser } from '../../Models/user';

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

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);

  activity.isGoing = activity.attendees.some(a => a.username === user.username);

  activity.isHost = activity.attendees.some(
    a => a.username === user.username && a.isHost
  );

  return activity;
};

export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!
  };
};
