import catchAsync from '@/shared/catchAsync';
import { RequestHandler } from 'express';
import sendResponse from '@/shared/sendResponse';
import httpStatus from 'http-status';
import { UserServices } from './services';

const register: RequestHandler = catchAsync(async (req, res) => {
  const companyData = req.body;
  const result = await UserServices.register(companyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin Credentials has been sent to your email!',
    data: result,
  });
});

export const UserControllers = {
  register
};
