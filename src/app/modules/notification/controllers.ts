import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { NotificationServices } from './services';
import { JwtPayload } from 'jsonwebtoken';

const get: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await NotificationServices.get(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification Information retvied succesfully',
    data: result,
  });
});

const readAll: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload
  const result = await NotificationServices.readAll(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification Information updated succesfully',
    data: result,
  });
});


export const NotificationControllers = {
  get,
  readAll,
};
