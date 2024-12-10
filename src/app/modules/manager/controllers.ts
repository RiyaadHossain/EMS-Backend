/* eslint-disable @typescript-eslint/ban-ts-comment */
import catchAsync from '@/shared/catchAsync';
import { RequestHandler } from 'express';
import sendResponse from '@/shared/sendResponse';
import httpStatus from 'http-status';
import { ManagerServices } from './services';


const get: RequestHandler = catchAsync(async (req, res) => {
  const result = await ManagerServices.get();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Manager Information retvied succesfully',
    data: result,
  });
});



export const ManagerControllers = {
  get
};
