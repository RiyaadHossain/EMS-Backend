import { JwtPayload } from 'jsonwebtoken';
import Notification from './model';
import User from '../user/model';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import { INotification } from './interface';

const get = async (user: JwtPayload) => {
  const { userId } = user;

  const userDetails = await User.findOne({ userId });
  if (!userDetails)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Uesr account not found!');

  const notifications = await Notification.find({
    to: userDetails._id,
    isRead: false,
  });

  return notifications;
};

const add = async (payload: INotification) => {
  await Notification.create(payload)
}

const readAll = async (user: JwtPayload) => {
  const { userId } = user;

  const userDetails = await User.findOne({ userId });
  if (!userDetails)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Uesr account not found!');

  const notifications = await Notification.updateMany(
    { to: userDetails._id, isRead: false },
    { isRead: true },
    { new: true }
  );
  return notifications;
};

export const NotificationServices = {
  get,
  add,
  readAll,
};
