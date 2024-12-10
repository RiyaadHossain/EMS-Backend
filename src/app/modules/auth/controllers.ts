import catchAsync from '@/shared/catchAsync';
import { CookieOptions, RequestHandler } from 'express';
import { AuthServices } from './services';
import config from '@/config';
import sendResponse from '@/shared/sendResponse';
import httpStatus from 'http-status';

const login: RequestHandler = catchAsync(async (req, res) => {
  const userCredential = req.body;
  const { refreshToken, accessToken } = await AuthServices.login(
    userCredential
  );

  // Set Cookie
  const cookieExpires = new Date(
    new Date().getTime() + 365 * 24 * 60 * 60 * 1000
  );
  const cookieOptions: CookieOptions = {
    secure: config.ENV === 'production',
    httpOnly: true,
    expires: cookieExpires,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: { accessToken },
  });
});

export const AuthControllers = {
  login,
};
