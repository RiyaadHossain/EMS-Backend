import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { AnnouncementServices } from './services';
import { JwtPayload } from 'jsonwebtoken';

const get: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await AnnouncementServices.get(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Announcement Information retvied succesfully',
    data: result,
  });
});

const add: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload
  const announcementData = req.body
  const result = await AnnouncementServices.add(user, announcementData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Announcement posted succesfully',
    data: result,
  });
});


export const AnnouncementControllers = {
  get,
  add,
};
