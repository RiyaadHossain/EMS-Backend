import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { ProfileServices } from './services';
import { JwtPayload } from 'jsonwebtoken';

const me: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await ProfileServices.me(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile Information retvied succesfully',
    data: result,
  });
});

const update: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const data = req.body;
  const result = await ProfileServices.update(user, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile Information retvied succesfully',
    data: result,
  });
});

export const ProfileControllers = {
  me,
  update,
};
